import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';

import { ConfigFormComponent } from './config-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { NgxBootstrapModule } from 'src/shared/ngx-bootstrap.module';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormInputDialogComponent } from '../form-input-dialog/form-input-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmDialogComponent } from '../../../default/confirm-dialog/confirm-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { SnackbarComponent } from 'src/app/components/default/snackbar/snackbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTooltipModule, MatSelectModule } from '@angular/material';

describe('ConfigFormComponent', () => {
  let component: ConfigFormComponent;
  let fixture: ComponentFixture<ConfigFormComponent>;
  let configService: ConfigurationsService;
  let overlayContainerElement: HTMLElement;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;  
  let resourceId = testConfigData.id;

  let data = {
    data: {}
  }
  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigFormComponent, FormInputDialogComponent, ConfirmDialogComponent, FirstCaseUpperPipe, TruncateStringPipe, SnackbarComponent ],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        NgxBootstrapModule,
        HttpClientTestingModule,
        MatTooltipModule,
        MatChipsModule,  
        MatSelectModule    
      ],
      providers: [
        { 
          provide: MatDialogRef,
          useValue: dialogMock
        }, 
        { 
          provide: MAT_DIALOG_DATA, 
          useValue: data
        }, 
        { 
          provide: MatDialogTitle, 
          useValue: {}
        },
        {
          provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
          }
        }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [FormInputDialogComponent, ConfirmDialogComponent, SnackbarComponent ] } })
    .compileComponents();
    fixture = TestBed.createComponent(ConfigFormComponent);
    configService = TestBed.get(ConfigurationsService);
    configService.setConfigData();

    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#isEditMode should return false.' , (done)=> {
    let isEditMode = component.isEditMode("");
    expect(isEditMode).toBeFalsy();
    done();
  });

  it('#isEditMode should return true.' , (done)=> {
    let isEditMode = component.isEditMode(resourceId);
    expect(isEditMode).toBeTruthy();
    done();
  });

  it('#checkDuplicate should check the duplicate id and should return true for id '+resourceId+'.' , (done)=> {
    component.checkDuplicate(resourceId);
    expect(component.f.id.errors.duplicate).toBeTruthy();
    done();
  });

  it('#checkDuplicate errors should be null for id "linkedData".' , (done)=> {
    component.checkDuplicate('linkedData');
    expect(component.f.id.errors).toBeNull();
    done();
  });  

  it('#closeMe should close the dialog.', () => {
    spyOn(component.dialogRef, "close").and.callThrough();
    component.closeMe();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#onSubmit should call onSubmit method and form data should be invalid.', fakeAsync(() => {
    // To properly set up the form
    fixture.detectChanges();
    // Tick needs to be called in order for form controls to be registered properly.
    tick();    
    component.onSubmit();  
    expect(component.sourceForm.invalid).toEqual(true);
  }));

  it('#onSubmit, form should be invalid.', fakeAsync(() => {
    component.f.id.setValue('');
    component.f.name.setValue('');
    component.f.endpointURI.setValue('');    
    component.f.maxRelationLength.setValue('15');
    expect(component.sourceForm.invalid).toEqual(true);
  }));

  it('#onSubmit, form should be valid.', fakeAsync(() => {
    component.f.id.setValue('test');
    component.f.name.setValue('test');
    component.f.endpointURI.setValue('test');    
    component.f.maxRelationLength.setValue('4');
    expect(component.sourceForm.valid).toEqual(true);
  }));

  it('#setUrisInFormData should have been called.', (done) => {
    spyOn(component, "setUrisInFormData");
    component.setUrisInFormData();
    expect(component.setUrisInFormData).toHaveBeenCalled();
    done();
  });

  it('#setUrisInFormData should have been called.', (done) => {
    let data = component.setUrisInFormData();
    expect(data).not.toBeNull();
    done();
  });

  it('#onDismiss will close the dialog.', (done) => {
    spyOn(component, "onDismiss").and.callThrough();
    component.onDismiss();
    expect(component.onDismiss).toHaveBeenCalled();
    component.dialog.closeAll();
    fixture.detectChanges();
    done();
  });

  it('#addAutoUri should add uri in autocomplete uris', (done) => {
    component.autocompleteUris = ['test1', 'test2'];
    spyOn(component, "addAutoUri").and.callThrough();
    let obj = { input: null, value: 'test' };
    component.addAutoUri(obj);
    expect(component.addAutoUri).toHaveBeenCalled();
    expect(component.autocompleteUris.length).toBe(3);
    done();
  });

  it('#removeAutoUri should remove uri from autocomplete uris', (done) => {
    component.autocompleteUris = ['test1', 'test2'];
    spyOn(component, "removeAutoUri").and.callThrough();
    component.removeAutoUri('test1');
    expect(component.removeAutoUri).toHaveBeenCalled();
    expect(component.autocompleteUris.length).toBe(1);
    done();
  });

  it('#addProp should add uri in ignoredProperties', (done) => {
    component.ignoredProperties = ['test1', 'test2'];
    spyOn(component, "addProp").and.callThrough();
    let obj = { input: null, value: 'test' };
    component.addProp(obj);
    expect(component.addProp).toHaveBeenCalled();
    expect(component.ignoredProperties.length).toBe(3);
    done();
  });

  it('#removeProp should remove uri from ignoredProperties', (done) => {
    component.ignoredProperties = ['test1', 'test2'];
    spyOn(component, "removeProp").and.callThrough();
    component.removeProp('test1');
    expect(component.removeProp).toHaveBeenCalled();
    expect(component.ignoredProperties.length).toBe(1);
    done();
  });

  it('#addAbsURI should add uri in abstractUris', (done) => {
    component.abstractUris = ['test1', 'test2'];
    spyOn(component, "addAbsURI").and.callThrough();
    let obj = { input: null, value: 'test' };
    component.addAbsURI(obj);
    expect(component.addAbsURI).toHaveBeenCalled();
    expect(component.abstractUris.length).toBe(3);
    done();
  });

  it('#removeAbsURI should remove uri from abstractUris', (done) => {
    component.abstractUris = ['test1', 'test2'];
    spyOn(component, "removeAbsURI").and.callThrough();
    component.removeAbsURI('test1');
    expect(component.removeAbsURI).toHaveBeenCalled();
    expect(component.abstractUris.length).toBe(1);
    done();
  });

  it('#addImguri should add uri in imageUris', (done) => {
    spyOn(component, "addImguri").and.callThrough();
    component.imageUris = ['test1', 'test2'];
    let obj = { input: null, value: 'test' };
    component.addImguri(obj);
    expect(component.addImguri).toHaveBeenCalled();
    expect(component.imageUris.length).toBe(3);
    done();
  });

  it('#removeImguri should remove uri from imageUris', (done) => {
    component.imageUris = ['test1', 'test2'];
    spyOn(component, "removeImguri").and.callThrough();
    component.removeImguri('test1');
    expect(component.removeImguri).toHaveBeenCalled();
    expect(component.imageUris.length).toBe(1);
    done();
  });

  it('#addLinkuri should add uri in linkUris', (done) => {
    component.linkUris = ['test1', 'test2'];
    spyOn(component, "addLinkuri").and.callThrough();
    let obj = { input: null, value: 'test' };
    component.addLinkuri(obj);
    expect(component.addLinkuri).toHaveBeenCalled();
    expect(component.linkUris.length).toBe(3);
    done();
  });

  it('#removeLinkuri should remove uri from linkUris', (done) => {
    component.linkUris = ['test1', 'test2'];
    spyOn(component, "removeLinkuri").and.callThrough();
    component.removeLinkuri('test1');
    expect(component.removeLinkuri).toHaveBeenCalled();
    expect(component.linkUris.length).toBe(1);
    done();
  });

});