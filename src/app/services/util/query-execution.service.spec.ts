import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QueryExecutionService } from './query-execution.service';
import { ConfigurationsService } from '../configurations/configurations.service';
import { ConstantsService } from './constants.service';
import { Endpoint } from 'src/app/models/endpoint.model';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';


describe('QueryExecutionService', () => {
    let service: QueryExecutionService;
    let configService: ConfigurationsService;
    let constantService: ConstantsService;
    let httpMock: HttpTestingController;
    let activeEndpoint: Endpoint;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let nodeResUrl = testConfigData.nodeResource;

    beforeEach(() => { 
        TestBed.configureTestingModule({
            providers: [QueryExecutionService],
            imports: [
              HttpClientTestingModule
            ]
          });    

          service = TestBed.get(QueryExecutionService);
          httpMock = TestBed.get(HttpTestingController);
          constantService = TestBed.get(ConstantsService);
          configService = TestBed.get(ConfigurationsService);
          configService.setConfigData();
          activeEndpoint = configService.getActiveEndpoint();          
    });

    afterEach(() => {
        httpMock.verify();
    });
  
    it('#executeQuery should execute the aparql query and return response', (done) => {        
        let dummyData = gerDummyData();
        service.executeQuery(getQuery()).subscribe(data => {
           expect(data.results.bindings.length).toBe(3);
           expect(data).toEqual(dummyData);
           done();
        }, error => {
           console.log("error here " + error.message);
           expect(error.message).toBe('Timeout has occurred error');
        });
       
        const req = httpMock.expectOne(req =>{
          let url = constantService.dbpediaSparqlUri;
          let appendant = "";
          if (activeEndpoint.dontAppendSparql) {
              appendant = "?";
          } else {
              appendant = "/sparql?"
          }      
          url = activeEndpoint.endpointURI + appendant;
          return (req.method === 'POST' && req.url.trim() === url.trim());
        });
        expect(req.request.method).toBe("POST");
        req.flush(dummyData);
    });

    it('#getParams should set set the HttpParam values.', (done) => {
        let query = getQuery();
        let param = service.getParams(activeEndpoint, query);
        expect(param.get('format')).toEqual('json');        
        expect(param.get('query')).toEqual(query);
        done();
    });

    it('#getUrl should return the endpoint url', (done) => {
        let url = service.getUrl(activeEndpoint);
        expect(url).toContain('/sparql?');        
        expect(url).toContain(activeEndpoint.endpointURI);
        done();
    });

    it('#fetchResource should return the resource URI', (done) => {
        let resUri = service.fetchResource(getQuery());
        expect(resUri).toEqual(nodeResUrl+'Bihar');
        done();
    });

    it('#fetchForkJoinObj should execute the multiple queries.', (done) => {
        let dummyData = gerDummyData();
        let query = getQuery();
        service.fetchForkJoinObj([query]).subscribe((data) => {
            expect(data.length).toEqual(1);
            expect(data[0]).toEqual(dummyData);
            done();
        });

        const req = httpMock.expectOne(req =>{
            let url = constantService.dbpediaSparqlUri;
            let appendant = "";
            if (activeEndpoint.dontAppendSparql) {
                appendant = "?";
            } else {
                appendant = "/sparql?"
            }      
            url = activeEndpoint.endpointURI + appendant;
            return (req.method === 'POST' && req.url.trim() === url.trim());
          });
          expect(req.request.method).toBe("POST");
          req.flush(dummyData);
    });
  

  function getQuery() {
    return 'SELECT ?class WHERE {<'+nodeResUrl+'Bihar> a ?class . OPTIONAL { ?subClass <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?class } . FILTER (!bound(?subClass)) . FILTER (?class != <http://dbpedia.org/ontology/Resource>) . }';
  }

  function gerDummyData() {
    return { "head": { "link": [], "vars": ["class"] },
    "results": { "distinct": false, "ordered": true, "bindings": [
      { "class": { "type": "uri", "value": "http://schema.org/Place" }},
      { "class": { "type": "uri", "value": "http://www.opengis.net/gml/_Feature" }},
      { "class": { "type": "uri", "value": "http://www.w3.org/2004/02/skos/core#Concept" }} ] } };        
  }

});