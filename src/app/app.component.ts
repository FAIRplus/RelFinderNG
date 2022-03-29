import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfigModel } from './models/config.model';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { HttpParams } from '@angular/common/http';
import * as locale from "../app/config/locale.json";
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConfigurationsService } from './services/configurations/configurations.service';
import { SparqlPropertyService } from './services/sparql/sparql-property.service';
import { Utils } from './services/util/common.utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'RelFinder';
  searchFormObjects: any = [];
  endoint: any = [];
  objectsQuery: string = '';
  endpointQuery: string = '';
  autoCompleteFormData = [];
  autoCompSub: Subscription;
  localization: any = (locale as any).default;
  isDisplayed: boolean = true;
  constructor(public ConfigService: ConfigurationsService, private constantsService: ConstantsService, private autoCompleteService: AutoCompleteService, private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, private propertyService: SparqlPropertyService) {
  }

  ngOnInit() {
    // Set data from JSON file for configurations.
    // this.ConfigService.setConfigData();    
    this.autoCompSub = this.autoCompleteService.getAutoFormData().subscribe((data) => {
      this.autoCompleteFormData = data;
    });
    this.propertyService.setLanguageCodes(this.localization);
    this.isDisplayed = Utils._displaySwitch;
  }

  ngAfterViewInit() {
    const url = window.location.href;
    this.getParamValueQueryString(url);

    let activeEP = this.ConfigService.getActiveEndpoint();
    if (activeEP) {
      this.ConfigService.configPopupHeader.next(activeEP.name);
    }
    this.cdr.detectChanges();
  }

  getParamValueQueryString(url: any) {
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      let objectsParam = httpParams.get(this.constantsService.URI_OBJECTS);
      let endpointParam = httpParams.get(this.constantsService.URI_ENDPOINT);
      if (objectsParam) {
        this.searchFormObjects = JSON.parse(atob(objectsParam));
        this.autoCompleteService.setAutoCompFormData(this.searchFormObjects);
      }
      if (endpointParam) {
        this.endoint = JSON.parse(atob(endpointParam));
        this.ConfigService.setUriConfigData(new ConfigModel({ url: '' }, [this.endoint]));
      } else {
        // Set data from JSON file for configurations.
        this.ConfigService.setConfigData();
      }
      if (objectsParam) {
        this.autoCompleteService.loadGraphWithQueryData(this.searchFormObjects);
      }
    } else {
      // Set data from JSON file for configurations.
      this.ConfigService.setConfigData();
      //open search popup on page load
      this.ConfigService.toggleLeftMenu.next({ type: 'search', visible: true });
    }
  }
}

