import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { Endpoint } from './../../../../models/endpoint.model';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigurationsService } from './../../../../services/configurations/configurations.service';
import { HttpClientModule } from '@angular/common/http';
import { PrettyjsonPipe } from './../../../../pipes/prettyjson.pipe';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';

import { QueryToolComponent } from './query-tool.component';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('QueryToolComponent', () => {
  let component: QueryToolComponent;
  let fixture: ComponentFixture<QueryToolComponent>;
  let configService: ConfigurationsService;
  let sampleQuery = 'select distinct ?Concept where {[] a ?Concept} LIMIT 10';
  let overlayContainerElement: HTMLElement;
  let testConf: TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueryToolComponent,
        PrettyjsonPipe,
        FirstCaseUpperPipe,
        TruncateStringPipe
      ],
      imports: [
        FormsModule,
        MatDialogModule,
        BrowserDynamicTestingModule,
        HttpClientModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
        HttpClientModule,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryToolComponent);
    component = fixture.componentInstance;
    configService = TestBed.get(ConfigurationsService);
    configService.setConfigData();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#closeDialog should close the dialog.', () => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('check execute button state', () => {
    let executeEl = fixture.debugElement.query(By.css('button'));
    expect(executeEl.nativeElement.disabled).toBeTruthy();

    component.selectedEndpoint = getDBpediaEndpoint();
    component.query = sampleQuery;
    fixture.detectChanges();
    expect(executeEl.nativeElement.disabled).toBeFalsy()
  });

  it('get live response from DBpedia for sample query', () => {
    component.selectedEndpoint = getDBpediaEndpoint();
    component.query = sampleQuery;
    fixture.detectChanges();

    let executeEl = fixture.debugElement.query(By.css('button'));
    executeEl.triggerEventHandler('click', null);
    expect(component.response.length).toBe(0);
  });

  it('#onExecute should call else block', (done) => {
    spyOn(component, 'onExecute').and.callThrough();
    component.onExecute();
    expect(component.onExecute).toHaveBeenCalled();
    expect(component.hasError).toBeTruthy();
    done();
  });

  it('#onInput should set query data', (done) => {
    spyOn(component, 'onInput').and.callThrough();
    let event = { target: { textContent: 'Dummy input text' } };
    component.onInput(event);
    expect(component.onInput).toHaveBeenCalled();
    expect(component.query).toEqual('Dummy input text');
    done();
  });

  it('#onPaste should be called', (done) => {
    spyOn(component, 'onPaste').and.callThrough();
    let event = new Event('drop');
    let dT = new DataTransfer();
    let evt = new ClipboardEvent('drop', { clipboardData: dT });
    evt.clipboardData.setData('text/plain', 'Hello from relfinder');
    component.onPaste(evt);
    expect(component.onPaste).toHaveBeenCalled();
    done();
  });

  it('#onDrop should be called', (done) => {
    spyOn(component, 'onPaste');
    let event = new Event('drop');
    let result = component.onDrop(event);
    expect(result).toBeFalsy()
    done();
  });

  function getDBpediaEndpoint(): Endpoint {
    return {
      "active": true,
      "name": testConfigData.name,
      "id": testConfigData.id,
      "description": testConfigData.description,
      "endpointURI": testConfigData.endpointURI,
      "dontAppendSparql": false,
      "defaultGraphURI": testConfigData.defaultGraphURI,
      "isVirtuoso": true,
      "useProxy": true,
      "method": "POST",
      "autocompleteURIs": testConfigData.autocompleteURIs,
      "autocompleteLanguage": "en",
      "ignoredProperties": testConfigData.ignoredProperties,
      "abstractURIs": testConfigData.abstractURIs,
      "imageURIs": testConfigData.imageURIs,
      "linkURIs": testConfigData.linkURIs,
      "maxRelationLength": 2,
      "queryType": "VIR"
    };
  }

});
