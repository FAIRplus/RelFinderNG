import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as data from '../../config/config.json';
import { ConfigModel } from 'src/app/models/config.model';
import { Endpoint } from 'src/app/models/endpoint.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationsService {

    public configuredData: ConfigModel;
    public toggleLeftMenu = new Subject<any>();
    public disableInfoMenu = new Subject<boolean>();
    public isOverrideSearch: boolean = false;
    public configPopupHeader = new BehaviorSubject('');
    public queriedEntity: any;

    // Read data from static JSON file and push its data to configuredData.
    public setConfigData(): boolean {
        this.configuredData = (data as any).default as ConfigModel;
        return true;
    }

    public setUriConfigData(uriParam: ConfigModel) {
        this.configuredData = uriParam;
    }

    // To get data object.
    public getConfigData(): ConfigModel {
        return this.configuredData;
    }

    // To get all endpoints objects.
    public getAllEndpoints(): Endpoint[] {
        return this.configuredData.endpoints;
    }

    // To get active endpoint data.
    public getActiveEndpoint(): Endpoint {
        for (let endpoint of this.configuredData.endpoints) {
            if (endpoint.active) {
                return endpoint;
            }
        }
        return null;
    }

    // Opertions on the basis of id starts here.

    // To add or update the existing endpoint
    public updateEndpointsList(endpoint: Endpoint): boolean {
        const index = this.configuredData.endpoints.findIndex(elem => elem.id === endpoint.id);
        if (index === -1) {
            this.configuredData.endpoints.push(endpoint);
        } else {
            this.configuredData.endpoints[index] = endpoint;
        }
        return true;
    }

    // To remove the existing endpoint
    public removeEndpoint(endpoint: Endpoint): boolean {
        let object = this.configuredData.endpoints.find(item => item.id == endpoint.id);
        this.configuredData.endpoints.splice(this.configuredData.endpoints.indexOf(object), 1);
        // First item to active.
        if (endpoint.active && this.configuredData.endpoints.length > 0) {
            this.setActiveEndpoint(this.configuredData.endpoints[0].id);
        }
        return true;
    }

    // Change active endpoint.
    public setActiveEndpoint(id: string): boolean {
        // Set previous active endpoint to inactive
        let activeEndpoint = this.configuredData.endpoints.find(item => item.active == true);
        if (activeEndpoint) {
            activeEndpoint.active = false;
        }
        // Set endpoint to active.
        this.configuredData.endpoints.find(item => item.id == id).active = true;
        return true;
    }

    public isEndpointExisted(id: string): boolean {
        return this.configuredData.endpoints.some((item) => item.id == id);
    }

    // To get endpoint data on the basis of id property.
    public getEndpointById(id: string): Endpoint {
        for (let endpoint of this.configuredData.endpoints) {
            if (endpoint.id === id) {
                return endpoint;
            }
        }
        return null;
    }

    // Replace existing configurations with user's file data.
    public replaceConfigWithUserData(fileContent: any): boolean {
        fileContent = JSON.parse(fileContent);
        this.configuredData = fileContent as ConfigModel;
        return true;
    }

    /*
    // Opertions on the basis of id ends here.

    // Opertions on the basis of index starts here.

     // To add or update the existing endpoint on the base of index.
     public updateEndpointsListByIndex(endpoint: Endpoint, index: number): boolean {
        if(index === -1) {
            this.configuredData.endpoints.push(endpoint);
        } else {
            this.configuredData.endpoints[index] = endpoint;
        }
        return true;
    }    

    // To remove the existing endpoint on the base of index
    public removeEndpointByIndex(index: number): boolean {
        this.configuredData.endpoints.splice(index, 1);
        return true;
    }

    // Change active endpoint on the basis of index.
    public setActiveEndpointByIndex(index: number): boolean {
        // Set previous active endpoint to inactive
        this.configuredData.endpoints.find(item => item.active == true).active = false;
        // Set endpoint to active.
        this.configuredData.endpoints[index].active = true;
        return true;
    }

    // Opertions on the basis of index ends here.
    */
}