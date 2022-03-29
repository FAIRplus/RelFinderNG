import { TestBed } from '@angular/core/testing';

import { SPARQLResultParserService } from './sparqlresult-parser.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Endpoint } from 'src/app/models/endpoint.model';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('SPARQLResultParserService', () => {
  let service: SPARQLResultParserService;
  let httpMock: HttpTestingController;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SPARQLResultParserService],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(SPARQLResultParserService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#parse_dbpedia_response should parse the dbpedia response', (done) => {
    spyOn(service, "parse_dbpedia_response").and.callThrough();
    let objectList = [nodeResUrl+"Rohit_Sharma",nodeResUrl+"Virat_Kohli"];
    let connectedNode = 3;
    let resPonseData = {"head":{"link":[],"vars":["middle","pf1","ps1"]},"results":{"distinct":false,"ordered":true,"bindings":[{"middle":{"type":"uri","value":nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/team2OdisMostRuns"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/motm"}},{"middle":{"type":"uri","value":nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/motm"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/motm"}},{"middle":{"type":"uri","value":nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/playerOfOdiSeries"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/motm"}},{"middle":{"type":"uri","value":nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/team1OdisMostRuns"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/motm"}},{"middle":{"type":"uri","value":nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/playerOfOdiSeries"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/motm"}},{"middle":{"type":"uri","value":nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/motm"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/motm"}},{"middle":{"type":"uri","value":nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/team1Twenty20sMostRuns"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/team1OdisMostRuns"}},{"middle":{"type":"uri","value":nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/playerOfTwenty20Series"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/team1OdisMostRuns"}},{"middle":{"type":"uri","value":nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311"},"pf1":{"type":"uri","value":"http://dbpedia.org/property/motm"},"ps1":{"type":"uri","value":"http://dbpedia.org/property/team1OdisMostRuns"}}]}};
    let nodeConnection = [nodeResUrl+"Rohit_Sharma",nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma",nodeResUrl+"Virat_Kohli",nodeResUrl+"Rohit_Sharma",nodeResUrl+"Virat_Kohli"];
  
    let paths = service.parse_dbpedia_response(objectList, connectedNode, resPonseData, nodeConnection);
    expect(service.parse_dbpedia_response).toHaveBeenCalled();
    expect(paths[0][0]).toContain(nodeResUrl+"Rohit_Sharma");

    done();
  });

  it('#getUrl should return the dbpedia URL', (done) => {
    spyOn(service, "getUrl").and.callThrough();
    let url = service.getUrl(getDummyEndpointObj());
    expect(service.getUrl).toHaveBeenCalled();
    expect(url).toEqual(testConfigData.endpointURI+"/sparql?");
    done();
  });

  function getDummyEndpointObj(): Endpoint {
    let endpoint: Endpoint = {
      active: false,
      name: "dummy",
      id: "dummy",
      description: "dummy",
      endpointURI: testConfigData.endpointURI,
      dontAppendSparql: false,
      defaultGraphURI: "dummy",
      isVirtuoso: true,
      useProxy: true,
      method: "POST",
      autocompleteURIs: ["dummy"],
      autocompleteLanguage: "en",
      ignoredProperties: [''],
      abstractURIs: [''],
      imageURIs: [''],
      linkURIs: [''],
      maxRelationLength: 3,
      queryType: 'VIR'       
    }
    return endpoint;
  }

});
