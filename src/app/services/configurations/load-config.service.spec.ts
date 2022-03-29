import { TestBed} from '@angular/core/testing';
import { LoadConfigService } from './load-config.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';


describe('Load Configurations Service', () => {
    let service: LoadConfigService;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();

    beforeEach(() => { 
        TestBed.configureTestingModule({
            providers: [LoadConfigService]
          });
          service = TestBed.get(LoadConfigService);
    });

   it('#validateFileProps should validate the file and result type should be empty' , (done) => {
     let file = getValidFile('config.json', 'application/json');
     let result = service.validateFileProps(file);
     expect(result.type).toEqual('');
     expect(result.message).toEqual('');
     done();
   });

   it('#validateFileProps should validate the type of file' , (done) => {
     let file = getTwoMbFile('config.html', 'text/html');
     let result = service.validateFileProps(file);
     expect(result.type).toEqual('error');
     expect(result.messageList[0].message).toContain('Invalid File Format');
     done();
   });

   it('#validateFileProps should validate the size of file' , (done) => {
     let file = getTwoMbFile('config.json', 'application/json');
     let result = service.validateFileProps(file);
     expect(result.type).toEqual('error');
     expect(result.messageList[0].message).toContain('File size should not be more than 1 MB');
     done();
   });
  
   it('#validateBooleanProp should validate attribute datatype.' , (done) => {
    let endpoint = getDummyEndpointObj();
    let result = service.validateBooleanProp(endpoint);
    expect(result.type).toEqual('');
    done();
   });

   it('#validateBooleanProp should return type as error for data type other than boolean of active property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.active = 'string value';
    let result = service.validateBooleanProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid "active" Property');
    done();
   });

   it('#validateBooleanProp should return type as error for data type other than boolean of dontAppendSparql property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.dontAppendSparql = 'string value';
    let result = service.validateBooleanProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid "dontAppendSparql" Property');
    done();
   });

   xit('#validateBooleanProp should return type as error for data type other than boolean of isVirtuoso property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.isVirtuoso = 'string value';
    let result = service.validateBooleanProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid "isVirtuoso" Property');
    done();
   });

   it('#validateBooleanProp should return type as error for data type other than boolean of useProxy property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.useProxy = 'string value';
    let result = service.validateBooleanProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid "useProxy" Property');
    done();
   });

   it('#validateStringProp should return type as blank for correct value.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.name = "Dummy test";
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('');
    done();
   });

   it('#validateStringProp should return type as error for data type other than string of name property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.name = true;
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid Name Format');
    done();
   });

   it('#validateStringProp should return type as error for data type other than string of id property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.id = true;
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid ID Format');
    done();
   });

   it('#validateStringProp should return type as error for data type other than string of description property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.description = true;
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid Description');
    done();
   });

   it('#validateStringProp should return type as error for data type other than string of endpointURI property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.endpointURI = true;
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid Endpoint URI');
    done();
   });

   it('#validateStringProp should return type as error for data type other than string of method property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.method = true;
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid Method');
    done();
   });

   it('#validateStringProp should return type as error for data type other than string of autocompleteLanguage property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.autocompleteLanguage = true;
    let result = service.validateStringProp(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Invalid autocompleteURI');
    done();
   });

   it('#validateMaxRelation should return undefined for correct value of maxRelationLength property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.maxRelationLength = 3;
    let result = service.validateMaxRelation(endpoint);
    expect(result.type).toEqual('');
    done();
   });

   it('#validateMaxRelation should return type as error for data type other than Number of maxRelationLength property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.maxRelationLength = "dummy";
    let result = service.validateMaxRelation(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Value of maxRelationLength must be a Numeric');
    done();
   });

   it('#validateMaxRelation should return type as error for invalid value of maxRelationLength property.' , (done) => {
    let endpoint = getDummyEndpointObj();
    endpoint.maxRelationLength = -1;
    let result = service.validateMaxRelation(endpoint);
    expect(result.type).toEqual('error');
    expect(result.messageList[0].message).toContain('Value of maxRelationLength must be within 0 to 10');
    done();
   });

   it('#checkDuplicateById should return true.' , (done) => {
    let endpointsArr = [];
    endpointsArr.push(getDummyEndpointObj());
    endpointsArr.push(getDummyEndpointObj());
    let result = service.checkDuplicateById(endpointsArr, 'dummy');
    expect(result).toBeTruthy();
    done();
   });

   it('#checkDuplicateById should return false.' , (done) => {
      let endpointsArr = [];
      endpointsArr.push(getDummyEndpointObj());
      endpointsArr.push(getDummyEndpointObj());
      let result = service.checkDuplicateById(endpointsArr, 'abcd');
      expect(result).toBeFalsy();
      done();
   });

   it('#validateFile should validate the file content. It should return type as empty string.' , (done) => {
      let result = service.validateFile(getFileContent());
      expect(result.type).toEqual('');
      expect(result.message).toEqual('');
      done();
   });

   it('#validateFile should return type as error for not containg endpoints attribute.' , (done) => {
      let result = service.validateFile(getFileContentWithoutEndpoints());
      expect(result.type).toEqual('error');
      expect(result.messageList[0].message).toContain('Atleast one Endpoint Property Must be active & named true');
      done();
   });

   it('#validateFile should return type as error for empty endpoints.' , (done) => {
      let result = service.validateFile(getFileContentWithEmptyEndpoints());
      expect(result.type).toEqual('error');
      expect(result.messageList[0].message).toContain('Atleast one Endpoint Property Must hold Value');
      done();
   });

   it('#validateFile should return type as error for missing id attribute.' , (done) => {
      let result = service.validateFile(getFileContentWithoutId());
      expect(result.type).toEqual('error');
      expect(result.messageList[0].message).toContain('No ID Found! End Point named DBpe...or) has No ID attribute.');
      done();
   });

   it('#validateFile should return type as error for missing name attribute.' , (done) => {
      let result = service.validateFile(getFileContentWithoutName());
      expect(result.type).toEqual('error');
      expect(result.messageList[0].message).toContain('No Name attribute Found! End Point with ID: dbp has No Name attribute.');
      done();
   });

   it('#validateFile should return type as error for missing endpointURI attribute.' , (done) => {
      let result = service.validateFile(getFileContentWithoutEndpointUri());
      expect(result.type).toEqual('error');
      expect(result.messageList[0].message).toContain('No EndPoint URI Found! End Point with ID: dbp has No Endpoint URI Attribute.');
      done();
   });

   function getTwoMbFile(name: string, fileType: string) : File {
      //const file = new File([''], name);
      const blob = new Blob([""], { type: fileType });
      blob["lastModifiedDate"] = "";
      blob["name"] = name;
      
      const file = <File>blob;

      Object.defineProperty(
          file, 'size', {value: 2097152, writable: false}); // 2097152 bytes = 2 MB
      return file;
    }

    function getValidFile(name: string, fileType: string) : File {
      //const file = new File([''], name);
      const blob = new Blob([""], { type: fileType });
      blob["lastModifiedDate"] = "";
      blob["name"] = name;
      
      const file = <File>blob;

      Object.defineProperty(
          file, 'size', {value: 512000, writable: false}); // 512000 bytes = 500 kb
      return file;
    }


   function getDummyEndpointObj(): any {
      let endpoint = {
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
        maxRelationLength: 3        
      }
      return endpoint;
   }

   function getFileContentWithoutId() {
      return JSON.stringify({
        "proxy": {
           "url": ""
        },
        "endpoints": [
           {
              "active": false,
              "name": testConfigData.name,
              "description": testConfigData.description,
              "endpointURI": testConfigData.endpointURI,
              "dontAppendSparql": false,
              "defaultGraphURI": testConfigData.defaultGraphURI,
              "isVirtuoso": true,
              "useProxy": true,
              "method": "POST"
           }
         ]
      });
   }

   function getFileContentWithoutName() {
      return JSON.stringify({
        "proxy": {
           "url": ""
        },
        "endpoints": [
           {
              "active": false,
              "id": testConfigData.id,
              "description": testConfigData.description,
              "endpointURI": testConfigData.endpointURI,
              "dontAppendSparql": false,
              "defaultGraphURI": testConfigData.defaultGraphURI,
              "isVirtuoso": true,
              "useProxy": true,
              "method": "POST"
           }
         ]
      });
   }

   function getFileContentWithoutEndpointUri() {
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
              "dontAppendSparql": false,
              "defaultGraphURI": testConfigData.defaultGraphURI,
              "isVirtuoso": true,
              "useProxy": true,
              "method": "POST"
           }
         ]
      });
   }

   function getFileContentWithoutEndpoints(){
      return JSON.stringify({
         "proxy": {
            "url": ""
         }
      });
    }

    function getFileContentWithEmptyEndpoints(){
      return JSON.stringify({
         "proxy": {
            "url": ""
         },
         "endpoints": []
      });
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
              "maxRelationLength": "2"
           },
           {
             "active": true,
              "name": "Linked Movie Data Base",
              "id": "lmdb",
              "description": "Semantic Web dataset for movie-related information.",
              "endpointURI": "http://data.linkedmdb.org",
              "dontAppendSparql": false,
              "isVirtuoso": false,
              "useProxy": true,
              "method": "POST",
              "autocompleteURIs": [
                 "http://www.w3.org/2000/01/rdf-schema#label",
                 "http://xmlns.com/foaf/0.1/name",
                 "http://xmlns.com/foaf/0.1/Person"
              ],
              "autocompleteLanguage": "en",
              "linkURIs": [
                "http://xmlns.com/foaf/0.1/page"
              ],
              "maxRelationLength": "2"
           },
           {
             "active": false,
              "name": "Linking Open Data (LOD)",
              "id": "lod",
              "description": "Endpoint of the Linking Open Data project.",
              "endpointURI": "http://lod.openlinksw.com",
              "dontAppendSparql": true,
              "isVirtuoso": true,
              "useProxy": true,
              "method": "POST",
              "autocompleteURIs": [
                "http://www.w3.org/2000/01/rdf-schema#label"
              ],
              "autocompleteLanguage": "en",
              "ignoredProperties": [
                 "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                 "http://www.w3.org/2004/02/skos/core#subject",
                 "http://dbpedia.org/property/wikiPageUsesTemplate",
                 "http://dbpedia.org/property/wordnet_type",
                 "http://dbpedia.org/property/wikilink",
                 "http://www.w3.org/2002/07/owl#sameAs",
                 "http://purl.org/dc/terms/subject"
              ],
              "abstractURIs": [
                "http://dbpedia.org/ontology/abstract"
              ],
              "imageURIs": [
                 "http://dbpedia.org/ontology/thumbnail",
                 "http://xmlns.com/foaf/0.1/depiction"
              ],
              "linkURIs": [
                 "http://purl.org/ontology/mo/wikipedia",
                 "http://xmlns.com/foaf/0.1/homepage",
                 "http://xmlns.com/foaf/0.1/page"
              ],
              "maxRelationLength": "2"
           },
           {
             "active": false,
              "name": "Semantic Web Dog Food",
              "id": "swdf",
              "description": "Metadata about Semantic Web conferences and workshops.",
              "endpointURI": "http://data.semanticweb.org",
              "dontAppendSparql": false,
              "isVirtuoso": false,
              "useProxy": true,
              "method": "POST",
              "autocompleteURIs": [
                "http://www.w3.org/2000/01/rdf-schema#label"
              ],
              "autocompleteLanguage": "en",
              "abstractURIs": [
                 "http://swrc.ontoware.org/ontology#abstract",
                 "http://www.w3.org/2002/12/cal/ical#description"
              ],
              "imageURIs": [
                 "http://data.semanticweb.org/ns/swc/ontology#hasLogo"
              ],
              "linkURIs": [
                "http://xmlns.com/foaf/0.1/homepage"
              ],
              "maxRelationLength": "2"
           }
        ]
     });
   }
  
});