import { Endpoint } from '../../models/endpoint.model';
import { SPARQLConnectionService } from '../sparql/sparqlconnection.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationsService } from '../configurations/configurations.service';

@Injectable({
  providedIn: 'root'
})
export class QueryToolService {

  constructor(private httpClient: HttpClient, private sparqlConnectionService: SPARQLConnectionService, private configService: ConfigurationsService) { }

  executeQuery(query: string, endPoint: Endpoint) {
    let headers: HttpHeaders = new HttpHeaders({
      // 'Content-type': 'application/json',
      'Content-Type': 'application/sparql-results+json',
      'Accept': 'application/sparql-results+json'
    });
    query = query.replace(/\s{2,}/g, '').trim();
    let url = this.getUrl(endPoint);
    if (endPoint.useProxy) {
      return this.httpClient.get<any>(url, { headers: headers, params: this.getParams(endPoint, query), responseType: 'json' });
    } else if (endPoint.method === 'POST') {
      let options = {
        headers: new HttpHeaders({ 'Accept': 'application/sparql-results+json' })
      }
      let params = new FormData();
      if (endPoint.defaultGraphURI) {
        params.append('default-graph-uri', endPoint.defaultGraphURI);
      }
      params.append('query', query);
      params.append('format', 'json');
      return this.httpClient.post<any>(url, params, options);
    } else {
      return this.httpClient.get<any>(url, { headers: headers, params: this.getParams(endPoint, query), responseType: 'json' });
    }
  }
  getUrl(endpoint: Endpoint) {
    let url = '';
    let appendant = "";
    if (endpoint.dontAppendSparql) {
      appendant = "";
    } else {
      appendant = "/sparql?"
    }
    url = endpoint.endpointURI + appendant;
    if (endpoint.useProxy) {
      let proxy = this.configService.getConfigData().proxy
      if (proxy && proxy.url) {
        url = this.configService.getConfigData().proxy.url;
      }
    }
    return url;
  }
  getParams(activeEndpoint: Endpoint, query: string): HttpParams {
    let params = new HttpParams();
    if (activeEndpoint.defaultGraphURI) {
      params = params.append('default-graph-uri', activeEndpoint.defaultGraphURI);
    }
    if (activeEndpoint.useProxy) {
      params = params.append('endpoint', encodeURI(activeEndpoint.endpointURI));
      params = params.append('method', activeEndpoint.method);
    }
    params = params.append('query', query);
    params = params.append('format', 'json');
    return params;
  }
}
