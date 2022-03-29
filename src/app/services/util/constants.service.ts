import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SparqlPropertyService } from '../sparql/sparql-property.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public localeResourceService: SparqlPropertyService;
  public configurationsService: ConfigurationsService;
  private isProcessCompleted=false;
  
  constructor(localeResourceService: SparqlPropertyService, configurationsService: ConfigurationsService) {
    this.localeResourceService = localeResourceService;
    this.configurationsService = configurationsService;
  }

  readonly dbpediaSparqlUri: string = 'https://dbpedia.org/sparql';
  readonly IDLE: string = 'InitialState';
  readonly LOADING: string = 'DataFetchingInprogress';
  readonly LOADED: string = 'DataFetchFinished';
  readonly FINISHED: string = 'VisualizationFinished';
  readonly URI_OBJECTS: string = 'objects';
  readonly URI_ENDPOINT: string = 'endpoint';
  readonly TOP_TOOL_TIP_CLASS_TOP:string = 'material-tooltiptop';
  readonly TOP_TOOL_TIP_CLASS_DOWN:string = 'material-tooltip';

  private subject = new BehaviorSubject<any>('');
  querystring = [];

  public sendMessage(message: string, labelValue: string) {
    this.subject.next({ text: message, label: labelValue });
  }

  getFormData() {
    return this.querystring;
  }

  public clearMessages() {
    this.subject.next('');
    this.querystring = [];
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  public mapNodeObj = [];

  public setNodeLocalization(mapNodeoValue) {
    this.mapNodeObj = mapNodeoValue;
  }

  public setLoadingFinished(isFinshed){
    this.isProcessCompleted=isFinshed;
  }
}
