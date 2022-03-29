import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelComponent } from './left-panel.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxBootstrapModule } from 'src/shared/ngx-bootstrap.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ShareUrlComponent } from './share-url/share-url.component';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';
import { TruncateStringPipe } from 'src/app/pipes/truncate-string.pipe';
import { FirstCaseUpperPipe } from 'src/app/pipes/first-case-upper.pipe';
import { MatTooltipModule } from '@angular/material';

describe('LeftPanelComponent', () => {
  let component: LeftPanelComponent;
  let fixture: ComponentFixture<LeftPanelComponent>;
  let autocompService: AutoCompleteService;
  let sparqlConnectionService: SPARQLConnectionService;
  let constantService: ConstantsService;
  let clearConfirmationDialogService: ClearConfirmationDialogService;
  let httpMock: HttpTestingController;
  let configService: ConfigurationsService;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();

  const dialogMock = {
    updateSize: () => { },
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelComponent, ShareUrlComponent, FirstCaseUpperPipe, TruncateStringPipe ],
      imports: [HttpClientTestingModule, MatDialogModule, NgxBootstrapModule, MatTooltipModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ShareUrlComponent] } })
    .compileComponents();
  }));

  beforeEach(() => {
    autocompService = TestBed.get(AutoCompleteService);
    sparqlConnectionService = TestBed.get(SPARQLConnectionService);
    constantService = TestBed.get(ConstantsService);
    configService = TestBed.get(ConfigurationsService);
    configService.setConfigData();
    configService.setActiveEndpoint('dbp');
    clearConfirmationDialogService = TestBed.get(ClearConfirmationDialogService);
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(LeftPanelComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    configService.toggleLeftMenu.next({ type: 'search', visible: false });
    configService.disableInfoMenu.next(true);
    autocompService.setPublishAutoCompData(getAutoCompData());
    component.configurationsService = configService;
    component.autocompService = autocompService;
  });

  afterEach(() => {
    component = null;
    autocompService = null;
    sparqlConnectionService = null;
    constantService = null;
    clearConfirmationDialogService = null;
    httpMock = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateToggleValue will update element #menu', (done) => {
    component.menu.set('search', false);
    component.menu.set('info', false);
    component.menu.set('link', false);
    component.menu.set('filter', false);
    component.menu.set('config', false);
    spyOn(component, "updateToggleValue").and.callThrough();
    component.updateToggleValue('filter', true);
    expect(component.updateToggleValue).toHaveBeenCalled();
    expect(component.menu.get('filter')).toEqual(true);
    done();
  });
  
  it('#onUrlClick will open dialog', (done) => {
    spyOn(component, "onUrlClick").and.callThrough();
    component.onUrlClick();
    expect(component.onUrlClick).toHaveBeenCalled();
    component.dialog.closeAll();
    fixture.detectChanges();
    done();
  });

  it('#ngOnInit should be called', (done) => {
    spyOn(component, "ngOnInit").and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    component.dialog.closeAll();
    fixture.detectChanges();
    done();
  });

  function getAutoCompData() {
    return [
      {
        "sub": {
          "type": "uri",
          "value": "http://dbpedia.org/resource/Rohit_Sharma"
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
          "value": "http://dbpedia.org/resource/Virat_Kohli"
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
