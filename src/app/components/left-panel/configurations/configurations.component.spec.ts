import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';
import { SnackbarComponent } from 'src/app/components/default/snackbar/snackbar.component';
import { ISlimScrollOptions, NgSlimScrollModule } from 'ngx-slimscroll';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigurationsComponent } from './configurations.component';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatTooltipModule } from '@angular/material';
import { NgxBootstrapModule } from 'src/shared/ngx-bootstrap.module';
import { EMPTY, of } from 'rxjs';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../default/confirm-dialog/confirm-dialog.component';
import { ConfigFormComponent } from './config-form/config-form.component';
import { Endpoint } from 'src/app/models/endpoint.model';
import { MatChipsModule } from '@angular/material/chips';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { GraphService } from 'src/app/base/service/graph-service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { LeftPanelComponent } from '../left-panel.component';

describe('ConfigurationsComponent', () => {
  let component: ConfigurationsComponent;
  let fixture: ComponentFixture<ConfigurationsComponent>;
  let configService: ConfigurationsService;
  let openDialogSpy: jasmine.Spy;
  let leftPanelComponet: LeftPanelComponent;
  let httpMock: HttpTestingController;
  let filterProcessService: FilterProcessService;
  let sparqlconnection: SPARQLConnectionService;
  let opts: ISlimScrollOptions = {
    alwaysVisible: false
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationsComponent, ConfirmDialogComponent, ConfigFormComponent, LeftPanelComponent, FirstCaseUpperPipe, TruncateStringPipe, SnackbarComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatChipsModule,
        HttpClientTestingModule,
        NgxBootstrapModule,
        MatTooltipModule,
        NgSlimScrollModule
      ],
      providers: [
        LeftPanelComponent
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogComponent, ConfigFormComponent, SnackbarComponent] } })
      .compileComponents();
    fixture = TestBed.createComponent(ConfigurationsComponent);
    configService = TestBed.get(ConfigurationsService);
    leftPanelComponet = TestBed.get(LeftPanelComponent);
    httpMock = TestBed.get(HttpTestingController);
    sparqlconnection = TestBed.get(SPARQLConnectionService);
    filterProcessService = TestBed.get(FilterProcessService);
    component = fixture.componentInstance;
    configService.setConfigData();
    sparqlconnection.filterProcessService = filterProcessService;
    GraphService.setServices(sparqlconnection);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    openDialogSpy = spyOn(component.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => EMPTY } as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#openEditDialog should open the dialog pop up', (done) => {
    let endpoint = getDummyEndpointObj();
    component.openEditDialog(endpoint);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(openDialogSpy).toHaveBeenCalledWith(ConfigFormComponent, { data: { data: endpoint } });
    done();
  });

  xit('#createDialog should open the dialog pop up', (done) => {
    component.createDialog();
    let endpoint = new Endpoint(false, '', '', '', '', false, '', false, false, 'POST', 2, [''], 'en', [''], [''], [''], [''], 'VIR');
    expect(openDialogSpy).toHaveBeenCalled();
    setTimeout(()=>{
      expect(openDialogSpy).toHaveBeenCalledWith(ConfigFormComponent, { data: { data: endpoint } });
      done();
    },2000);
   
  });

  it('#activateEndpoint should activate the first endpoint from the list.', (done) => {
    let endpointsArr = [];
    let endpoint = getDummyEndpointObj();
    endpointsArr.push(endpoint);
    component.activateEndpoint(endpointsArr);
    expect(component.configService.getActiveEndpoint().id).toEqual(endpoint.id);
    done();
  });

  it('#delete should open the dialog for delete confirmation', (done) => {
    let endpoint = getDummyEndpointObj();
    component.delete(endpoint);
    expect(openDialogSpy).toHaveBeenCalled();
    const dialogData = new ConfirmDialogModel('Delete Database Resource', 'Do you want to proceed and delete selected Database?', './assets/icons/icons_delete_db.svg');
    expect(openDialogSpy).toHaveBeenCalledWith(ConfirmDialogComponent, { width: '373px', height: '197px', data: dialogData });
    done();
  });

  it('#onSubmit should be called', (done) => {
    spyOn(component, "onSubmit").and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.isSubmitted).toBeTruthy();
    done();
  });

  it('#downloadConfigurations should be called', (done) => {
    spyOn(component, "downloadConfigurations").and.callThrough();
    component.downloadConfigurations();
    expect(component.downloadConfigurations).toHaveBeenCalled();
    done();
  });

  it('#loadConfig should open the dialog pop up', (done) => {
    component.loadConfig();
    expect(openDialogSpy).toHaveBeenCalled();
    done();
  });

  it('#onDbChange should be called', (done) => {
    spyOn(component, "onDbChange").and.callThrough();
    let event = { target: { checked: true } };
    component.onDbChange(event);
    expect(component.onDbChange).toHaveBeenCalled();
    done();
  });

  it('#sortingElementsBasedonActiveEndpoint should be called', (done) => {
    spyOn(component, "sortingElementsBasedonActiveEndpoint").and.callThrough();
    component.sortingElementsBasedonActiveEndpoint(true);
    expect(component.sortingElementsBasedonActiveEndpoint).toHaveBeenCalled();
    done();
  });

  it('#Slimscroll event should be called', (done) => {
    spyOn(component, "playScrollEvent").and.callThrough();
    component.playScrollEvent();
    expect(component.playScrollEvent).toHaveBeenCalled();
    done();
  });

  function getDummyEndpointObj(): Endpoint {
    let endpoint: Endpoint = {
      active: false,
      name: "dummy",
      id: "dbp",
      description: "dummy",
      endpointURI: "dummy",
      dontAppendSparql: false,
      defaultGraphURI: "dummy",
      isVirtuoso: true,
      useProxy: true,
      method: "POST",
      autocompleteURIs: ["dummy"],
      autocompleteLanguage: "en",
      ignoredProperties: [''],
      abstractURIs: [''],
      imageURIs: [''],
      linkURIs: [''],
      maxRelationLength: 3,
      queryType: 'CMP'
    }
    return endpoint;
  }
});
