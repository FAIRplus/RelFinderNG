

export class TestConfigModel {

    constructor(
        public endpointURI: string,
        public nodeResource: string,
        public classFilterLabels: string[],
        public name: string,
        public id: string,
        public description: string,
        public defaultGraphURI: string,
        public autocompleteURIs: [string],
        public ignoredProperties: [string],
        public abstractURIs: [string],
        public imageURIs: [string],
        public linkURIs: [string]
    ) {}
}