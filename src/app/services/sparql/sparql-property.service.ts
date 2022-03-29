import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from '../util/common.utils';
import { LoadConfigService } from '../configurations/load-config.service';
import { ConfigurationsService } from '../configurations/configurations.service';


@Injectable({
  providedIn: 'root'
})
export class SparqlPropertyService {

  
  constructor(private configurationService:ConfigurationsService) {

  }

  private subject = new BehaviorSubject<any>('');
  

  public selectionNodeID: string;
  public language: string;
  public mapNodeObj = [];
  public languagesObj = [];
  public languageCodes=new Map();

  public sendMessage(message: string, labelValue: string) {
    this.subject.next({ text: message, label: labelValue });
  }
  public clearMessages() {
    this.subject.next('');
  }
  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  public setLanguages(languages: any[]) {
    this.languagesObj.push(...languages);
    this.languagesObj=Utils.distinct(this.languagesObj);
  }

  public setLocaleNodeID(localeID: string) {
    this.selectionNodeID = localeID;
  }
  public setLanguageSelected(selectedLang: string) {
    this.language = selectedLang;
  }

  public setNodeLocalization(mapNodeValue: any[]) {
    this.mapNodeObj.push(...mapNodeValue);
    this.mapNodeObj=Utils.removeDuplicates(this.mapNodeObj);
  }

  public setLanguageCodes(languageCodes:any){
    for(let obj of languageCodes){
      this.languageCodes.set(obj.code,obj.nativeName+"_LS_"+obj.name);
     }
  }

  fetchLocaleData(responseObj: any, languaeObj: any[]) {
    if (responseObj != null) {
      let dataObj = { labeledData: [], abstractData: [] ,linkURIData : [],imageURI :[]}
      let responseData = responseObj;
      if (typeof responseData !== 'undefined') {
        for (var resRawData of responseData['results']['bindings']) {
          if (resRawData != null && resRawData != ' ') {
            for(let uriValue of this.configurationService.getActiveEndpoint().autocompleteURIs){
            //if (Utils.lastEleInArray(Utils.trimURI(resRawData.property.value).split('#')) == 'label') {
              if (uriValue == resRawData.property.value) {
              languaeObj.push(this.languageCodes.has(resRawData.hasValue['xml:lang'])?this.languageCodes.get(resRawData.hasValue['xml:lang']):resRawData.hasValue['xml:lang']);
              let lableObj = {
                'lang': this.languageCodes.has(resRawData.hasValue['xml:lang'])?this.languageCodes.get(resRawData.hasValue['xml:lang']).split("_LS_")[0]:resRawData.hasValue['xml:lang'],
                'value': resRawData.hasValue.value
              }
              dataObj.labeledData.push(lableObj);
             }
            }
           // if (Utils.lastEleInArray(Utils.trimURI(resRawData.property.value).split('/')) === 'abstract') {
            for(let uriAbstractValue of this.configurationService.getActiveEndpoint().abstractURIs){
            if (resRawData.property.value == uriAbstractValue) {
              let abstractObj = {
                'lang': this.languageCodes.has(resRawData.hasValue['xml:lang'])?this.languageCodes.get(resRawData.hasValue['xml:lang']).split("_LS_")[0]:resRawData.hasValue['xml:lang'],
                'value': resRawData.hasValue.value
              }
              dataObj.abstractData.push(abstractObj);
            }
           }

           for(let linkURI of this.configurationService.getActiveEndpoint().linkURIs){
            if (resRawData.property.value == linkURI) {
              if(!dataObj.linkURIData.includes(resRawData.hasValue.value)){
                dataObj.linkURIData.push(resRawData.hasValue.value);
              }
              dataObj.linkURIData=Array.from(new Set(dataObj.linkURIData));
            }
           }
           for(let imageURI of this.configurationService.getActiveEndpoint().imageURIs){
            if (resRawData.property.value == imageURI) {
              if(!dataObj.linkURIData.includes(resRawData.hasValue.value)){
                dataObj.imageURI.push(resRawData.hasValue.value);
              }
              dataObj.imageURI=Array.from(new Set(dataObj.imageURI));             
            }
           }

          }
        }
      }
      return dataObj;
    }
  }

  public setSelectedNodeLocaleData(languageGlobally: string, nodeId: any) {
    let totalSize = this.mapNodeObj.length;
    let count = 1;
    for (let obj of this.mapNodeObj) {
      let labelValue = '';
     
      if (obj.id === nodeId) {
        for (let lableObj of obj.value.labeledData) {
          if (languageGlobally === 'res') {
            if (lableObj.lang === 'English') {
              labelValue = obj.id;
              break;
            }
          }
          else {
            if (lableObj.lang === languageGlobally) {
              labelValue = lableObj.value;
              break;
            }
          }
        }
        for (let abstract of obj.value.abstractData) {
          if (languageGlobally === 'res') {
            if (abstract.lang === 'English') {
              this.sendMessage(obj.value.linkURIData[0]+"_SEP_"+abstract.value+"_SEP_"+obj.value.imageURI[0], labelValue);
              break;
            }
          }
          else {
            if (abstract.lang === languageGlobally) {
              this.sendMessage(obj.value.linkURIData[0]+"_SEP_"+abstract.value+"_SEP_"+obj.value.imageURI[0], labelValue);
              break;
            }
          }
        }
        break;
      } else {
        if (totalSize === count) {
          this.sendMessage('There is no information...!', nodeId);
        }
      }
      count++;
    }
  }
}
