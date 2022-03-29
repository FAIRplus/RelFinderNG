import { Endpoint } from './endpoint.model';

export class ConfigModel {

    constructor(
        public proxy: {url: string}, 
        public endpoints: [Endpoint]
    ) {}
}