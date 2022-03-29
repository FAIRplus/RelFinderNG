import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ConfigurationsService } from './services/configurations/configurations.service';
import { ConstantsService } from './services/util/constants.service';
import { AutoCompleteService } from './services/autocomplete.service';
import { SparqlPropertyService } from './services/sparql/sparql-property.service';
import { TestConfUtil } from './test/test-conf.util';
import { TestConfigModel } from './test/test-config.model';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let configService: ConfigurationsService;
  let constantsService: ConstantsService;
  let autoCompleteService: AutoCompleteService;
  let propertyService:SparqlPropertyService;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],

    }).compileComponents();
    
    configService = TestBed.get(ConfigurationsService);
    constantsService = TestBed.get(ConstantsService);
    autoCompleteService = TestBed.get(AutoCompleteService);
    propertyService = TestBed.get(SparqlPropertyService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    component.ConfigService = configService;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('#getParamValueQueryString should call the if block.', (done) => {
    spyOn(component, "getParamValueQueryString").and.callThrough();
    spyOn(configService, "setConfigData").and.callThrough();
    component.getParamValueQueryString(getUrl());
    expect(component.getParamValueQueryString).toHaveBeenCalled();
    expect(component.endoint).toEqual(getEndpoint());
    done();
  });

  it('#getParamValueQueryString should call the setConfigData method only in else block for no url.', (done) => {
    spyOn(component, "getParamValueQueryString").and.callThrough();
    spyOn(configService, "setConfigData").and.callThrough();
    let url = window.location.href;
    component.getParamValueQueryString(url);
    expect(component.getParamValueQueryString).toHaveBeenCalled();
    expect(configService.setConfigData).toHaveBeenCalled();
    done();
  });

  xit(`should have as title 'TopPanel component'`, () => {
    const compiled = fixture.debugElement.nativeElement;
    let el: DebugElement;
    el = fixture.debugElement;
    const boldText = el.query(By.css('div')).nativeElement;
    expect(boldText.textContent).toContain('a new nation');

    expect(compiled.querySelector('.content p')).toContain('RelFinder app is running!');
  });

  xit('should render title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content p').textContent).toContain('RelFinder app is running!');
  });

  function getUrl() {
    let domainUrl = window.location.href;
    return domainUrl+'?prm=W3sic3ViIjp7InR5cGUiOiJ1cmkiLCJ2YWx1ZSI6Imh0dHA6Ly9kYnBlZGlhLm9yZy9yZXNvdXJjZS9Sb2hpdF9TaGFybWEifSwibWlkZGxlIjp7InR5cGUiOiJsaXRlcmFsIiwieG1sOmxhbmciOiJlbiIsInZhbHVlIjoiUm9oaXQgU2hhcm1hIn0sImNvdW50Ijp7InR5cGUiOiJ0eXBlZC1saXRlcmFsIiwiZGF0YXR5cGUiOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSNpbnRlZ2VyIiwidmFsdWUiOiIxMDUifX0seyJzdWIiOnsidHlwZSI6InVyaSIsInZhbHVlIjoiaHR0cDovL2RicGVkaWEub3JnL3Jlc291cmNlL1ZpcmF0X0tvaGxpIn0sIm1pZGRsZSI6eyJ0eXBlIjoibGl0ZXJhbCIsInhtbDpsYW5nIjoiZW4iLCJ2YWx1ZSI6IlZpcmF0IEtvaGxpIn0sImNvdW50Ijp7InR5cGUiOiJ0eXBlZC1saXRlcmFsIiwiZGF0YXR5cGUiOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSNpbnRlZ2VyIiwidmFsdWUiOiIxNjUifX1d&endpoint=eyJhY3RpdmUiOnRydWUsIm5hbWUiOiJEQnBlZGlhIChtaXJyb3IpIiwiaWQiOiJkYnAiLCJkZXNjcmlwdGlvbiI6IkxpbmtlZCBEYXRhIHZlcnNpb24gb2YgV2lraXBlZGlhLiIsImVuZHBvaW50VVJJIjoiaHR0cHM6Ly9kYnBlZGlhLmludGVyYWN0aXZlc3lzdGVtcy5pbmZvIiwiZG9udEFwcGVuZFNwYXJxbCI6ZmFsc2UsImRlZmF1bHRHcmFwaFVSSSI6Imh0dHA6Ly9kYnBlZGlhLm9yZyIsImlzVmlydHVvc28iOnRydWUsInVzZVByb3h5Ijp0cnVlLCJtZXRob2QiOiJQT1NUIiwiYXV0b2NvbXBsZXRlVVJJcyI6WyJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwiXSwiYXV0b2NvbXBsZXRlTGFuZ3VhZ2UiOiJlbiIsImlnbm9yZWRQcm9wZXJ0aWVzIjpbImh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyN0eXBlIiwiaHR0cDovL3d3dy53My5vcmcvMjAwNC8wMi9za29zL2NvcmUjc3ViamVjdCIsImh0dHA6Ly9kYnBlZGlhLm9yZy9wcm9wZXJ0eS93aWtpUGFnZVVzZXNUZW1wbGF0ZSIsImh0dHA6Ly9kYnBlZGlhLm9yZy9wcm9wZXJ0eS93b3JkbmV0X3R5cGUiLCJodHRwOi8vZGJwZWRpYS5vcmcvcHJvcGVydHkvd2lraWxpbmsiLCJodHRwOi8vZGJwZWRpYS5vcmcvb250b2xvZ3kvd2lraVBhZ2VXaWtpTGluayIsImh0dHA6Ly93d3cudzMub3JnLzIwMDIvMDcvb3dsI3NhbWVBcyIsImh0dHA6Ly9wdXJsLm9yZy9kYy90ZXJtcy9zdWJqZWN0Il0sImFic3RyYWN0VVJJcyI6WyJodHRwOi8vZGJwZWRpYS5vcmcvb250b2xvZ3kvYWJzdHJhY3QiXSwiaW1hZ2VVUklzIjpbImh0dHA6Ly9kYnBlZGlhLm9yZy9vbnRvbG9neS90aHVtYm5haWwiLCJodHRwOi8veG1sbnMuY29tL2ZvYWYvMC4xL2RlcGljdGlvbiJdLCJsaW5rVVJJcyI6WyJodHRwOi8vcHVybC5vcmcvb250b2xvZ3kvbW8vd2lraXBlZGlhIiwiaHR0cDovL3htbG5zLmNvbS9mb2FmLzAuMS9ob21lcGFnZSIsImh0dHA6Ly94bWxucy5jb20vZm9hZi8wLjEvcGFnZSJdLCJtYXhSZWxhdGlvbkxlbmd0aCI6IjIifQ==';
  }

  function getEndpoint() {
    return {"active":true,"name":"DBpedia (mirror)","id":"dbp","description":"Linked Data version of Wikipedia.","endpointURI":"https://dbpedia.interactivesystems.info","dontAppendSparql":false,"defaultGraphURI":"http://dbpedia.org","isVirtuoso":true,"useProxy":true,"method":"POST","autocompleteURIs":["http://www.w3.org/2000/01/rdf-schema#label"],"autocompleteLanguage":"en","ignoredProperties":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2004/02/skos/core#subject","http://dbpedia.org/property/wikiPageUsesTemplate","http://dbpedia.org/property/wordnet_type","http://dbpedia.org/property/wikilink","http://dbpedia.org/ontology/wikiPageWikiLink","http://www.w3.org/2002/07/owl#sameAs","http://purl.org/dc/terms/subject"],"abstractURIs":["http://dbpedia.org/ontology/abstract"],"imageURIs":["http://dbpedia.org/ontology/thumbnail","http://xmlns.com/foaf/0.1/depiction"],"linkURIs":["http://purl.org/ontology/mo/wikipedia","http://xmlns.com/foaf/0.1/homepage","http://xmlns.com/foaf/0.1/page"],"maxRelationLength":"2"};
  }
});
