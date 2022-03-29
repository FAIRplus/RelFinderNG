import { Endpoint } from '../../models/endpoint.model';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { QueryToolService } from './query-tool.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('QueryToolService', () => {
  let queryService: QueryToolService;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        HttpClientModule,
      ]
    })
    queryService = TestBed.get(QueryToolService);
  });

  it('should be created', () => {
    const service: QueryToolService = TestBed.get(QueryToolService);
    expect(service).toBeTruthy();
  });

  xit('invoke DBpedia with sample query', () => {
    let query = 'select distinct ?Concept where {[] a ?Concept} LIMIT 10';
    let endPoint = getDBpediaEndpoint();
    let response = queryService.executeQuery(query, endPoint).subscribe(res => {
      // expect(res).toBeTruthy();
      // expect(res.results).toBe(10);
      return JSON.stringify(res.results);
    });
    expect(response).toBeTruthy();
  });

  function getDBpediaEndpoint(): Endpoint {
    return {
      "active": true,
      "name": testConfigData.name,
      "id": testConfigData.id,
      "description": testConfigData.description,
      "endpointURI": testConfigData.endpointURI,
      "dontAppendSparql": false,
      "defaultGraphURI": testConfigData.defaultGraphURI,
      "isVirtuoso": true,
      "useProxy": false,
      "method": "POST",
      "autocompleteURIs": testConfigData.autocompleteURIs,
      "autocompleteLanguage": "en",
      "ignoredProperties": testConfigData.ignoredProperties,
      "abstractURIs": testConfigData.abstractURIs,
      "imageURIs": testConfigData.imageURIs,
      "linkURIs": testConfigData.linkURIs,
      "maxRelationLength": 2,
      "queryType": "CMP"
    };
  }

});
