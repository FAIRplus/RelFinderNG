import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigurationsService } from '../configurations/configurations.service';
import { Endpoint } from 'src/app/models/endpoint.model';
import { ConstantsService } from './constants.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class QueryExecutionService {

    constructor(private http: HttpClient, private configService: ConfigurationsService, private constantService: ConstantsService) { }

    executeQuery(query: string) {
        let endpoint = this.configService.getActiveEndpoint();
        let headers: HttpHeaders  = new HttpHeaders({
          'Content-type' : 'application/json'
        });
    
        let params = this.getParams(endpoint, query); 
        let url = this.getUrl(endpoint); 

        if(endpoint.method === 'POST') {
            return this.http.post<any>(url, null, {headers:headers, params: params, responseType: 'json'});
        } else {
            return this.http.get<any>(url, {headers:headers, params: params, responseType: 'json'});
        }
    }

    getParams(activeEndpoint: Endpoint, query: string): HttpParams {
        let params = new HttpParams();
        
        if(activeEndpoint.defaultGraphURI) {
            params = params.append('default-graph-uri', activeEndpoint.defaultGraphURI);
        }
        params = params.append('format', 'json');
        params = params.append('query', query);
        return params;
    }

    getUrl(endpoint: Endpoint) {
        let url = this.constantService.dbpediaSparqlUri;
        // url = endpoint.defaultGraphURI;
        // if(!endpoint.dontAppendSparql) {
        //     url = url + '/sparql';
        // }

        let appendant = "";
        if (endpoint.dontAppendSparql) {
            appendant = "?";
        } else {
            appendant = "/sparql?"
        }

        url = endpoint.endpointURI + appendant;
        
        /*if (endpoint.useProxy) {
            url = this.configService.getConfigData().proxy + "?" + endpoint.endpointURI + appendant;
        } else {
            url = endpoint.endpointURI + appendant;
        }*/

        return url;
    }

    public fetchForkJoinObj(allQueries: string[]) {
		let queryExec = [];
		allQueries.forEach(query => {
          let exec = this.executeQuery(query).pipe(tap(res => res.resourceUri = this.fetchResource(query)));
		  queryExec.push(exec);
		});    
	
		return forkJoin(queryExec);
    }
    
    fetchResource(query: string) {
        return query.slice(query.indexOf('{'), query.indexOf('>')).replace('{<', '');
    }
}