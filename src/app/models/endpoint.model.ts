
export class Endpoint {

    constructor(
        public active: boolean = false,
        public name: string,
        public id: string,
        public description: string,
        public endpointURI: string,
        public dontAppendSparql: boolean = false,
        public defaultGraphURI: string,
        public isVirtuoso: boolean = true,
        public useProxy: boolean = true,
        public method: string,
        public maxRelationLength: number,
        public autocompleteURIs: [string],
        public autocompleteLanguage: string = 'en',
        public ignoredProperties: [string],
        public abstractURIs: [string],
        public imageURIs: [string],
        public linkURIs: [string],
        public queryType: string,
    ) {}
}