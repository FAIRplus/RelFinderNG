import { Subscription, Subject } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchComponent } from './search.component';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { NgxBootstrapModule } from 'src/shared/ngx-bootstrap.module';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmDialogComponent } from '../../default/confirm-dialog/confirm-dialog.component';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { NgSlimScrollModule } from 'ngx-slimscroll';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let httpMock: HttpTestingController;
  let autoCompleteService: AutoCompleteService;
  let sparqlConnService: SPARQLConnectionService;
  let configService: ConfigurationsService;
  let showSearchPopup = new Subject<boolean>();
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        NgxBootstrapModule,
        MatDialogModule,
        NgSlimScrollModule
      ],
      declarations: [
        SearchComponent,ConfirmDialogComponent
      ],
      providers: [
        ConfigurationsService,
        {
          provide: MatDialogRef,
          useValue: dialogMock
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },

      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogComponent] } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    autoCompleteService = TestBed.get(AutoCompleteService);
    sparqlConnService = TestBed.get(SPARQLConnectionService);
    configService = TestBed.get(ConfigurationsService);
    configService.setConfigData();
    httpMock = TestBed.get(HttpTestingController);

    let formData = [{"sub":{"type":"uri","value":nodeResUrl+"Rohit_Sharma"},"middle":{"type":"literal","xml:lang":"en","value":"Rohit Sharma"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"105"}},{"sub":{"type":"uri","value":nodeResUrl+"Virat_Kohli"},"middle":{"type":"literal","xml:lang":"en","value":"Virat Kohli"},"count":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"165"}}];
    autoCompleteService.setAutoCompFormData(formData);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component = null;
    autoCompleteService = null;
    sparqlConnService = null;
    configService = null;
    httpMock = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Form should contain items.', () => {
    expect(component.searchForm.contains('items')).toBeTruthy();
  });

  it('items should contain two controls when page load.', () => {
    expect(component.items.length).toBe(2);
  });

  it('#searchKeyword should be required.', () => {
    let gp = component.items.controls[0] as FormGroup;
    let key1Control = gp.controls.searchKeyword;
    key1Control.setValue('');
    expect(key1Control.valid).toBeFalsy();
  });

  it('#searchKeyword value should be selected from autocomplete.', () => {
    let gp = component.items.controls[0] as FormGroup;
    let key1Control = gp.controls.searchKeyword;
    key1Control.setValue('Rohit Sharma');
    expect(key1Control.valid).toBeFalsy();
  });

  it('#addItem should add new control to search form', () => {
    component.addItem();
    expect(component.items.length).toEqual(3);
  })

  it('#removeItem should remove the control from specific index', () => {
    component.addItem(); // adding one control to make count greater than 2.
    component.removeItem(2);
    expect(component.items.length).toEqual(2);
  });

  it('#removeItem should not remove any control from specific index because items has only two controls.', () => {
    component.removeItem(1);
    expect(component.items.length).toEqual(2);
  });

  // it('#tab method should be called', () => {
  //   spyOn(component, "tab").and.callThrough();
  //   component.tab(event);
  //   expect(component.tab).toHaveBeenCalled();
  // });

  // it('#clickout method should be called', () => {
  //   spyOn(component, "clickout").and.callThrough();
  //   component.clickout(event);
  //   expect(component.clickout).toHaveBeenCalled();
  // });

  it('#onSubmit should be called and execute if block.', async(done) => {
    spyOn(component, "onSubmit").and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
    showSearchPopup.subscribe(val => {
      expect(val).toBeFalsy();
    });
    component.dialog.closeAll();
    fixture.detectChanges();
    done();
  }, 5000);

  xit('#onSubmit should be called and execute else block.', (done) => {
    spyOn(component, "onSubmit").and.callThrough();
    configService.isOverrideSearch = false;
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
    component.dialog.closeAll();
    fixture.detectChanges();
    done();
  });

  it('#reset should be called and execute if block.', (done) => {
    spyOn(component, "reset").and.callThrough();
    autoCompleteService.isOkClicked.next(true);
    component.reset();
    expect(component.reset).toHaveBeenCalled();
    done();
  });

  it('#reset should be called and execute else block.', (done) => {
    spyOn(component, "reset").and.callThrough();
    configService.isOverrideSearch = false;
    component.reset();
    expect(component.reset).toHaveBeenCalled();
    expect(component.searchForm.status).toEqual("INVALID");
    done();
  });

  it('#onFocusout should be called and update some values.', (done) => {
    spyOn(component, "focusFunc").and.callThrough();
    configService.isOverrideSearch = false;
    component.focusFunc({target: {value: false}}, 1);
    expect(component.focusFunc).toHaveBeenCalled();
    expect(autoCompleteService.currentIndex).toBe(1);
    done();
  });

  it('#onFocusout should be called.', (done) => {
    spyOn(component, "onFocusout").and.callThrough();
    component.onFocusout(1);
    expect(component.onFocusout).toHaveBeenCalled();
    done();
  });

  it('#onChage should be called.', (done) => {
    spyOn(component, "onChage").and.callThrough();
    component.onChage();
    expect(component.onChage).toHaveBeenCalled();
    done();
  });

});
