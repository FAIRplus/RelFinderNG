import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { Subscription } from 'rxjs';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Utils } from 'src/app/services/util/common.utils';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {
  @Input("info") info: any;
  @Input("desc") desc: any;
  @Input("infoURI") infoURI: any;
  @Input("imageURI") imageURI: any;
  
  languages=[]
  subscription: Subscription;
  show: boolean = false;
  countryForm: FormGroup;
  language:string='English';  
  truncatedInfo: string = '';

  constructor(private sparqlConService: SPARQLConnectionService,
    public constanService: ConstantsService,private fb: FormBuilder,private configService:ConfigurationsService) {
    // subscribe to home component messages
    this.subscription = this.constanService.localeResourceService.getMessage().subscribe(data => {
      if (data) {
        if(data.label){
          this.info = decodeURI(data.label);
          this.shrinkInfo();
        }  
        let linkURIandDesc=data.text.split("_SEP_");
        if(linkURIandDesc[0] != '' && linkURIandDesc[0] != 'undefined' ){
          this.infoURI=linkURIandDesc[0];
        }else{
          this.infoURI=configService.getActiveEndpoint().endpointURI;
        }

        if(linkURIandDesc[2] != '' && linkURIandDesc[2] != 'undefined' ){
          this.imageURI=linkURIandDesc[2];
        }else{
          this.imageURI="";
        }
        
        this.desc = linkURIandDesc[1];
      }
    });
    this.languages=this.constanService.localeResourceService.languagesObj;
    this.getFormSelectedData();

  }
  changeFilter(language) {
   let langValue=language.value;
   this.constanService.localeResourceService.setLanguageSelected(langValue);
   this.sparqlConService.languageSubject.next({lang:langValue});
  }

  ngOnInit() {
    this.getFormSelectedData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormSelectedData(){
    if(this.constanService.localeResourceService.language){
      this.language=this.constanService.localeResourceService.language;
    }
    this.countryForm = this.fb.group({
        countryControl: [this.language]
    });
  }
  updateValue(langValue: string){
    return Utils.truncateString(langValue,10);
  }

  shrinkInfo() {
    if (this.info.length > 18) {
      this.truncatedInfo = Utils.truncateString(this.info, 17, 'end');
    } else {
      this.truncatedInfo = this.info;
    }
  }
}
