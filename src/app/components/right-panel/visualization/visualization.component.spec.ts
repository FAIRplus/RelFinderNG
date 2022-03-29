import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationComponent } from './visualization.component';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TopPanelComponent } from '../../top-panel/top-panel.component';
import { MatTooltipModule } from '@angular/material';
import { FilterIconSelection } from 'src/app/pipes/filter-icon-selection.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';

describe('VisualizationComponent', () => {
  let component: VisualizationComponent;
  let fixture: ComponentFixture<VisualizationComponent>;
  let sparqlConnService: SPARQLConnectionService;
  let constantsService : ConstantsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationComponent, TopPanelComponent, FilterIconSelection,TruncateStringPipe,FirstCaseUpperPipe],
      imports : [BrowserAnimationsModule, HttpClientTestingModule, CollapseModule, MatTooltipModule, FormsModule,ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationComponent);
    sparqlConnService = TestBed.get(SPARQLConnectionService);
    constantsService = TestBed.get(ConstantsService);

    component = fixture.componentInstance;
    fixture.detectChanges();
    sparqlConnService.emptyNodesObjectSubject.next("There is no relationship between given inputs.Please try different inputs....!");
    sparqlConnService.graphLoadStatus.next('VisualizationFinished');
    component.sparqlConnectionService = sparqlConnService
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
