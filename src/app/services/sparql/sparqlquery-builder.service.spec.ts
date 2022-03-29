import { TestBed } from '@angular/core/testing';

import { SPARQLQueryBuilderService } from './sparqlquery-builder.service';
import { ConfigurationsService } from '../configurations/configurations.service';
import { SparqlPropertyService } from './sparql-property.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

  describe('SPARQLQueryBuilderService', () => {
    let service: SPARQLQueryBuilderService;
    let configService: ConfigurationsService; 
    let sparqlProp: SparqlPropertyService;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let nodeResUrl = testConfigData.nodeResource;
    
    beforeEach(() => {TestBed.configureTestingModule({
      providers: [SPARQLQueryBuilderService]
    });

    configService = TestBed.get(ConfigurationsService);
    sparqlProp = TestBed.get(SparqlPropertyService);
    service = TestBed.get(SPARQLQueryBuilderService);
    configService.setConfigData();
    configService.setActiveEndpoint('dbp');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#findRelation should return map of queries', (done) => {
    let result = service.findRelation(nodeResUrl+"Rohit_Sharma", nodeResUrl+"Virat_Kohli");
    expect(result.get(getDummyQuery())).toEqual(1);
    done();
  });

  it('#prefixesMap should return the prefixes', (done) => {
    let result = service.prefixesMap();
    expect(result.get('db')).toEqual(nodeResUrl);
    expect(result.get('rdf')).toEqual('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    expect(result.get('skos')).toEqual('http://www.w3.org/2004/02/skos/core#');
    done();
  });

  function getDummyQuery() {
    return 'SELECT * WHERE { <'+nodeResUrl+'Virat_Kohli> ?pf1 <'+nodeResUrl+'Rohit_Sharma> FILTER ((?pf1 != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ) && (?pf1 != <http://www.w3.org/2004/02/skos/core#subject> ) && (?pf1 != <http://dbpedia.org/property/wikiPageUsesTemplate> ) && (?pf1 != <http://dbpedia.org/property/wordnet_type> ) && (?pf1 != <http://dbpedia.org/property/wikilink> ) && (?pf1 != <http://dbpedia.org/ontology/wikiPageWikiLink> ) && (?pf1 != <http://www.w3.org/2002/07/owl#sameAs> ) && (?pf1 != <http://purl.org/dc/terms/subject> ) ). } LIMIT 10';
  }

});
