import { TestConfUtil } from "./test-conf.util";
import { TestConfigModel } from './test-config.model';

describe('TestConfUtil', () => {
    let testConfig = new TestConfUtil();
    
    it('#getConfigData should return the test configurations data.', (done) => {
        let result: TestConfigModel = testConfig.getConfigData();
        expect(result.id).toEqual('dbp');
        expect(result.endpointURI).toEqual('https://dbpedia.interactivesystems.info');
        expect(result.classFilterLabels[0]).toEqual('http://schema.org/Place');
        expect(result.name).toEqual('DBpedia (mirror)');
        expect(result.defaultGraphURI).toEqual('http://dbpedia.org');
        expect(result.description).toEqual('Linked Data version of Wikipedia.');
        expect(result.autocompleteURIs[0]).toEqual('http://www.w3.org/2000/01/rdf-schema#label');
        expect(result.ignoredProperties[0]).toEqual('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
        expect(result.abstractURIs[0]).toEqual('http://dbpedia.org/ontology/abstract');
        expect(result.imageURIs[0]).toEqual('http://dbpedia.org/ontology/thumbnail');
        expect(result.linkURIs[0]).toEqual('http://purl.org/ontology/mo/wikipedia');
        done();
    });
});