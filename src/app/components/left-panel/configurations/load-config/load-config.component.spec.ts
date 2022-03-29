import { SnackbarComponent } from 'src/app/components/default/snackbar/snackbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { PrettyjsonPipe } from './../../../../pipes/prettyjson.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';

import { LoadConfigComponent } from './load-config.component';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadConfigService } from 'src/app/services/configurations/load-config.service';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoadConfigComponent', () => {
  let component: LoadConfigComponent;
  let fixture: ComponentFixture<LoadConfigComponent>;
  let configService: ConfigurationsService;
  let loadConfigService: LoadConfigService;
  let testConf: TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadConfigComponent, PrettyjsonPipe, FirstCaseUpperPipe, TruncateStringPipe, SnackbarComponent],
      imports: [
        MatDialogModule,
        BrowserDynamicTestingModule,
        MatTooltipModule,
        TooltipModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SnackbarComponent] } })
      .compileComponents();
    fixture = TestBed.createComponent(LoadConfigComponent);
    configService = TestBed.get(ConfigurationsService);
    loadConfigService = TestBed.get(LoadConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#closeMe should close the dialog.', () => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.closeMe();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it("#uploadFile should be called with correct file type and alertMsg has blank type and message", (done) => {
    let fileList = getFileList('application/json', 'config.json');
    spyOn(component, "uploadFile").and.callThrough();
    component.uploadFile(fileList)
    expect(component.uploadFile).toHaveBeenCalledWith(fileList);
    expect(component.alertMsg.type).toEqual('');
    expect(component.alertMsg.message).toEqual('');
    done();
  });

  it("#uploadFile should be called with wrong file type and alertMsg type should be error ", (done) => {
    let fileList = getFileList('text/html', 'config.html');
    spyOn(component, "uploadFile").and.callThrough();
    component.uploadFile(fileList)
    expect(component.uploadFile).toHaveBeenCalledWith(fileList);
    expect(component.alertMsg.type).toEqual('error');
    expect(component.alertMsg.messageList[0].message).toContain('Invalid File Format');
    done();
  });

  it('#replaceConfig method should be called', (done) => {
    spyOn(component, "replaceConfig").and.callThrough();
    component.fileContent = getFileContent();
    component.replaceConfig();
    expect(component.replaceConfig).toHaveBeenCalled();
    done();
  });

  it('#validateFile method should be called and atertMsg type should be success', (done) => {
    spyOn(component, "validateFile").and.callThrough();
    component.fileContent = getFileContent();
    component.validateFile();
    expect(component.validateFile).toHaveBeenCalled();
    expect(component.alertMsg.type).toEqual('success');
    expect(component.alertMsg.message).toContain('Click Upload to proceed');
    done();
  });

  it('#validateFile method should be called and check the endpoint property', (done) => {
    spyOn(component, "validateFile").and.callThrough();
    component.fileContent = getWrongFileContent();
    component.validateFile();
    expect(component.validateFile).toHaveBeenCalled();
    expect(component.alertMsg.type).toEqual('error');
    expect(component.alertMsg.messageList[0].message).toContain('Atleast one Endpoint Property Must hold Value. It must be Either True/False.');
    done();
  });

  it('#validateFile method should be called and check the name property', (done) => {
    spyOn(component, "validateFile").and.callThrough();
    component.fileContent = getWrongFileContent2();
    component.validateFile();
    expect(component.validateFile).toHaveBeenCalled();
    expect(component.alertMsg.type).toEqual('error');
    expect(component.alertMsg.messageList[0].message).toContain('No EndPoint URI Found! End Point with ID: dbp has No Endpoint URI Attribute');
    done();
  });

  it('#deleteFile method should be called', (done) => {
    spyOn(component, "deleteFile").and.callThrough();
    component.deleteFile(0);
    expect(component.deleteFile).toHaveBeenCalled();
    done();
  });

  it('#resetValidClick method should be called', (done) => {
    spyOn(component, "resetValidClick").and.callThrough();
    component.resetValidClick();
    expect(component.resetValidClick).toHaveBeenCalled();
    done();
  });

  it("#saveFiles should be called", (done) => {
    let fileList = getFileList('application/json', 'config.json');
    spyOn(component, "saveFiles").and.callThrough();
    component.saveFiles(fileList)
    expect(component.saveFiles).toHaveBeenCalledWith(fileList);
    expect(component.alertMsg.type).toEqual('');
    expect(component.alertMsg.message).toEqual('');
    done();
  });

  it('#shrinkText method should be called', (done) => {
    spyOn(component, "shrinkText").and.callThrough();
    let str = 'Relfinder is a great entity-relationship site to find relations between entities.';
    let result = component.shrinkText(str);
    expect(component.shrinkText).toHaveBeenCalled();
    expect(result).toEqual('Relfinder...ntities.');
    done();
  });

  it('#onDragOver should set dragAreaClass  value', (done) => {
    let event = new Event('dragover');
    component.onDragOver(event);
    expect(component.dragAreaClass).toEqual('droparea');
    done();
  });

  it('#onDragEnter should set dragAreaClass  value', (done) => {
    let event = new Event('dragenter');
    component.onDragEnter(event);
    expect(component.dragAreaClass).toEqual('droparea');
    done();
  });

  it('#onDragEnd should set dragAreaClass  value', (done) => {
    let event = new Event('dragend');
    component.onDragEnd(event);
    expect(component.dragAreaClass).toEqual('dragarea');
    done();
  });

  it('#onDragLeave should set dragAreaClass  value', (done) => {
    let event = new Event('dragleave');
    component.onDragLeave(event);
    expect(component.dragAreaClass).toEqual('dragarea');
    done();
  });

  it('#onDrop should set dragAreaClass  value', (done) => {
    const file = new File([''], 'dummy.json');
    const fileDropEvent = { preventDefault: () => { }, stopPropagation: () => { }, dataTransfer: { files: [file, file, file] } };
    component.onDrop(fileDropEvent);
    expect(component.dragAreaClass).toEqual('dragarea');
    done();
  });

  it('#Clear erorr messages method should be called and check message values', (done) => {
    spyOn(component, "clearErrMsgs").and.callThrough();
    component.clearErrMsgs();
    expect(component.clearErrMsgs).toHaveBeenCalled();
    expect(component.firstErrEnd).toEqual('');
    expect(component.firstErrBegin).toEqual('');
    expect(component.alertMsg).toEqual(undefined);
    done();
  });

  function getFileList(fileType: string, fileName: string) {
    const blob = new Blob([""], { type: fileType });
    blob["lastModifiedDate"] = "";
    blob["name"] = fileName;
    const file = <File>blob;
    return {
      0: file,
      length: 1,
      item: (index: number) => file
    };
  }

  function getWrongFileContent() {
    return JSON.stringify({
      "proxy": {
        "url": ""
      },
      "endpoints": []
    });
  }

  function getWrongFileContent2() {
    return JSON.stringify({
      "proxy": {
        "url": ""
      },
      "endpoints": [
        {
          "active": false,
          "name": testConfigData.name,
          "id": testConfigData.id,
          "maxRelationLength": "2"
        }
      ]
    });
  }

  function getFileContent() {
    return JSON.stringify({
      "proxy": {
        "url": ""
      },
      "endpoints": [
        {
          "active": false,
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
          "maxRelationLength": "2",
          "queryType": "VIR"
        },
        {
          "active": true,
          "name": "Linked Movie Data Base",
          "id": "lmdb",
          "description": "Semantic Web dataset for movie-related information.",
          "endpointURI": "http://data.linkedmdb.org",
          "dontAppendSparql": false,
          "isVirtuoso": false,
          "useProxy": true,
          "method": "POST",
          "autocompleteURIs": [
            "http://www.w3.org/2000/01/rdf-schema#label",
            "http://xmlns.com/foaf/0.1/name",
            "http://xmlns.com/foaf/0.1/Person"
          ],
          "autocompleteLanguage": "en",
          "linkURIs": [
            "http://xmlns.com/foaf/0.1/page"
          ],
          "maxRelationLength": "2",
          "queryType": "VIR"
        },
        {
          "active": false,
          "name": "Linking Open Data (LOD)",
          "id": "lod",
          "description": "Endpoint of the Linking Open Data project.",
          "endpointURI": "http://lod.openlinksw.com",
          "dontAppendSparql": true,
          "isVirtuoso": true,
          "useProxy": true,
          "method": "POST",
          "autocompleteURIs": [
            "http://www.w3.org/2000/01/rdf-schema#label"
          ],
          "autocompleteLanguage": "en",
          "ignoredProperties": [
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
            "http://www.w3.org/2004/02/skos/core#subject",
            "http://dbpedia.org/property/wikiPageUsesTemplate",
            "http://dbpedia.org/property/wordnet_type",
            "http://dbpedia.org/property/wikilink",
            "http://www.w3.org/2002/07/owl#sameAs",
            "http://purl.org/dc/terms/subject"
          ],
          "abstractURIs": [
            "http://dbpedia.org/ontology/abstract"
          ],
          "imageURIs": [
            "http://dbpedia.org/ontology/thumbnail",
            "http://xmlns.com/foaf/0.1/depiction"
          ],
          "linkURIs": [
            "http://purl.org/ontology/mo/wikipedia",
            "http://xmlns.com/foaf/0.1/homepage",
            "http://xmlns.com/foaf/0.1/page"
          ],
          "maxRelationLength": "2",
          "queryType": "VIR"
        },
        {
          "active": false,
          "name": "Semantic Web Dog Food",
          "id": "swdf",
          "description": "Metadata about Semantic Web conferences and workshops.",
          "endpointURI": "http://data.semanticweb.org",
          "dontAppendSparql": false,
          "isVirtuoso": false,
          "useProxy": true,
          "method": "POST",
          "autocompleteURIs": [
            "http://www.w3.org/2000/01/rdf-schema#label"
          ],
          "autocompleteLanguage": "en",
          "abstractURIs": [
            "http://swrc.ontoware.org/ontology#abstract",
            "http://www.w3.org/2002/12/cal/ical#description"
          ],
          "imageURIs": [
            "http://data.semanticweb.org/ns/swc/ontology#hasLogo"
          ],
          "linkURIs": [
            "http://xmlns.com/foaf/0.1/homepage"
          ],
          "maxRelationLength": "2",
          "queryType": "VIR"
        }
      ]
    });
  }

});
