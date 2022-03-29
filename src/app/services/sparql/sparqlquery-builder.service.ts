import { Injectable } from '@angular/core';
import { ConfigurationsService } from '../configurations/configurations.service';
import { SparqlPropertyService } from './sparql-property.service';

@Injectable({
  providedIn: 'root'
})
export class SPARQLQueryBuilderService {
  basicGraph: any;
  prefixes: any = "";
  contentType: string = "application/sparql-results+xml"
  connectedDirectly: number = 0;
  connectedDirectlyInverted: number = 1;
  connectedViaMiddle: number = 2;
  connectedViaMiddleInverted: number = 3;
  queries = [];

  constructor(private configService: ConfigurationsService,private sparqlProp:SparqlPropertyService) {
   }

  findRelation(object1: any, object2: any) {
    //this.sparqlProp.sparqlPropertyResource('http://dbpedia.org/resource/List_A_cricket');
    const maxLimit = 10;
    var ignoredObjects: [];
    const avoidCycles = 2;
    var ignoredProperties = this.configService.getActiveEndpoint().ignoredProperties;

    return this.buildQueries(object1, object2, this.configService.getActiveEndpoint().maxRelationLength, maxLimit, ignoredObjects,
      ignoredProperties, avoidCycles);
  }


  prefixesMap() {
    const db: string = "http://dbpedia.org/resource/";
    const rdf: string = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    const skos: string = "http://www.w3.org/2004/02/skos/core#";
    var prefixes = new Map();
    prefixes.set('db', db);
    prefixes.set('rdf', rdf);
    prefixes.set('skos', skos);
    return prefixes;
  }

  buildQueries(_obj1: string, _obj2: string, _maxDist: number, _maxNum: number, _ignoredObjects: any, _ignoredProperties: string[], _avoidCycles: number) {
    var maxLength: number = parseInt(_maxDist.toString()) + 1;
    var queriesObj = this.getQueries(_obj1, _obj2, maxLength, _maxNum, _ignoredObjects, _ignoredProperties, _avoidCycles);
    return queriesObj;
  }


  getQueries(object1: string, object2: string, maxDistance: number, limit: number,
    ignoredObjects: any, ignoredProperties: string[], avoidCycles: number) {

    var queries = new Map();
    var options = {
      'object1': object1,
      'object2': object2,
      'limit': limit,
      'ignoredObjects': ignoredObjects,
      'ignoredProperties': ignoredProperties,
      'avoidCycles': avoidCycles
    };

    for (var distance: number = 1; distance <= maxDistance; distance++) {
      // get direct connection in both directions

      queries.set(this.direct(object1, object2, distance, options), this.connectedDirectly);
      queries.set(this.direct(object2, object1, distance, options), this.connectedDirectlyInverted);

      for (var a: number = 1; a <= distance; a++) {
        for (var b: number = 1; b <= distance; b++) {
          if ((a + b) == distance) {
            (queries.set(this.connectedViaAMiddleObject(object1, object2, a, b, true, options), this.connectedViaMiddle));
            (queries.set(this.connectedViaAMiddleObject(object1, object2, a, b, false, options), this.connectedViaMiddleInverted));
          }
        }
      }
    }
    return queries;
  }


  direct(object1: string, object2: string, distance: any, options: any) {
    var vars = {};
    vars['obj'] = [];
    vars['pred'] = [];
    let query:string ;
    if (distance == 1) {
      query = this.uri(object1) + ' ?pf1 ' + this.uri(object2);
      vars['pred'].push('?pf1');
      return this.completeQuery(query, options, vars);

    } else {
      query = this.uri(object1) + ' ?pf1 ?of1 ' + ".\n";
      vars['pred'].push('?pf1');
      vars['obj'].push('?of1');
      for (var i = 1; i < distance - 1; i++) {
        query += '?of' + i + ' ?pf' + (i + 1) + ' ?of' + (i + 1) + ".\n";
        vars['pred'].push('?pf' + (i + 1));
        vars['obj'].push('?of' + (i + 1));
      }
      query += '?of' + (distance - 1) + ' ?pf' + distance + ' ' + this.uri(object2);
      vars['pred'].push('?pf' + distance);
      //$vars['obj'][] = '?of'.($distance-1);
      return this.completeQuery(query, options, vars);
    }
  }


  completeQuery(coreQuery: string, options: any, vars: any) {
    var completeQuery: string = '';
    var limit: string = "";
    let old: string = "";

    completeQuery += 'SELECT * WHERE {' + "\n";
    completeQuery += coreQuery + "\n";
    completeQuery += this.generateFilter(options, vars) + "\n";
    
    if (options.limit != null) {
      limit = 'LIMIT ' + options.limit;
    }
    completeQuery += '} ' + limit;
    completeQuery = completeQuery.split("\n").join(" ");
    while (old != completeQuery) {
      old = completeQuery;
      completeQuery = completeQuery.split("  ").join(" ");
    }
  
    return completeQuery;
  }

  generateFilter(options: any, vars: any) {
    var filterterms = [];
    for (var pred of vars['pred']) {
      // ignore properties 
      if (options && options.ignoredProperties != null && options.ignoredProperties.length > 0) {
        for (var ignored of options.ignoredProperties) {
          filterterms.push(pred + ' != ' + this.uri(ignored) + ' ');
        }
      }

    }
    for (var obj of vars['obj']) {
      // ignore literals
      filterterms.push(filterterms.push('!isLiteral(' + obj + ')'));
      // ignore objects
      if (options && options.ignoredObjects != null && options.ignoredProperties != null && (options.ignoredObjects.length > 0)) {
        for (var ignoredObj of options.ignoredObjects) {
          filterterms.push(obj + ' != ' + this.uri(ignoredObj) + ' ');
        }
      }

      if (options && options.avoidCycles != null) {
        // object variables should not be the same as object1 or object2
        if (options.avoidCycles > 0) {
          filterterms.push(obj + ' != ' + this.uri(options.object1) + ' ');
          filterterms.push(obj + ' != ' + this.uri(options.object2) + ' ');
        }
        // object variables should not be the same as any other objectvariables
        if (options.avoidCycles > 1) {
          for (var otherObj of (vars['obj'])) {
            if (obj != otherObj) {
              filterterms.push(obj + ' != ' + otherObj + ' ');
            }
          }
        }
      }
    }
    // console.log("Filter terms before length"+filterterms)
    if (filterterms.length == 0) {
      return "";
    }
    //console.log("Filter terms"+this.expandTerms(filterterms, '&&'));
    return 'FILTER ' + this.expandTerms(filterterms, '&&') + '. ';
  }

  expandTerms(terms: any, operator: string = "&&") {
    var result: string = "";
    for (var x: number = 0; x < terms.length; x++) {
      result += "(" + terms[x] + ")";
      result += (x + 1 == terms.length) ? "" : " " + operator + " ";
      result += "\n";
    }
    return "(" + result + ")";
  }


  uri(uri: string): string {
    return "<" + uri + ">";
  }

  connectedViaAMiddleObject(first: string, second: string, dist1: number, dist2: number,
    toObject: boolean, options: any) {
    // var properties= new Map();
    var vars = {};
    vars['pred'] = [];
    vars['obj'] = [];
    vars['obj'].push('?middle');
    var fs: string = 'f';
    var tmpdist: any = dist1;
    var twice: number = 0;
    var coreQuery: string = "";
    var object: string = first;

    // to keep the code compact I used a loop
    // subfunctions were not appropiate since information for filters is collected
    // basically the first loop generates $first-pf1->of1-pf2->middle
    // while the second generates $second -ps1->os1-pf2->middle
    while (twice < 2) {

      if (tmpdist == 1) {
        coreQuery += this.toPattern(this.uri(object), '?p' + fs + '1', '?middle', toObject);
        vars['pred'].push('?p' + fs + '1');
      } else {
        coreQuery += this.toPattern(this.uri(object), '?p' + fs + '1', '?o' + fs + '1', toObject);
        vars['pred'].push('?p' + fs + '1');

        for (var x: number = 1; x < tmpdist; x++) {
          var s: string = '?o' + fs + '' + x;
          var p: string = '?p' + fs + '' + (x + 1);
          vars['obj'].push(s);
          vars['pred'].push(p);
          if ((x + 1) == tmpdist) {
            coreQuery += this.toPattern(s, p, '?middle', toObject);
          } else {
            coreQuery += this.toPattern(s, p, '?o' + fs + '' + (x + 1), toObject);
          }
        }
      }
      twice++;
      fs = 's';
      tmpdist = dist2;
      object = second;

    }//end while

    return this.completeQuery(coreQuery, options, vars);
  }

  /**
   * Helper function to reverse the order 
   */
  toPattern(s: string, p: string, o: string, toObject: boolean) {
    if (toObject) {
      return s + ' ' + p + ' ' + o + " . \n";
    } else {
      return o + ' ' + p + ' ' + s + " . \n";
    }

  }

}
