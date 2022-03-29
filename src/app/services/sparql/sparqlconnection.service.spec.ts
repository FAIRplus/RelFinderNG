import { TestBed } from '@angular/core/testing';

import { SPARQLConnectionService } from './sparqlconnection.service';
import { ConfigurationsService } from '../configurations/configurations.service';
import { SPARQLQueryBuilderService } from './sparqlquery-builder.service';
import { ConstantsService } from '../util/constants.service';
import { SPARQLResultParserService } from './sparqlresult-parser.service';
import { QueryExecutionService } from '../util/query-execution.service';
import { SparqlPropertyService } from './sparql-property.service';
import { bindCallback } from 'rxjs';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RelFinder } from 'src/app/base/frame/relfinder';
import { GraphService } from 'src/app/base/service/graph-service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('SPARQLConnectionService', () => {
  let service: SPARQLConnectionService;
  let configService: ConfigurationsService;
  let sparqlQueryBuilderService: SPARQLQueryBuilderService;
  let constantService: ConstantsService;
  let sparqlParser: SPARQLResultParserService;
  let execService: QueryExecutionService;
  let sparqlPropertyService:SparqlPropertyService;
  let httpMock: HttpTestingController;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;

    beforeEach(() => { 
        TestBed.configureTestingModule({
            providers: [SPARQLConnectionService],
            imports: [
              HttpClientTestingModule
            ]
          });
          service = TestBed.get(SPARQLConnectionService);
          httpMock = TestBed.get(HttpTestingController);
          configService = TestBed.get(ConfigurationsService);
          sparqlQueryBuilderService = TestBed.get(SPARQLQueryBuilderService);
          constantService = TestBed.get(ConstantsService);
          sparqlParser = TestBed.get(SPARQLResultParserService);
          execService = TestBed.get(QueryExecutionService);
          sparqlPropertyService = TestBed.get(SparqlPropertyService);
          configService.setConfigData();
          configService.setActiveEndpoint('dbp');
          service.selectedSources = [nodeResUrl+"Rohit_Sharma", nodeResUrl+"Virat_Kohli"];
          let container = document.createElement('div');
           container.setAttribute('id', 'loadGraph');
           let relfinderObjTest = new RelFinder(container);
           service.relfinderObj=relfinderObjTest;
           service.relfinderObj.setSelectedSources([nodeResUrl+"Rohit_Sharma", nodeResUrl+"Virat_Kohli"]);
          service.graphService = new GraphService();
          
    });
  
    xit('#loadClasses should prepare and execute multiple queries and set their response in classUrisWithResUris.', (done) => {
      service.nodeListOfIds = [nodeResUrl+"Rohit_Sharma", nodeResUrl+"Virat_Kohli"];
      service.loadClasses(service.dataUpdateSubject);
      const req = httpMock.expectOne(req =>{
        let activeEndpoint = configService.getActiveEndpoint();
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
      req.flush([]);      
      done();
    });

    it('#loadClasses should prepare and execute multiple node URI values.', (done) => {
      spyOn(service, "loadClasses").and.callThrough();
      service.nodeListOfIds = [nodeResUrl+"Rohit_Sharma", nodeResUrl+"Virat_Kohli"];
      service.loadClasses(service.dataUpdateSubject);
      expect(service.loadClasses).toHaveBeenCalled(); 
      done();
    });

    it('#findRelation should set the selected resource and call formtDataResouces method.', (done) => {
      spyOn(service, "formtDataResouces").and.callThrough();
      let selectedSources = [nodeResUrl+"Rohit_Sharma", nodeResUrl+"Virat_Kohli"];
      service.selectedSources=selectedSources;
      service.formtDataResouces(false);
      expect(service.formtDataResouces).toHaveBeenCalled();
      expect(service.getSources()[0]).toEqual(nodeResUrl+"Rohit_Sharma");
      expect(service.getSources()[1]).toEqual(nodeResUrl+"Virat_Kohli");
      done();
    });

    it('#sourceDataInitialize should initialize the graph loading.', (done) => {
      spyOn(service, "sourceDataInitialize").and.callThrough();
      let dataSrces = [nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|1|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/property/column|"+nodeResUrl+"One_Day_International",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|1|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/property/column|"+nodeResUrl+"One_Day_International",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|2|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/property/column|"+nodeResUrl+"First-class_cricket",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|2|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/property/column|"+nodeResUrl+"First-class_cricket",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|3|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/property/column|"+nodeResUrl+"List_A_cricket",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|3|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/property/column|"+nodeResUrl+"List_A_cricket",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|4|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/team2OdisMostRuns|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|4|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|5|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|5|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|6|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/playerOfOdiSeries|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|6|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|7|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|7|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|8|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/playerOfOdiSeries|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|8|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|9|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|9|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|10|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1Twenty20sMostRuns|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|10|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|11|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/playerOfTwenty20Series|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|11|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|12|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/motm|"+nodeResUrl+"Rohit_Sharma",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|12|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|13|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/ontology/country|"+nodeResUrl+"India",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|13|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/ontology/birthPlace|"+nodeResUrl+"Delhi",nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|13|"+nodeResUrl+"Delhi|http://dbpedia.org/ontology/country|"+nodeResUrl+"India"];
      service.sourceDataInitialize(dataSrces);
      expect(service.sourceDataInitialize).toHaveBeenCalledWith(dataSrces);
      done();
    });

    it('#clearGraph will clear the graph data.', (done) => {
      spyOn(service, "clearGraph").and.callThrough();
      service.clearGraph();
      expect(service.clearGraph).toHaveBeenCalled();
      done();
    });

    it('#clearMessages will clear the language subject', (done) => {
      spyOn(service, "clearMessages").and.callThrough();
      service.clearMessages();
      expect(service.clearMessages).toHaveBeenCalled();
      done();
    });

    it('#cancelHttpRequestCalls will unsubscribe httpForkJoinSubscription', (done) => {
      spyOn(service, "cancelHttpRequestCalls").and.callThrough();
      service.cancelHttpRequestCalls();
      expect(service.cancelHttpRequestCalls).toHaveBeenCalled();
      done();
    });

    it('#preparePropertyHasValueQuery', (done) => {
      spyOn(service, "preparePropertyHasValueQuery").and.callThrough();
      let query = service.preparePropertyHasValueQuery(nodeResUrl+"Rohit_Sharma");
      expect(service.preparePropertyHasValueQuery).toHaveBeenCalled();
      expect(query).toContain(nodeResUrl+"Rohit_Sharma");
      done();
    });

    it('#prepareClassQueryData with by using NodeURI', (done) => {
      spyOn(service, "loadClassData").and.callThrough();
      let query = service.prepareClassQuery(nodeResUrl+"Rohit_Sharma");
      service.loadClassData([query],service.dataUpdateSubject);
      expect(service.loadClassData).toHaveBeenCalled();
      expect(query).toContain(nodeResUrl+"Rohit_Sharma");
      done();
    });
     
    function getSource(first: number, second: string, third: string) {
      return first+'|'+nodeResUrl+second+'|http://…|'+nodeResUrl+third;
    }

  
});
