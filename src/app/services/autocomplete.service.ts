import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { SPARQLConnectionService } from './sparql/sparqlconnection.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { map, timeout, catchError } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { ConstantsService } from './util/constants.service';
import { ConfigurationsService } from './configurations/configurations.service';
import { Endpoint } from '../models/endpoint.model';
import { throwError, Subject, Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutoCompleteService {

    public searchResult = [];
    public isLoading = false;
    private autoCompformData = [];
    private publishAutoCompData = new Subject<any>();
    public currentIndex = 0;
    public inputObservale: Subscription;
    public isOkClicked = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private constantService: ConstantsService,
        private configService: ConfigurationsService, private sparqlConnService: SPARQLConnectionService,
        private filterProcessService: FilterProcessService) { }

    /*setSearchResult(searchResult: any) {
        this.searchResult = searchResult;
    }

    getSearchResult() {
        return this.searchResult;
    }*/

    getAutoCompleteData(searchedKey: AbstractControl, idx: number) {
        searchedKey.valueChanges.pipe(debounceTime(500))  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            .subscribe(
                searchKey => {
                    this.searchResult = [];
                    if (searchKey !== null && typeof searchKey === "string") {
                        // set this index to track if user move to other field.
                        this.currentIndex = idx;
                        //searchKey = this.formatValue(searchKey);
                        if (searchKey.trim() != '' && searchKey.trim().length > 1) {
                            this.isLoading = true;
                            this.inputObservale = this.prepareQueryAndGetData(searchKey.trim()).subscribe(
                                (data: any) => {
                                    this.searchResult = [];
                                    data.results.bindings.forEach(binding => {
                                        this.searchResult.push(binding);
                                    });
                                    this.isLoading = false;
                                    return;
                                }, error => {
                                    this.searchResult = [];
                                    this.isLoading = false;
                                    this.searchResult.push({ "middle": { "value": "Error, please check configuration." } });
                                })
                        }
                    }
                });
    }

    // Remove space between characters.
    /*formatValue(value: string): string {
        return value.replace(/\s/g, '');
    }*/

    // Remove duplicates
    removeDuplicacy(searchResult) {
        return Array.from(searchResult.reduce((m, t) => m.set(t.middle.value, t), new Map()).values());
    }

    // Return mddle value for display purpose.
    public displayPropName(options: any) {
        return (options && options.middle && options.middle.value && options.middle.type) ? options.middle.value : '';
    }

    // Method for preparing sparql query and get data after executing the query.
    public prepareQueryAndGetData(keyword: string) {
        let activeEndpoint: Endpoint = this.configService.getActiveEndpoint();
        let query: string = "";

        if (activeEndpoint.queryType === 'CMP') {
            query = this.prepareCompleteQuery(keyword, activeEndpoint, 10, 0);
        } else if (activeEndpoint.queryType === 'STD') {
            query = this.prepareStandardQuery(keyword, activeEndpoint, 10, 0);
        } else {
            query = this.prepareVirtuosoQuery(keyword, activeEndpoint, 10, 0);
        }

        return this.executeQuery(activeEndpoint, query)
            .pipe(
                timeout(90000),
                map(
                    (data: any) => {
                        return (
                            data.results.bindings.length != 0 ? data as any[] : { "results": { "bindings": [{ "middle": { "value": "No Record Found, try again" } }] } } as any
                        );
                    }
                ), catchError(error => {
                    return throwError(error);
                })
            );
    }

    executeQuery(activeEndpoint: Endpoint, query: string) {
        let url = this.getUrl(activeEndpoint);
        let headers: HttpHeaders = new HttpHeaders({
            // 'Content-type': 'application/json',
            'Content-Type': 'application/sparql-results+json',
            'Accept': 'application/sparql-results+json'
        });
        let params = this.getParams(activeEndpoint, query);

        if (activeEndpoint.useProxy) {
            return this.httpClient.get<any>(url, { headers: headers, params: params, responseType: 'json' });
        } else if (activeEndpoint.method === 'POST') {
            return this.httpClient.post<any>(url, null, { headers: headers, params: params, responseType: 'json' });
        } else {
            return this.httpClient.get<any>(url, { headers: headers, params: params, responseType: 'json' });
        }
    }

    prepareCompleteQuery(keyword: string, endpoint: Endpoint, limit: number = 0, offset: number = 0): string {
        if (keyword.search(" ") < 0) {
            return this.prepareSingleWordQuery(endpoint, "'" + keyword + "'", limit, offset);
        } else {
            let newKeyword = keyword.split(" ").join("' and '");
            return this.prepareMultipleWordsCompleteQuery(endpoint, "'" + newKeyword + "'", limit, offset);
        }

    }

    prepareSingleWordQuery(activeEndpoint: Endpoint, keyword: string, limit: number = 0, offset: number = 0) {
        let query = "SELECT ?sub ?middle count(?sub) as ?count WHERE { ?someobj ?p ?sub . ";
        let lang = activeEndpoint.autocompleteLanguage;

        if (activeEndpoint.autocompleteURIs != null && activeEndpoint.autocompleteURIs.length > 0) {
            if (activeEndpoint.autocompleteURIs.length > 1) {
                query += " ?sub ?someprop ?middle . ";
                query += " { ";
            }
            query += " ?sub <" + activeEndpoint.autocompleteURIs[0] + "> ?middle ";
            if (activeEndpoint.autocompleteURIs.length > 1) {
                query += " } ";
            }
            for (let i = 1; i < activeEndpoint.autocompleteURIs.length; i++) {
                query += "UNION { ?sub <" + activeEndpoint.autocompleteURIs[i] + "> ?middle } ";
            }
            query += ". ";
        } else {
            query += "?sub <http://www.w3.org/2000/01/rdf-schema#label> ?middle . "
        }

        query += "?middle bif:contains \"" + keyword + "\" . " +
            "FILTER (!regex(str(?sub), '^http://dbpedia.org/resource/Category:')). " +
            "FILTER (!regex(str(?sub), '^http://dbpedia.org/resource/List')). " +
            "FILTER (!regex(str(?sub), '^http://sw.opencyc.org/')). ";
        if (lang != "") {
            query += "FILTER (lang(?middle) = '' || langMatches(lang(?middle), '" + lang + "')). ";
        }
        query += "FILTER (!isLiteral(?someobj)). } ORDER BY DESC(?count) ";
        if (limit != 0) {
            query += "LIMIT " + limit.toString() + " ";
        }
        if (offset != 0) {
            query += "OFFSET " + offset.toString() + " ";
        }
        return query;
    }

    prepareMultipleWordsCompleteQuery(endpoint: Endpoint, keyword: string, limit: number = 0, offset: number = 0): string {
        let query = "SELECT DISTINCT ?sub ?middle count(?sub) as ?count WHERE { ?someobj ?p ?sub . ";
        if (endpoint.autocompleteURIs != null && endpoint.autocompleteURIs.length > 0) {
            if (endpoint.autocompleteURIs.length > 1) {
                query += " ?sub ?someprop ?middle . ";
                query += " { ";
            }
            query += " ?sub <" + endpoint.autocompleteURIs[0] + "> ?middle ";
            if (endpoint.autocompleteURIs.length > 1) {
                query += " } ";
            }
            for (let i = 1; i < endpoint.autocompleteURIs.length; i++) {
                query += "UNION { ?sub <" + endpoint.autocompleteURIs[i] + "> ?middle }";
            }
            query += ". ";
        } else {
            query += "?sub <http://www.w3.org/2000/01/rdf-schema#label> ?middle . "
        }

        query += "?middle bif:contains \"" + keyword + "\" . " +
            "FILTER (!regex(str(?sub), '^http://dbpedia.org/resource/Category:')). " +
            "FILTER (!regex(str(?sub), '^http://dbpedia.org/resource/List')). " +
            "FILTER (!regex(str(?sub), '^http://sw.opencyc.org/')). ";
        if (endpoint.autocompleteLanguage != "") {
            query += "FILTER (lang(?middle) = '' || langMatches(lang(?middle), '" + endpoint.autocompleteLanguage + "')). ";
        }
        query += "FILTER (!isLiteral(?someobj)). " +
            "} " +
            "ORDER BY DESC(?count) ";
        if (limit != 0) {
            query += "LIMIT " + limit.toString() + " ";
        }
        if (offset != 0) {
            query += "OFFSET " + offset.toString() + " ";
        }
        return query;
    }

    prepareStandardQuery(keyword: string, endpoint: Endpoint, limit: number = 0, offset: number = 0): string {
        let query: string = "SELECT ?sub ?middle WHERE { ";

        if (endpoint.autocompleteURIs != null && endpoint.autocompleteURIs.length > 0) {
            if (endpoint.autocompleteURIs.length > 1) {
                query += " ?sub ?someprop ?middle . ";
                query += " { ";
            }
            query += " ?sub <" + endpoint.autocompleteURIs[0] + "> ?middle ";
            if (endpoint.autocompleteURIs.length > 1) {
                query += " } ";
            }
            for (let i = 1; i < endpoint.autocompleteURIs.length; i++) {
                query += "UNION { ?sub <" + endpoint.autocompleteURIs[i] + "> ?middle } ";
            }
            query += ". ";
        } else {
            query += "?sub <http://www.w3.org/2000/01/rdf-schema#label> ?middle . "
        }

        query += "FILTER regex(?middle, '" + keyword + "', 'i'). ";
        if (endpoint.autocompleteLanguage != "") {
            query += "FILTER (lang(?middle) = '' || langMatches(lang(?middle), '" + endpoint.autocompleteLanguage + "')). ";
        }
        query += "} ";
        if (limit != 0) {
            query += "LIMIT " + limit.toString() + " ";
        }
        if (offset != 0) {
            query += "OFFSET " + offset.toString() + " ";
        }
        return query;
    }

    prepareVirtuosoQuery(keyword: string, endpoint: Endpoint, limit: number = 0, offset: number = 0): string {
        let query: string = "SELECT ?sub ?middle WHERE { ";

        if (endpoint.autocompleteURIs != null && endpoint.autocompleteURIs.length > 0) {
            if (endpoint.autocompleteURIs.length > 1) {
                query += " ?sub ?someprop ?middle . ";
                query += " { ";
            }
            query += " ?sub <" + endpoint.autocompleteURIs[0] + "> ?middle ";
            if (endpoint.autocompleteURIs.length > 1) {
                query += " } ";
            }
            for (let i = 1; i < endpoint.autocompleteURIs.length; i++) {
                query += "UNION { ?sub <" + endpoint.autocompleteURIs[i] + "> ?middle } ";
            }
            query += ". ";
        } else {
            query += "?sub <http://www.w3.org/2000/01/rdf-schema#label> ?middle . "
        }

        // query += 'FILTER(CONTAINS(LCASE(?middle), "' + keyword + '"@' + endpoint.autocompleteLanguage + ')). ';
        query += "FILTER regex(?middle, '" + keyword + "'@" + endpoint.autocompleteLanguage + ", 'i').";

        query += "} ";
        if (limit != 0) {
            query += "LIMIT " + limit.toString() + " ";
        }
        if (offset != 0) {
            query += "OFFSET " + offset.toString() + " ";
        }
        return query;
    }

    getParams(activeEndpoint: Endpoint, query: string): HttpParams {
        let params = new HttpParams();

        if (activeEndpoint.defaultGraphURI) {
            params = params.append('default-graph-uri', activeEndpoint.defaultGraphURI);
        }
        if (activeEndpoint.useProxy) {
            params = params.append('endpoint', btoa(activeEndpoint.endpointURI));
            params = params.append('query', btoa(query));
            params = params.append('method', activeEndpoint.method);
        } else {
            params = params.append('query', query);
        }
        params = params.append('format', 'json');
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

    getAutoCompFormData() {
        return this.autoCompformData;
    }

    setAutoCompFormData(formdata) {
        this.autoCompformData = formdata;
    }

    pushDataToAutoCompFormArr(data: any) {
        this.autoCompformData.push(data);
        this.publishAutoCompData.next(this.autoCompformData);
    }

    clearAutoCompFormArr() {
        this.autoCompformData = [];
        this.publishAutoCompData.next([]);
    }

    getAutoFormData(): Observable<any> {
        return this.publishAutoCompData.asObservable();
    }

    loadGraphWithQueryData(searchFormObjects: any) {
        let sources = [];
        this.clearAutoCompFormArr();
        if (searchFormObjects && searchFormObjects.length > 0) {
            searchFormObjects.forEach(obj => {
                this.pushDataToAutoCompFormArr(obj);
                sources.push(obj.sub.value);
            });
            this.sparqlConnService.graphLoadStatus.next(this.constantService.LOADING);
            this.sparqlConnService.findRelation(sources);
            this.configService.toggleLeftMenu.next({ type: 'search', visible: false });
            setTimeout(() => {
                this.configService.toggleLeftMenu.next({ type: 'search', visible: true });
            }, 500);
            setTimeout(() => {
                this.configService.toggleLeftMenu.next({ type: 'search', visible: false });
            }, 5000);
        }
    }

    clearAppData() {
        this.sparqlConnService.graphLoadStatus.next(this.constantService.IDLE);
        this.clearAutoCompFormArr();
        this.configService.disableInfoMenu.next(true);
        this.filterProcessService.clearAllFilters();
        this.sparqlConnService.cancelHttpRequestCalls();
        this.sparqlConnService.clearGraph();
        this.configService.toggleLeftMenu.next({ type: 'search', visible: true });
        this.configService.isOverrideSearch = false;
    }

    clearDataOnSearchOverride() {
        this.filterProcessService.clearAllFilters();
        if (this.sparqlConnService.classUrisWithResUris) {
            this.sparqlConnService.classUrisWithResUris.clear();
        }
        if (this.sparqlConnService.duplicateEdgesMap) {
            this.sparqlConnService.duplicateEdgesMap.clear();
        }
        this.configService.disableInfoMenu.next(true);
    }

    cancelAutoCompleteData(idx: number) {
        if (this.inputObservale) {
            this.inputObservale.unsubscribe();
            this.currentIndex = idx;
        }
    }

    // For testing only
    public setPublishAutoCompData(data: any[]) {
        this.publishAutoCompData.next(data);
    }
}