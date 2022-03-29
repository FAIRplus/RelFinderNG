import { TestBed} from '@angular/core/testing';
import { ConfigurationsService } from './configurations.service';
import { ConfigModel } from 'src/app/models/config.model';
import { Endpoint } from 'src/app/models/endpoint.model';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';


describe('ConfigurationsService', () => {
    let service: ConfigurationsService;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let srcId = testConfigData.id;
    let endpointURI = testConfigData.endpointURI;

    beforeEach(() => { 
        TestBed.configureTestingModule({
            providers: [ConfigurationsService]
          });    

          service = TestBed.get(ConfigurationsService);
          service.setConfigData();
          service.setActiveEndpoint(srcId);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  
    it('#getConfigData should return conguration data.', (done) => {
      let data: ConfigModel = service.getConfigData();
      let endpoints: Endpoint[] = data.endpoints;

      expect(endpoints[0].active).toBeTruthy();
      expect(endpoints[0].id).toEqual(srcId);
      expect(endpoints[0].name).toContain('DBpedia');
      expect(endpoints[0].endpointURI).toEqual(endpointURI);

      expect(endpoints[1].active).toBeFalsy();
      expect(endpoints[1].id).toEqual('lmdb');
      expect(endpoints[1].name).toContain('Linked Movie Data Base');
      expect(endpoints[1].endpointURI).toEqual('http://data.linkedmdb.org');

      done();
    });

    it('#getAllEndpoints should return all endpoints data.', (done) => {
      let endpoints: Endpoint[] = service.getAllEndpoints();

      expect(endpoints[0].active).toBeTruthy();
      expect(endpoints[0].id).toEqual(srcId);
      expect(endpoints[0].name).toContain('DBpedia');
      expect(endpoints[0].endpointURI).toEqual(endpointURI);

      expect(endpoints[1].active).toBeFalsy();
      expect(endpoints[1].id).toEqual('lmdb');
      expect(endpoints[1].name).toContain('Linked Movie Data Base');
      expect(endpoints[1].endpointURI).toEqual('http://data.linkedmdb.org');
      done();
    });

    it('#getActiveEndpoint should return active endpoint.', (done) => {
      let endpoint: Endpoint = service.getActiveEndpoint();
      expect(endpoint.active).toBeTruthy();
      done();
    });

    it('#updateEndpointsList should add new endpoint in the existing list or update the existing endpoint with the updated values and return true.', (done) => {
      let endpoint= getDummyEndpointObj();
      // Add new endpoint
      let result1 = service.updateEndpointsList(endpoint);
      expect(result1).toBeTruthy();
      expect(service.getAllEndpoints().length).toBeGreaterThanOrEqual(5);
      expect(service.getAllEndpoints()[service.getAllEndpoints().length - 1].name).toEqual('dummy');
      expect(service.getAllEndpoints()[service.getAllEndpoints().length - 1].description).toEqual('dummy');

      // Update existing endpoint
      endpoint.name = 'New Name';
      endpoint.description = 'New Description';
      let result2 = service.updateEndpointsList(endpoint);
      expect(result2).toBeTruthy();
      expect(service.getAllEndpoints().length).toBeGreaterThanOrEqual(5);
      expect(service.getAllEndpoints()[service.getAllEndpoints().length - 1].name).toEqual('New Name');
      expect(service.getAllEndpoints()[service.getAllEndpoints().length - 1].description).toEqual('New Description');

      // #removeEndpoint should remove the existing endpoint and return true.
      let result3 = service.removeEndpoint(endpoint);
      expect(result3).toBeTruthy();
      expect(service.getAllEndpoints().length).toBeGreaterThanOrEqual(4);

      done();
    });

    it('#setActiveEndpoint should activate the new endpoint which will be requested.', (done) => {
      let endpoints: Endpoint[] = service.getAllEndpoints();
      let result = service.setActiveEndpoint(endpoints[0].id);
      expect(result).toBeTruthy();
      expect(endpoints[0].active).toBeTruthy();
      done();
    });
    
    it('#isEndpointExisted should return true.', (done) => {
      let endpoints: Endpoint[] = service.getAllEndpoints();
      let result = service.isEndpointExisted(endpoints[1].id);
      expect(result).toBeTruthy();
      done();
    });

    it('#isEndpointExisted should return false.', (done) => {
      let endpoint: Endpoint = getDummyEndpointObj();
      let result = service.isEndpointExisted(endpoint.id);
      expect(result).toBeFalsy();
      done();
    });

    it('#getEndpointById should return endpoint configuration on the basis of id.', (done) => {
      let endpoint : Endpoint = service.getEndpointById(srcId);
      expect(endpoint.id).toEqual(srcId);
      expect(endpoint.name).toContain('DBpedia');
      done();
    });

    it('#getEndpointById should return null.', (done) => {
      let endpoint : Endpoint = service.getEndpointById('abcd');
      expect(endpoint).toBeNull();
      done();
    });

    it('#replaceConfigWithUserData should replace existing configurations with file content and return true.', (done) => {
      let result = service.replaceConfigWithUserData(getFileContent());
      expect(result).toBeTruthy();
      expect(service.getAllEndpoints()[1].active).toBeTruthy();
      done();
    });

    function getDummyEndpointObj(): Endpoint {
      let endpoint: Endpoint = {
        active: false,
        name: "dummy",
        id: "dummy",
        description: "dummy",
        endpointURI: "dummy",
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

    function getFileContent() {
      return JSON.stringify({
        "proxy": {
           "url": ""
        },
        "endpoints": [
           {
              "active": false,
              "name": testConfigData.name,
              "id": testConfigData.id,
              "description": testConfigData.description,
              "endpointURI": endpointURI,
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
              "maxRelationLength": "2",
              "queryType": "VIR"
           },
           {
             "active": true,
              "name": "Linked Movie Data Base",
              "id": "lmdb",
              "description": "Semantic Web dataset for movie-related information.",
              "endpointURI": "https://data.linkedmdb.org",
              "dontAppendSparql": false,
              "isVirtuoso": false,
              "useProxy": true,
              "method": "POST",
              "autocompleteURIs": [
                 "https://www.w3.org/2000/01/rdf-schema#label",
                 "https://xmlns.com/foaf/0.1/name",
                 "https://xmlns.com/foaf/0.1/Person"
              ],
              "autocompleteLanguage": "en",
              "linkURIs": [
                "https://xmlns.com/foaf/0.1/page"
              ],
              "maxRelationLength": "2",
              "queryType": "VIR"
           },
           {
             "active": false,
              "name": "Linking Open Data (LOD)",
              "id": "lod",
              "description": "Endpoint of the Linking Open Data project.",
              "endpointURI": "https://lod.openlinksw.com",
              "dontAppendSparql": true,
              "isVirtuoso": true,
              "useProxy": true,
              "method": "POST",
              "autocompleteURIs": [
                "https://www.w3.org/2000/01/rdf-schema#label"
              ],
              "autocompleteLanguage": "en",
              "ignoredProperties": [
                 "https://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                 "https://www.w3.org/2004/02/skos/core#subject",
                 "https://dbpedia.org/property/wikiPageUsesTemplate",
                 "https://dbpedia.org/property/wordnet_type",
                 "https://dbpedia.org/property/wikilink",
                 "https://www.w3.org/2002/07/owl#sameAs",
                 "https://purl.org/dc/terms/subject"
              ],
              "abstractURIs": [
                "https://dbpedia.org/ontology/abstract"
              ],
              "imageURIs": [
                 "https://dbpedia.org/ontology/thumbnail",
                 "https://xmlns.com/foaf/0.1/depiction"
              ],
              "linkURIs": [
                 "https://purl.org/ontology/mo/wikipedia",
                 "https://xmlns.com/foaf/0.1/homepage",
                 "https://xmlns.com/foaf/0.1/page"
              ],
              "maxRelationLength": "2",
              "queryType": "VIR"
           },
           {
             "active": false,
              "name": "Semantic Web Dog Food",
              "id": "swdf",
              "description": "Metadata about Semantic Web conferences and workshops.",
              "endpointURI": "https://data.semanticweb.org",
              "dontAppendSparql": false,
              "isVirtuoso": false,
              "useProxy": true,
              "method": "POST",
              "autocompleteURIs": [
                "https://www.w3.org/2000/01/rdf-schema#label"
              ],
              "autocompleteLanguage": "en",
              "abstractURIs": [
                 "https://swrc.ontoware.org/ontology#abstract",
                 "https://www.w3.org/2002/12/cal/ical#description"
              ],
              "imageURIs": [
                 "https://data.semanticweb.org/ns/swc/ontology#hasLogo"
              ],
              "linkURIs": [
                "https://xmlns.com/foaf/0.1/homepage"
              ],
              "maxRelationLength": "2",
              "queryType": "VIR"
           }
        ]
     });
    }
  
});