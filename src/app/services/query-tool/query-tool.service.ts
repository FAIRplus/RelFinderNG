import { Endpoint } from '../../models/endpoint.model';
import { SPARQLConnectionService } from '../sparql/sparqlconnection.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryToolService {

  constructor(private httpClient: HttpClient, private sparqlConnectionService: SPARQLConnectionService) { }

  executeQuery(query: string, endPoint: Endpoint) {

    query = query.replace(/\s{2,}/g, '').trim();

    let params = new FormData();

    if (endPoint.defaultGraphURI) {
      params.append('default-graph-uri', endPoint.defaultGraphURI);
    }

    params.append('query', query);
    params.append('format', 'JSON');

    let url = this.sparqlConnectionService.getUrl(endPoint);

    return this.httpClient.post<any>(url, params);
  }

}
