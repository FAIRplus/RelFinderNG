import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { ConfigurationsService } from '../configurations/configurations.service';
import { ConstantsService } from '../util/constants.service';
import { SparqlPropertyService } from './sparql-property.service';


@Injectable({
  providedIn: 'root'
})
export class SPARQLResultParserService {

  constructor(private httpClient: HttpClient, private configSerice: ConfigurationsService, private constantService: ConstantsService, private sparqlPropertyService: SparqlPropertyService) {
  }
  public dataNodeVal: number = 0;
  public relPathCount: number = 0;
  mapProperty = new Map<string, {}>();


  parse_dbpedia_response(objectList: string[], connectedNode: any, resPonseData: any, nodeConnection: any[]) {

    this.dataNodeVal = connectedNode;
    var headValues = resPonseData['head']['vars'];
    let tempObjList = [...objectList];
    if (connectedNode == 1) {
      tempObjList.reverse();
    }
    headValues.unshift(tempObjList[0]);
    headValues.push(tempObjList[1]);
    var path_lists: any[] = this.splitList(headValues);
    var paths = []
    for (var path_values of resPonseData['results']['bindings']) {
      var path = [];
      this.relPathCount += 1;
      if (path_lists.length > 1) {
        for (var list of path_lists) {
          path.push(this.getTriples(tempObjList, list, path_values, this.relPathCount, nodeConnection));
        }
      } else {
        path.push(this.getTriples(tempObjList, path_lists, path_values, this.relPathCount, nodeConnection));
      }
      for (let value of path) {
        paths.push(value);
      }
    }
    return paths;
  }

  getTriples(inputObje: string[], list: string[], path_values: any, relPathCount: number, nodeConnection: any[]) {

    var offset = 0;
    var sizeVal: number = list.join("_SEP_").split("_SEP_").length;
    var offset_limit = sizeVal - 3;
    let i: number = 0;
    var triples = [];
    while (offset <= offset_limit) {
      var path_step = list.join("_SEP_").split("_SEP_").slice(offset, (offset + 3));
      var tripleComposeData: any[];
      tripleComposeData = this.compose_triple(path_step, path_values)
      if (this.dataNodeVal == 3) {
        nodeConnection.push(tripleComposeData[2]);
        nodeConnection.push(tripleComposeData[0]);
        triples.push(inputObje.join('|').concat("|").concat(relPathCount.toString().concat("|").concat(tripleComposeData[2]).concat("|").concat(tripleComposeData[1]).concat("|").concat(tripleComposeData[0])));
      } else {
        nodeConnection.push(tripleComposeData[0]);
        nodeConnection.push(tripleComposeData[2]);
        triples.push(inputObje.join('|').concat("|").concat(relPathCount.toString().concat("|").concat(tripleComposeData[0]).concat("|").concat(tripleComposeData[1]).concat("|").concat(tripleComposeData[2])));
      }
      offset += 2
    }
    return triples;
  }

  splitList(list: any) {
    if (list.includes('middle')) {
      return this.reconstruct_vars_order(list)
    }
    else {
      return [list];
    }
  }

  reconstruct_vars_order(varlist: any) {
    let totalOrderList = [];
    var left = []
    var right = []
    let elements: any[] = varlist.slice(1, varlist.length - 1);
    for (let elem of elements) {
      if (elem.length > 0) {
        let arrayValuetoSpecific: string[] = Array.from<any>(elem);
        if (arrayValuetoSpecific[1] == 'f')
          left.push(elem);
        else if (arrayValuetoSpecific[1] == 's')
          right.push(elem)
        else if (elem == 'middle') { 
          //for middle relation
        }
      }
    }

    left = this.reorder_list(left, true)
    right = this.reorder_list(right, false)

    right.reverse();

    left.unshift(varlist[0]);
    left.push('middle');
    right.unshift('middle');
    right.push(varlist[varlist.length - 1]);
    right.reverse();

    totalOrderList.push(left);
    totalOrderList.push(right);
    return totalOrderList;
  }

  reorder_list(list: any[], isTrue: boolean) {
    var prop: string | any[];
    var obj: string | any[];
    var list_ord = [];
    if (isTrue) {
      prop = 'pf'
      obj = 'of'
    }
    else {
      prop = 'ps'
      obj = 'os'
    }

    let cnt = 1
    list = this.removeElement(prop.concat(cnt.toString()), list);
    list_ord.push(prop.concat(cnt.toString()));

    while (true) {
      if (list.length == 0) {
        return list_ord;
      } else {
        list = this.removeElement(obj.concat(cnt.toString()), list);
        list_ord.push(obj.concat(cnt.toString()));
        cnt += 1
        list = this.removeElement(prop.concat(cnt.toString()), list);
        list_ord.push(prop.concat(cnt.toString()));
      }
    }
  }

  removeElement(objItem: string, list: any[]) {
    list.forEach((item, index) => {
      if (item === objItem) list.splice(index, 1);
    });
    return list;
  }

  compose_triple(triple_names: any[], triple_values: any) {
    var s: any, p: any, o: any;
    try {
      s = triple_values[triple_names[0]]['value'];
    } catch (error) {
      s = triple_names[0];
    }
    p = triple_values[triple_names[1]]['value'];
    try {
      o = triple_values[triple_names[2]]['value'];
    } catch (error) {
      o = triple_names[2];
    }
    return [s, p, o];
  }

  fetchData(query: string) {
    let activeEndpoint = this.configSerice.getActiveEndpoint();
    let headers: HttpHeaders = new HttpHeaders({
      'Content-type': 'application/json'
    });
    let params = new HttpParams();
    if (activeEndpoint.defaultGraphURI) {
      params = params.append('default-graph-uri', activeEndpoint.defaultGraphURI);
    }
    params = params.append('query', query);
    params = params.append('format', 'json');
    let url = this.getUrl(activeEndpoint);

    return this.httpClient.post<any>(url, null,
      { headers: headers, params: params, responseType: 'json' });
  }

  getUrl(endpoint: Endpoint) {
    let url = this.constantService.dbpediaSparqlUri;
    let appendant = "";
    if (endpoint.dontAppendSparql) {
      appendant = "?";
    } else {
      appendant = "/sparql?"
    }
    url = endpoint.endpointURI + appendant;
    return url;
  }
}
