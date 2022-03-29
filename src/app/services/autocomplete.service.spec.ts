import { AutoCompleteService } from "./autocomplete.service";
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConstantsService } from './util/constants.service';
import { FormControl, AbstractControl } from '@angular/forms';
import { ConfigurationsService } from './configurations/configurations.service';
import { Endpoint } from '../models/endpoint.model';
import { Subscription } from 'rxjs';
import { TestConfUtil } from '../test/test-conf.util';
import { TestConfigModel } from '../test/test-config.model';


describe('AutoCompleteService', () => {
    let service: AutoCompleteService;
    let httpMock: HttpTestingController;
    let constantService: ConstantsService;
    let configService: ConfigurationsService;
    let activeEndpoint: Endpoint;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let nodeResUrl = testConfigData.nodeResource;

    beforeEach(() => { 
        TestBed.configureTestingModule({
            providers: [AutoCompleteService],
            imports: [
              HttpClientTestingModule
            ]
          });    

          service = TestBed.get(AutoCompleteService);
          httpMock = TestBed.get(HttpTestingController);
          constantService = TestBed.get(ConstantsService);
          configService = TestBed.get(ConfigurationsService);
          configService.setConfigData();
          activeEndpoint = configService.getActiveEndpoint();
    });

    afterEach(() => {
        httpMock.verify();
    });
  
    it('#prepareQueryAndGetData should return value from observable', (done) => {        
        
        const dummyData = {
            results: {
                bindings: [
                    {
                      "sub": {
                        "type": "uri",
                        "value": nodeResUrl+"Rohit_Sharma"
                      },
                      "middle": {
                        "type": "literal",
                        "xml:lang": "en",
                        "value": "Rohit Sharma"
                      },
                      "count": {
                        "type": "typed-literal",
                        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
                        "value": "269"
                      }
                    },
                    {
                      "sub": {
                        "type": "uri",
                        "value": nodeResUrl+"Rohit_Shetty"
                      },
                      "middle": {
                        "type": "literal",
                        "xml:lang": "en",
                        "value": "Rohit Shetty"
                      },
                      "count": {
                        "type": "typed-literal",
                        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
                        "value": "157"
                      }
                    },
                    {
                      "sub": {
                        "type": "uri",
                        "value": nodeResUrl+"Rohit_Roy"
                      },
                      "middle": {
                        "type": "literal",
                        "xml:lang": "en",
                        "value": "Rohit Roy"
                      },
                      "count": {
                        "type": "typed-literal",
                        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
                        "value": "89"
                      }
                    },
                    {
                      "sub": {
                        "type": "uri",
                        "value": nodeResUrl+"Nara_Rohit"
                      },
                      "middle": {
                        "type": "literal",
                        "xml:lang": "en",
                        "value": "Nara Rohit"
                      },
                      "count": {
                        "type": "typed-literal",
                        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
                        "value": "75" 
                      }
                    },
                    {
                      "sub": {
                        "type": "uri",
                        "value": nodeResUrl+"Rohit_Chand"
                      },
                      "middle": {
                        "type": "literal",
                        "xml:lang": "en",
                        "value": "Rohit Chand"
                      },
                      "count": {
                        "type": "typed-literal",
                        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
                        "value": "50"
                      }
                    }
                 ]
            }
        };

        service.prepareQueryAndGetData('Rohit').subscribe(data => {
           expect(data.results.bindings.length).toBe(5);
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

    it('#prepareQueryAndGetData should return #"No Record Found, try again" for given input from observable', (done) => {        
        
      const dummyData = {"results": {"bindings":[{"middle": {"value": "No Record Found, try again"}}]}};

      service.prepareQueryAndGetData('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').subscribe(data => {
         expect(data.results.bindings.length).toBe(1);
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

  it('#getAutoCompleteData should set data for #searchResult.', () => {
    let control = new FormControl();
    control.setValue('Rohit');

    const binding = {
      "sub": {
        "type": "uri",
        "value": nodeResUrl+"Rohit_Sharma"
      },
      "middle": {
        "type": "literal",
        "xml:lang": "en",
        "value": "Rohit Sharma"
      },
      "count": {
        "type": "typed-literal",
        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
        "value": "269"
      }
    };

    let spy = spyOn(service, 'getAutoCompleteData').and.callFake((searchedKey:AbstractControl, idx: number) => {
        service.searchResult = [];
        service.searchResult.push(binding);
    });
    
    service.getAutoCompleteData(control, 0);
    
    expect(spy).toHaveBeenCalledWith(control, 0);
    expect(service.searchResult).not.toBeNull();
    expect(service.searchResult.length).toEqual(1);
    expect(service.searchResult[0]).toEqual(binding);
  });

  it('#prepareStandardQuery should return query after preparing it from given endpoint.', () => {
    let endpoint = getEndpoint();
    let query = service.prepareStandardQuery('Sachin', endpoint, 20, 0);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
  });

  it('#prepareStandardQuery should return query with different scenario.', () => {
    let endpoint = getEndpoint();
    endpoint.autocompleteURIs.push('http://www.w3.org/2000/01/rdf-schema#label');
    let query = service.prepareStandardQuery('Sachin', endpoint, 20, 1);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
    expect(query).toContain('someprop'); 
    expect(query).toContain('OFFSET'); 
  });

  it('#prepareStandardQuery should return query with different scenario for else block.', () => {
    let endpoint = getEndpoint();
    endpoint.autocompleteURIs = null;
    let query = service.prepareStandardQuery('Sachin', endpoint, 20, 1);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
    expect(query).toContain('sub <http://www.w3.org/2000/01/rdf-schema#label>'); 
    expect(query).toContain('OFFSET'); 
  });

  it('#prepareMultipleWordsCompleteQuery should return query with different scenario.', () => {
    let endpoint = getEndpoint();
    endpoint.autocompleteURIs.push('http://www.w3.org/2000/01/rdf-schema#label');
    let query = service.prepareMultipleWordsCompleteQuery(endpoint,'Sachin',  20, 1);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
    expect(query).toContain('someprop'); 
    expect(query).toContain('OFFSET'); 
  });

  it('#prepareMultipleWordsCompleteQuery should return query with different scenario for else block.', () => {
    let endpoint = getEndpoint();
    endpoint.autocompleteURIs = null;
    let query = service.prepareMultipleWordsCompleteQuery(endpoint,'Sachin',  20, 1);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
    expect(query).toContain('sub <http://www.w3.org/2000/01/rdf-schema#label>'); 
    expect(query).toContain('OFFSET'); 
  });

  it('#prepareSingleWordQuery should return query with different scenario.', () => {
    let endpoint = getEndpoint();
    endpoint.autocompleteURIs.push('http://www.w3.org/2000/01/rdf-schema#label');
    let query = service.prepareSingleWordQuery(endpoint,'Sachin',  20, 1);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
    expect(query).toContain('someprop'); 
    expect(query).toContain('OFFSET'); 
  });

  it('#prepareSingleWordQuery should return query with different scenario for else block.', () => {
    let endpoint = getEndpoint();
    endpoint.autocompleteURIs = null;
    let query = service.prepareSingleWordQuery(endpoint,'Sachin',  20, 1);
    expect(query).toContain('Sachin'); // Search keyword
    expect(query).toContain('en'); // Language fron endpoint
    expect(query).toContain('20'); // Limit passed in the arguments
    expect(query).toContain('sub <http://www.w3.org/2000/01/rdf-schema#label>'); 
    expect(query).toContain('OFFSET'); 
  });
  
  it('#pushDataToAutoCompFormArr should push the data in autoCompformData and add the same data publishAutoCompData subject.', async (done) => {
    spyOn(service, "pushDataToAutoCompFormArr").and.callThrough();
    let data = {"sub":{"type":"uri","value":nodeResUrl+"Rohit_Sharma"},"middle":{"type":"literal","xml:lang":"en","value":"Rohit Sharma"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"105"}};
    service.pushDataToAutoCompFormArr(data);    
    service.getAutoCompFormData();
    let result = service.getAutoCompFormData();
    expect(service.pushDataToAutoCompFormArr).toHaveBeenCalled();
    expect(result[0].sub.value).toEqual(nodeResUrl+"Rohit_Sharma");

    await service.getAutoFormData().subscribe((data: any) => {
      expect(data[0].sub.value).toEqual(nodeResUrl+"Rohit_Sharma");
      //service.clearAutoCompFormArr();
    });
    done();
  }, 30000);

  xit('#loadGraphWithQueryData shold build the relations.', (done) => {
    spyOn(service, "loadGraphWithQueryData").and.callThrough();
    let formObj = [{"sub":{"type":"uri","value":nodeResUrl+"Rohit_Sharma"},"middle":{"type":"literal","xml:lang":"en","value":"Rohit Sharma"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"105"}},{"sub":{"type":"uri","value":nodeResUrl+"Virat_Kohli"},"middle":{"type":"literal","xml:lang":"en","value":"Virat Kohli"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"165"}}];
    service.loadGraphWithQueryData(formObj);
    expect(service.loadGraphWithQueryData).toHaveBeenCalled();
    let req = httpMock.expectOne(request =>{
      let appendant = "";
      if (activeEndpoint.dontAppendSparql) {
          appendant = "?";
      } else {
          appendant = "/sparql?"
      }      
      let url = activeEndpoint.endpointURI + appendant;
      return (request.method === 'POST' && request.url.trim() === url.trim());
    });
    expect(req.request.method).toEqual("POST");
    done();
  });

  it('#cancelAutoCompleteData will unsubscribe inputObservale.', (done) => {
    spyOn(service, "cancelAutoCompleteData").and.callThrough();
    service.inputObservale = new Subscription();
    service.cancelAutoCompleteData(1);
    expect(service.cancelAutoCompleteData).toHaveBeenCalled();
    done();
  });

  it('#clearDataOnSearchOverride will clear the data', (done) => {
    spyOn(service, "clearDataOnSearchOverride").and.callThrough();
    service.clearDataOnSearchOverride();
    expect(service.clearDataOnSearchOverride).toHaveBeenCalled();
    done();
  });

  it('#clearAppData will clear the app data', (done) => {
    spyOn(service, "clearAppData").and.callThrough();
    service.clearAppData();
    expect(service.clearAppData).toHaveBeenCalled();
    done();
  });
  
  it('#clearAutoCompFormArr will clear the autocomplete data', (done) => {
    spyOn(service, "clearAutoCompFormArr").and.callThrough();
    service.clearAutoCompFormArr();
    expect(service.clearAutoCompFormArr).toHaveBeenCalled();
    done();
  });

  it('#removeDuplicacy will clear the autocomplete data', (done) => {
    spyOn(service, "removeDuplicacy").and.callThrough();
    let param = [{"sub":{"type":"uri","value":nodeResUrl+"Virat_Kohli"},"middle":{"type":"literal","xml:lang":"en","value":"Virat Kohli"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"165"}},{"sub":{"type":"uri","value":nodeResUrl+"Rohit_Sharma"},"middle":{"type":"literal","xml:lang":"en","value":"Rohit Sharma"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"105"}},{"sub":{"type":"uri","value":nodeResUrl+"Virat_Kohli"},"middle":{"type":"literal","xml:lang":"en","value":"Virat Kohli"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"165"}},{"sub":{"type":"uri","value":nodeResUrl+"Rohit_Sharma"},"middle":{"type":"literal","xml:lang":"en","value":"Rohit Sharma"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"105"}},{"sub":{"type":"uri","value":nodeResUrl+"Mahendra_Singh_Dhoni"},"middle":{"type":"literal","xml:lang":"en","value":"Mahendra Singh Dhoni"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"435"}},{"sub":{"type":"uri","value":nodeResUrl+"Sachin_Tendulkar"},"middle":{"type":"literal","xml:lang":"en","value":"Sachin Tendulkar"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"718"}},{"sub":{"type":"uri","value":nodeResUrl+"Rahul_Dravid"},"middle":{"type":"literal","xml:lang":"en","value":"Rahul Dravid"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"445"}}];
    let result = service.removeDuplicacy(param);
    expect(service.removeDuplicacy).toHaveBeenCalled();
    expect(result.length).toBe(5);
    done();
  });

  it('#setAutoCompFormData should set the form data and #getAutoCompFormData should return the same data.', (done) => {
    spyOn(service, "setAutoCompFormData").and.callThrough();
    spyOn(service, "getAutoCompFormData").and.callThrough();
    let formData = [{"sub":{"type":"uri","value":nodeResUrl+"Rohit_Sharma"},"middle":{"type":"literal","xml:lang":"en","value":"Rohit Sharma"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"105"}},{"sub":{"type":"uri","value":nodeResUrl+"Virat_Kohli"},"middle":{"type":"literal","xml:lang":"en","value":"Virat Kohli"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"165"}}];
    service.setAutoCompFormData(formData);    
    let result = service.getAutoCompFormData();
    expect(service.setAutoCompFormData).toHaveBeenCalled();
    expect(service.getAutoCompFormData).toHaveBeenCalled();
    expect(result[0].sub.value).toEqual(nodeResUrl+"Rohit_Sharma");
    done();
  });

  function getEndpoint(): Endpoint {
    let endpoint: Endpoint = {
      "active": true,
      "name": testConfigData.name,
      "id": testConfigData.id,
      "description": testConfigData.description,
      "endpointURI": testConfigData.endpointURI,
      "dontAppendSparql": false,
      "defaultGraphURI": testConfigData.defaultGraphURI,
      "isVirtuoso": true,
      "useProxy": true,
      "method": "POST",
      "autocompleteURIs": testConfigData.autocompleteURIs,
      "autocompleteLanguage": "en",
      "ignoredProperties": testConfigData.ignoredProperties,
      "abstractURIs": testConfigData.abstractURIs,
      "imageURIs": testConfigData.imageURIs,
      "linkURIs": testConfigData.linkURIs,
      "maxRelationLength": 2,
      "queryType": "VIR"
   };
   return endpoint;
  }
});