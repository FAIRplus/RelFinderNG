import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComponent } from './info.component';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTooltipModule } from '@angular/material';
import { SparqlPropertyService } from 'src/app/services/sparql/sparql-property.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;
  let sparqlConService: SPARQLConnectionService;
  let constantService: ConstantsService;
  let sparqlPropertyService: SparqlPropertyService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoComponent,TruncateStringPipe,FirstCaseUpperPipe ],
      imports:[ReactiveFormsModule, HttpClientTestingModule, MatTooltipModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sparqlConService = TestBed.get(SPARQLConnectionService);
    constantService = TestBed.get(ConstantsService);
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(InfoComponent);
    sparqlPropertyService = TestBed.get(SparqlPropertyService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sparqlPropertyService.sendMessage('Player', 'Sachin');
    constantService.localeResourceService = sparqlPropertyService;
    component.constanService = constantService;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#changeFilter should change the language', (done) => {
    spyOn(component, "changeFilter").and.callThrough();
    component.changeFilter({value: 'English'});
    expect(component.changeFilter).toHaveBeenCalled();
    done();
  });
  
  it('#shrinkInfo should truncate info text and store it to truncatedInfo', (done) => {
    spyOn(component, "shrinkInfo").and.callThrough();
    component.info = 'Relfinder is a great entity-relationship site to find relations between entities.';
    component.shrinkInfo();
    expect(component.shrinkInfo).toHaveBeenCalled();
    expect(component.truncatedInfo).toEqual('Relfinder is a...');
    done();
  });

  it('#shrinkInfo should call else block and assign info text to truncatedInfo', (done) => {
    spyOn(component, "shrinkInfo").and.callThrough();
    component.info = 'Relfinder';
    component.shrinkInfo();
    expect(component.shrinkInfo).toHaveBeenCalled();
    expect(component.truncatedInfo).toEqual('Relfinder');
    done();
  });

  it('#getFormSelectedData should set language value.', (done) => {
    spyOn(component, "getFormSelectedData").and.callThrough();
    constantService.localeResourceService.language = 'English';
    component.constanService = constantService;
    component.getFormSelectedData();
    expect(component.getFormSelectedData).toHaveBeenCalled();
    expect(component.language).toEqual('English');
    done();
  });

});
