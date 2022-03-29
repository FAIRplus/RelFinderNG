import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { MatSnackBarModule } from '@angular/material';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let autocompService: AutoCompleteService;
  let sparqlConnectionService: SPARQLConnectionService;
  let constantService: ConstantsService;
  let clearConfirmationDialogService: ClearConfirmationDialogService;
  let httpMock: HttpTestingController;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;  

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, ConfirmDialogComponent, MatTooltip ],
      imports:[ BrowserAnimationsModule, HttpClientTestingModule, MatDialogModule, MatSnackBarModule ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        }
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ ConfirmDialogComponent ] } })
    .compileComponents();
  }));

  beforeEach(() => {
    autocompService = TestBed.get(AutoCompleteService);
    sparqlConnectionService = TestBed.get(SPARQLConnectionService);
    constantService = TestBed.get(ConstantsService);
    clearConfirmationDialogService = TestBed.get(ClearConfirmationDialogService);
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(HeaderComponent);
    
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSkipLoad', (done) => {
    spyOn(component, "onSkipLoad").and.callThrough();
    component.onSkipLoad();
    expect(component.onSkipLoad).toHaveBeenCalled();
    done();
  });

  it('#ngOnInit should subscribe autocomplete service AutoFormData and call onLoad method.', (done) => {
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Rohit_Sharma", "Rohit Sharma", "105"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Virat_Kohli", "Virat Kohli", "165"));
  
    component.ngOnInit();
    expect(component.autoCompleteFormData.length).toEqual(2);
    expect(component.autoCompleteFormData).toEqual(getAllAutoCompleteFormData());
    done();
  });

  it('#onHover should return the blank string.', (done) => {
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Rohit_Sharma", "Rohit Sharma", "105"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Virat_Kohli", "Virat Kohli", "165"));
  
    let result = component.searchVal;
    expect(result.trim()).toEqual('');
    done();
  });

  it('#onHover should return the long string.', (done) => {
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Rohit_Sharma", "Rohit Sharma", "105"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Virat_Kohli", "Virat Kohli", "165"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Harish_Kumar_Sharda", "Harish Kumar Sharda", "115"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Amit_Kumar_Prashar", "Amit Kumar Prashar", "125"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Ankur_Kumar_Sharma", "Ankur Kumar Sharma", "135"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Ramineni_Venkata_Pavan Kumar", "Ramineni Venkata Pavan Kumar", "185"));
    component.autocompService.pushDataToAutoCompFormArr(getAutoCompformData(nodeResUrl+"Arun_Prasath_Kumara", "Arun Prasath Kumara", "145"));

    let result = component.searchVal;
    expect(result.trim()).toEqual("Rohit Sharma vs Virat Kohli vs Harish Kumar Sharda vs Amit Kumar Prashar vs Ankur Kumar Sharma vs Ramineni Venkata Pavan Kumar vs Arun Prasath Kumara");
    done();
  });

  it('#onDismiss should be call', (done) => {
    spyOn(component, 'onDismiss').and.callThrough();
    component.onDismiss();
    expect(component.onDismiss).toHaveBeenCalled();
    component.clearConfirmationDialogService.dialog.closeAll();
    fixture.detectChanges();
    done();
  });


  function getAutoCompformData(uri: string, name: string, count: string) {
    return {
      "sub": {
        "type": "uri",
        "value": uri
      },
      "middle": {
        "type": "literal",
        "xml:lang": "en",
        "value": name
      },
      "count": {
        "type": "typed-literal",
        "datatype": "http://www.w3.org/2001/XMLSchema#integer",
        "value": count
      }
    };
  }

  function getAllAutoCompleteFormData() {
    return [
      {
        "sub": {
          "type": "uri",
          "value": nodeResUrl+"Rohit_Sharma"
        },
        "middle": {
          "type": "literal",
          "xml:lang": "en",
          "value": "Rohit Sharma"
        },
        "count": {
          "type": "typed-literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "105"
        }
      },
      {
        "sub": {
          "type": "uri",
          "value": nodeResUrl+"Virat_Kohli"
        },
        "middle": {
          "type": "literal",
          "xml:lang": "en",
          "value": "Virat Kohli"
        },
        "count": {
          "type": "typed-literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "165"
        }
      }
    ];
  }

});
