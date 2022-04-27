import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of, Subject, Subscription, Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Endpoint } from 'src/app/models/endpoint.model';
import { ConfigurationsService } from '../configurations/configurations.service';
import { RelFinder } from '../../base/frame/relfinder';
import { GraphService } from '../../base/service/graph-service';
import { Utils } from '../util/common.utils';
import { ConstantsService } from '../util/constants.service';
import { QueryExecutionService } from '../util/query-execution.service';
import { SparqlPropertyService } from './sparql-property.service';
import { SPARQLQueryBuilderService } from './sparqlquery-builder.service';
import { SPARQLResultParserService } from './sparqlresult-parser.service';
import { FilterProcessService } from '../filters/filter-process.service';




@Injectable({
  providedIn: 'root'
})
export class SPARQLConnectionService {
  selectedSources: string[];
  graphLoadStatus = new Subject<string>();
  public classUrisWithResUris = new Map<string, string[]>();
  public languageSubject = new BehaviorSubject<any>('');
  public emptyNodesObjectSubject = new BehaviorSubject<any>('');
  private httpForkJoinSubscription: Subscription;
  private rfInstance: RelFinder;
  public intervalSubject = new BehaviorSubject<number>(500);
  public dataUpdateSubject = new BehaviorSubject<any>('');
  public duplicateEdgesMap = new Map<string, number>();
  public leftMenuToggle = new BehaviorSubject<any>('');
  public topToolTipDynamic = new BehaviorSubject<any>('');

  constructor(private configService: ConfigurationsService,
    private sparqlQueryBuilderService: SPARQLQueryBuilderService,
    public constantService: ConstantsService,
    private httpClient: HttpClient,
    private sparqlParser: SPARQLResultParserService,
    private execService: QueryExecutionService,
    private sparqlPropertyService: SparqlPropertyService,
    public filterProcessService: FilterProcessService
  ) { }

  findRelation(_sources: any) {
    this.selectedSources = _sources;
    this.formtDataResouces(true);
  }

  getSources(): string[] {
    return this.selectedSources;
  }
  isQueryExecutionCompleted: boolean = false;
  initialLoading = false;
  reqArr = []
  objectlistArry = [];
  queryPropArray = [];
  mapProperty = [];
  nodeListOfIds = [];
  queryIndex = 0;
  countValue = 0;
  relfinderObj: RelFinder;
  graphService: GraphService;
  classIndex = 0;
  countClassIndexCount = 0;
  isClassDataEntered = false;
  isNodesEmpty = false;
  isResetTriggred = false;

  formtDataResouces(isInitlizeCompleted) {
    let object1: any;
    let object2: any;
    this.resetGlobalValues();
    for (let i = 0; i < this.selectedSources.length; i++) {
      object1 = this.selectedSources[i];
      for (let j = i + 1; j < this.selectedSources.length; j++) {
        var objectlist: string[];
        object2 = this.selectedSources[j];
        objectlist = [object1, object2];
        var queries = this.sparqlQueryBuilderService.findRelation(object1, object2);
        Array.from(queries.entries()).forEach(entry => {
          this.objectlistArry.push(objectlist);
          this.queryPropArray.push(entry[1]);
          this.reqArr.push(entry[0]);
        });
      }
    }
    if(isInitlizeCompleted)
    this.intilizingObjects()
    if(!this.isResetTriggred)
    this.queryExecution();
  }

  intilizingObjects(){
    let container = document.getElementById('loadGraph');
    this.relfinderObj = new RelFinder(container);
    this.graphService = new GraphService();
  }

  queryExecution() {
    let listOfQueryArray = 2 * Math.ceil(this.reqArr.length / 6) / 2;
    //while (!this.isEnteredCon && this.i < (listOfQueryArray % 2 == 0 ? listOfQueryArray : listOfQueryArray + 1)) {
    while (!this.isQueryExecutionCompleted && this.queryIndex < listOfQueryArray) {
      let queryRes = new Map();
      let countMax = 0;
      while (countMax < 6) {
        this.isQueryExecutionCompleted = true;
        queryRes.set(this.countValue, this.fetchData(this.reqArr[this.countValue], this.countValue == 0 ? 10000 : 15000));
        if (countMax == 5 && queryRes) {
          this.dataInitialization(queryRes);
        }
        countMax++
        this.countValue++;
      }
      this.queryIndex++;
    }
  }

  dataInitialization(queryRes: Map<any, any>) {
    let countVal = 0;
    let dataSourceSOP = [];
    var nodeConnectionListOfIds = [];
    for (let [key] of queryRes) {
      queryRes.get(key).toPromise().then((value: { [x: string]: { [x: string]: any; }; }) => {
        countVal++;
        if (value != null && typeof value != 'undefined' && value['head']['vars'] != undefined) {
          var responseTriples = this.sparqlParser.parse_dbpedia_response(this.objectlistArry[key], this.queryPropArray[key], value, nodeConnectionListOfIds);
          for (let triples of responseTriples) {
            if (typeof triples !== 'undefined' && triples.length > 0) {
              for (let inTriples of triples) {
                dataSourceSOP.push(inTriples);
              }
            } else {
              if (typeof triples !== 'undefined' && triples.length > 0) {
                dataSourceSOP.push(triples);
              }
            }
          }
        }
      }).catch(() => {
        console.log("There is no content response object...!");
      }).then(() => {
        if (this.isClassDataEntered) {
          this.dataUpdateSubject.next(true);
        }
        if (countVal == 6 && dataSourceSOP && !this.isResetTriggred) {
          let nodeLocalizaionRawData = [];
          let nodeIndexLocalizaionIds = [];
          nodeConnectionListOfIds = Array.from(new Set(nodeConnectionListOfIds));
          //prepare sparql resouce query node connection
          for (let nodeId of nodeConnectionListOfIds) {
            if (!this.nodeListOfIds.includes(nodeId)) {
              this.nodeListOfIds.push(nodeId);
              nodeIndexLocalizaionIds.push(nodeId);
              nodeLocalizaionRawData.push(this.fetchData(this.preparePropertyHasValueQuery(nodeId), 10000))
            }
          }
          this.nodeListOfIds = Array.from(new Set(this.nodeListOfIds));

          forkJoin(nodeLocalizaionRawData).subscribe(resultsOBj => {
            let languageObj = [];
            for (var ind in resultsOBj) {
              let resultValue = resultsOBj[ind];
              if (resultValue != null && typeof resultValue !== 'undefined') {
                let valueObj = this.sparqlPropertyService.fetchLocaleData(resultValue, languageObj);
                this.mapProperty.push({ 'id': nodeIndexLocalizaionIds[ind], 'value': valueObj });
              }
            }
            languageObj.unshift('res');
            this.constantService.localeResourceService.setLanguages(Utils.distinct(languageObj).filter(n => n));
            this.constantService.localeResourceService.setNodeLocalization(this.mapProperty);
          });
          dataSourceSOP = Utils.distinct(dataSourceSOP);
          if (!this.initialLoading) {
            this.sourceDataInitialize(dataSourceSOP);
            this.initialLoading = true;
          } else {
            // Here is the 2nd time loading data configuration.yet to be done.
            //GraphService.loadDataFromSPARQLParser(dataSourceSOP,graph);
           
            let sparqlConnectionService = this;
            let dataUpdateSubjectNew = this.dataUpdateSubject;
            let graphSubj = this.graphLoadStatus;
            let constService = this.constantService;
            let classQueryIndex = 2 * Math.ceil((this.reqArr.length / 6) / 2);
            let isProcessCompleted = (this.queryIndex == classQueryIndex || this.countValue == this.reqArr.length);
            setTimeout(() => {
              graphSubj.next(constService.LOADED);
              this.graphService._processGson(GraphService._string2GSON(JSON.stringify(Utils.triplesToNodeEdgeSet(dataSourceSOP, sparqlConnectionService.duplicateEdgesMap, this.selectedSources))));
              dataUpdateSubjectNew.next(false);

              if (isProcessCompleted) {
                this.loadClasses(dataUpdateSubjectNew);
                this.isNodesEmpty = true;
                this.constantService.setLoadingFinished(true);
              }
            }, 100);
            if (isProcessCompleted) {
              this.isNodesEmpty = true;
            }
            this.isQueryExecutionCompleted = false;
            this.queryExecution();

            //this.loadClasses(nodeConnectionListOfIds);            
          }
        }
      });
    }
  }


  sourceDataInitialize(dataSourceSOP: any[]) {
    console.log("sourceDataInitialize---------------");
    this.isQueryExecutionCompleted = false;
    let graphSubj = this.graphLoadStatus;
    let constService = this.constantService;
    let rfVal = this.relfinderObj;
    rfVal.setSelectedSources(Array.from(new Set(this.selectedSources)));
    rfVal.setSPARQLConnServiceObj(graphSubj, constService, this.languageSubject, this.filterProcessService, this.intervalSubject, this.dataUpdateSubject);
    GraphService.setServices(this);
    let sparqlConnectionService = this;
    let intervalSub = this.intervalSubject;
    // this.loadClasses(nodeConnectionListOfIds); //,function () {
    rfVal.loadData(dataSourceSOP, this.graphService, function () {
      rfVal.pickup();
    });
    rfVal.startQuery(1, sparqlConnectionService.configService.getActiveEndpoint().maxRelationLength);
    intervalSub.next(200);
    //});
    this.rfInstance = rfVal;
    this.queryExecution();
  }

  fetchData(query: string, timeInterval: number | Date) {
    let activeEndpoint = this.configService.getActiveEndpoint();
    let params = new FormData();


    let headers: HttpHeaders = new HttpHeaders({
      // 'Content-type': 'application/json',
      'Content-Type': 'application/sparql-results+json',
      'Accept': 'application/sparql-results+json'
  });
    if (activeEndpoint.defaultGraphURI) {
      params.append('default-graph-uri', activeEndpoint.defaultGraphURI);
    }
    params.append('query', query);
    params.append('format', 'json');
    let url = this.getUrl(activeEndpoint);
    if (activeEndpoint.method === 'GET') {
      return this.httpClient.get<any>(url, { headers: headers, params: this.getParams(activeEndpoint, query) }).pipe(timeout(timeInterval), catchError(err => of(err.status)));
    }
    else {
      let options = {
        headers: new HttpHeaders({ 'Accept': 'application/sparql-results+json' })
      }
      return this.httpClient.post<any>(url, params, options).pipe(timeout(timeInterval), catchError(err => of(err.status)));
    }
  }

  getUrl(endpoint: Endpoint) {
    let url = this.constantService.dbpediaSparqlUri;
    let appendant = "";
    if (endpoint.dontAppendSparql) {
      appendant = "?";
    } else {
      appendant = "/sparql?"
    }
    url = endpoint.endpointURI + appendant;
    // if (endpoint.useProxy) {
    //   let proxy = this.configService.getConfigData().proxy
    //   if (proxy && proxy.url) {
    //     url = this.configService.getConfigData().proxy.url;
    //   }
    // }
    // console.log('URL: ' + url);
    return url;
  }

  queries = [];
  loadClasses(dataUpdateSubjectNew) {
    let resources = [];
    // dataSourceSOP.forEach((data) => {
    //   let arr = data.split("|");
    //   resources.push(arr[3]);
    //   resources.push(arr[5]);
    // });
    //Remove duplicate URIs
    resources = Array.from(new Set(this.nodeListOfIds));

    resources.forEach((res: string) => {
      if (!this.selectedSources.includes(res)) {
        this.queries.push(this.prepareClassQuery(res));
      }
    });
    this.queries = Array.from(new Set(this.queries));
    this.classDataSequentialCall(dataUpdateSubjectNew);
  }

  public classDataSequentialCall(dataUpdateSubjectNew) {

    if (this.queries.length <= 0) {
      dataUpdateSubjectNew.next(true);
    }

    let classIterationLength = this.queries.length / 6;
    let classQueryIndex = 2 * Math.ceil(classIterationLength / 2);
    while (!this.isClassDataEntered && this.classIndex < classQueryIndex) {
      let classQuery = [];
      let countClassMax = 0;
      while (countClassMax < 6) {
        if (this.queries[this.countClassIndexCount] != undefined) {
          classQuery.push(this.queries[this.countClassIndexCount]);
        }
        if (countClassMax == 5) {
          this.loadClassData(classQuery, dataUpdateSubjectNew);
        }
        countClassMax++;
        this.countClassIndexCount++;
        if (this.countClassIndexCount == this.queries.length) {
          setTimeout(() => {
            this.isClassDataEntered = true;
            dataUpdateSubjectNew.next(true);
          }, 300);
        }
      }
      this.classIndex++;
    }
  }

  prepareClassQuery(resourceURI: string) {
    var query = "SELECT ?class WHERE {<" + resourceURI + "> a ?class . OPTIONAL { ?subClass <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?class } . FILTER (!bound(?subClass)) . FILTER (?class != <http://dbpedia.org/ontology/Resource>) . }";

    return query;
  }

  loadClassData(allQueries: string[], dataUpdateSubjectNew) {
    this.execService.fetchForkJoinObj(allQueries).toPromise().then(combinedData => {
      if (combinedData) {
        this.isClassDataEntered = false;
        this.classDataSequentialCall(dataUpdateSubjectNew);
        combinedData.forEach((data: any) => {
          if (data.results.bindings.length > 0) {
            let uri = data.results.bindings[0].class.value;
            let label = this.replaceWithPrefixes(uri);

            // let classData = { classUri: uri, label: label };
            // this.classUrisWithResUris.set(data.resourceUri, classData);
            let resUris: string[] = [];
            if (this.classUrisWithResUris.has(label)) {
              resUris = this.classUrisWithResUris.get(label);
              resUris.push(data.resourceUri);
              this.classUrisWithResUris.set(label, Array.from(new Set(resUris)));
            } else {
              resUris = [];
              resUris.push(data.resourceUri);
              this.classUrisWithResUris.set(label, Array.from(new Set(resUris)));
            }
            let classData = this.graphService.setClassData();
            this.filterProcessService.setClassData(classData);
            this.filterProcessService.fetchFilterData();
          }
        });
      }

    },
      error => {
        console.log("Error on forkjoin", error);
      });
  }

  private replaceWithPrefixes(uri: string) {
    let urlLabel = uri.replace("http://dbpedia.org/ontology/", "db:")
      .replace("http://dbpedia.org/class/yago/", "yago:")
      .replace("http://sw.opencyc.org/2008/06/10/concept/", "cyc:")
      .replace("http://xmlns.com/foaf/0.1/", "foaf:")
      .replace("http://umbel.org/umbel/sc/", "umb:")
      .replace("http://www.w3.org/2000/01/rdf-schema#", "rdfs:");

    return urlLabel;
  }

  preparePropertyHasValueQuery(uri: string) {
    return 'SELECT ?property ?hasValue WHERE { <' + uri + '> ?property ?hasValue }'
  }

  public clearMessages() {
    this.languageSubject.next('');
  }

  public cancelHttpRequestCalls() {
    if (this.httpForkJoinSubscription) {
      this.httpForkJoinSubscription.unsubscribe();
    }
  }

  public clearGraph() {
    if (this.rfInstance) {
      this.rfInstance.clearScreen();
      this.rfInstance.stopQuery();
    }
    if (this.classUrisWithResUris) {
      this.classUrisWithResUris.clear();
    }
    if (this.duplicateEdgesMap) {
      this.duplicateEdgesMap.clear();
    }
  }
  public resetGlobalValues() {
    this.queryIndex = 0;
    this.countValue = 0;
    this.isQueryExecutionCompleted = false;
    this.initialLoading = false;
    this.reqArr = []
    this.objectlistArry = [];
    this.queryPropArray = [];
    this.mapProperty = [];
    this.nodeListOfIds = [];
    this.classIndex = 0;
    this.countClassIndexCount = 0;
    this.isClassDataEntered = false;
    this.queries = [];
    this.dataUpdateSubject.next(false);
    this.isNodesEmpty = false;
    this.constantService.setLoadingFinished(false);
    this.isResetTriggred=false;
  }

  public getMessage(): Observable<any> {
    return this.emptyNodesObjectSubject.asObservable();
  }

  public setResetTriggered(isTriggered){
    this.isResetTriggred=isTriggered;
}
  getParams(activeEndpoint: Endpoint, query: string): HttpParams {
    let params = new HttpParams();
    if (activeEndpoint.defaultGraphURI) {
      params = params.append('default-graph-uri', activeEndpoint.defaultGraphURI);
    }
    // if (activeEndpoint.useProxy) {
    //   params = params.append('endpoint', btoa(activeEndpoint.endpointURI));
    //   params = params.append('query', btoa(query));
    //   params = params.append('method', activeEndpoint.method);
    // } else
      params = params.append('query', query);
    
    params = params.append('format', 'json');
    return params;
  }
}
