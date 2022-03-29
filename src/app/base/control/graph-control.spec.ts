import { GraphControl } from "./graph-control";
import { ConstantsService } from "src/app/services/util/constants.service";
import { FilterProcessService } from "src/app/services/filters/filter-process.service";
import { SPARQLConnectionService } from "src/app/services/sparql/sparqlconnection.service";
import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RelFinder } from "../frame/relfinder";
import { GraphService } from "../service/graph-service";
import { Subject, BehaviorSubject } from 'rxjs';
import { EVENT_ARGS_FRAME, EVENT_ARGS_FRAME_INPUT, GraphNetwork, NETWORK_OPTIONS, FrameEventName } from 'src/app/models/vis.model';
import { MainFrame } from '../frame/base-frame';
import { SparqlPropertyService } from 'src/app/services/sparql/sparql-property.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('GraphControl', () => {
    let service: GraphControl;
    let constantService: ConstantsService;
    let filterProcessService: FilterProcessService;
    let sparqlPropService: SparqlPropertyService;
    let graphLoadStatus = new Subject<string>();
    let sparqlconnection : SPARQLConnectionService;
    let dataUpdateSubject = new BehaviorSubject<any>('');
    let intervalSubject = new BehaviorSubject<number>(500);
    let httpMock: HttpTestingController;
    let frame: MainFrame;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConstantsService,FilterProcessService,SPARQLConnectionService,GraphControl],
            imports: [
                HttpClientTestingModule
              ]
        });
        httpMock = TestBed.get(HttpTestingController);
        constantService = TestBed.get(ConstantsService);
        sparqlconnection = TestBed.get(SPARQLConnectionService);   
        filterProcessService = TestBed.get(FilterProcessService);  
        sparqlPropService = TestBed.get(SparqlPropertyService);
        service = new GraphControl(); //TestBed.get(GraphControl); 
        let container = document.createElement('div');
        container.setAttribute('id', 'loadGraph');
        frame = new RelFinder(container);
        frame._graphService = new GraphService(); 
        frame.setSelectedSources(getInputNodes());
        filterProcessService.consumedRelationPaths = getConsumedPath(); 
        service.filterProcessService=filterProcessService;
        sparqlconnection.filterProcessService = filterProcessService;
        GraphService.setServices(sparqlconnection); 
        service.setCommonObj(frame, constantService);
        constantService.localeResourceService = sparqlPropService;
        GraphService.setServices(sparqlconnection);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', (done) => {
        expect(service).toBeTruthy();
        done();
    });

    it('getCollectedPaths for method for intervals', (done) => {
        spyOn(service, "getCollectedPaths").and.callThrough();
        service.setPaths(getCollectedPath(), getConsumedPath());
        service.getCollectedPaths(sparqlconnection.graphLoadStatus,constantService);
        expect(service.getCollectedPaths).toHaveBeenCalled();
        done();
    });

    it('onclickoutsideLanguage for method for intervals', (done) => {
        spyOn(service, "onclickoutsideLanguage").and.callThrough();
        service.setLanguageSubjectForTest('English');
        service.onclickoutsideLanguage();
        expect(service.onclickoutsideLanguage).toHaveBeenCalled();
        done();
    });

    it('#filtersSubscriptionAndTriggerEvent should set visible node and edges', (done) => {
        service.filterProcessService.setVisibleNodesEdgesSubject(getVisibleNodes(), getVisibleEdgeIds());
        service.callMethodsForTesting();
        expect(service.filterProcessService.getVisibleNodesEdgesSubject()).not.toBeUndefined();
        done();
    });

    it('#stopEmptyNodeIntervals should clear the interval', (done) => {
        spyOn(service, 'stopEmptyNodeIntervals').and.callThrough();
        service.timerObj = [88,118,122];
        service.stopEmptyNodeIntervals();
        expect(service.stopEmptyNodeIntervals).toHaveBeenCalled();
        done();
    });

    it('#stopQuery should clear the window interval', (done) => {
      spyOn(service, 'stopQuery').and.callThrough();
      service.timerObj = [88,118,122];
      service.stopQuery();
      expect(service.stopQuery).toHaveBeenCalled();
      done();
    });

    it('#startQuery should be called', (done) => {
      spyOn(service, 'startQuery').and.callThrough();
      service.setPaths(getCollectedPath(), getConsumedPath());
      service.timerObj = [88,118,122];
      let languageSubject = new BehaviorSubject<any>('');
      languageSubject.next({lang: 'English'});
      let intervalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(50);
      let dataSubject = new BehaviorSubject<any>(true);
      service.startQuery(getVisibleNodes(), 100, sparqlconnection.graphLoadStatus, constantService, 
                          languageSubject, filterProcessService, intervalSubject, dataSubject);
      expect(service.startQuery).toHaveBeenCalled();
      done();
    });

    it('#onDestroy should be called', (done) => {
      spyOn(service, 'onDestroy').and.callThrough();
      service.onDestroy(undefined);
      expect(service.onDestroy).toHaveBeenCalled();
      done();
    });

    it('#onCreate should be called', (done) => {
        let nodeResUrl = testConfigData.nodeResource;
        spyOn(service, 'onCreate').and.callThrough();
        let divElem = document.createElement("div"); 
        let network = new GraphNetwork(divElem, frame._screenData, getNetworkOptions());
        let args: EVENT_ARGS_FRAME_INPUT = {mainFrame: frame, network: network, theme: undefined, htmlMainFrame: divElem, nodes : [nodeResUrl+"Delhi"], edges: []};
        service.onCreate(args);
        expect(service.onCreate).toHaveBeenCalled();
        done();
    });
    
    function getVisibleNodes(): string[] {
      let nodeResUrl = testConfigData.nodeResource;
        return [
            nodeResUrl+ "Rohit_Sharma",
            nodeResUrl+ "Virat_Kohli",
            nodeResUrl+ "Indian_cricket_team_in_West_Indies_in_2011",
            nodeResUrl+ "West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
            nodeResUrl+ "Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
            nodeResUrl+ "One_Day_International",
            nodeResUrl+ "First-class_cricket",
            nodeResUrl+ "List_A_cricket",
            nodeResUrl+ "India",
            nodeResUrl+ "Delhi"
          ];
    }

    function getVisibleEdgeIds(): string[] {
        return ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'];
    }

    function getInputNodes() {      
      let nodeResUrl = testConfigData.nodeResource;
      return [nodeResUrl+ "Rohit_Sharma",nodeResUrl+ "Virat_Kohli"];
    }

    function getNetworkOptions(): NETWORK_OPTIONS {
        return {
            layout: {
                improvedLayout: false
            },
            physics: {
                stabilization: false,
                solver: 'forceAtlas2Based',
                barnesHut: {
                    gravitationalConstant: -80000,
                    springConstant: 0.001,
                    springLength: 200
                },
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.18
                },
            },
            interaction: {
                tooltipDelay: 10,
                hover: true,
                hideEdgesOnDrag: true,
                selectable: true,
                navigationButtons: true,
                selectConnectedEdges: false
            }
        };
    }

    function getCollectedPath() {      
      let nodeResUrl = testConfigData.nodeResource;
      return [
        {
          "nodes": [
            {
              "id": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
              "label": "Indian cricket team in West Indies in 2011",
              "value": 1,
              "title": "<b>Indian cricket team in West Indies in 2011</b>["+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011]"
            },
            {
              "id": nodeResUrl+"Rohit_Sharma",
              "label": "Rohit Sharma",
              "value": 1,
              "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
            },
            {
              "id": nodeResUrl+"Virat_Kohli",
              "label": "Virat Kohli",
              "value": 1,
              "title": "<b>Virat Kohli</b>["+nodeResUrl+"Virat_Kohli]"
            }
          ],
          "edges": [
            {
              "id": 10,
              "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "playerOfOdiSeries",
              "smooth": {
                "type": "curvedCW",
                "roundness": 0.2
              },
              "title": "<b>Indian cricket team in West Indies in 2011 --> playerOfOdiSeries --> Rohit Sharma<b>"
            },
            {
              "id": 8,
              "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm",
              "title": "<b>Indian cricket team in West Indies in 2011 --> motm --> Virat Kohli<b>"
            }
          ],
          "length": 1
        }
      ]
    }

    function getConsumedPath() {
      let nodeResUrl = testConfigData.nodeResource;
      return [
        {
          "nodes": [
            {
              "id": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
              "label": "Indian cricket team in West Indies in 2011",
              "value": 1,
              "title": "<b>Indian cricket team in West Indies in 2011</b>["+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011]"
            },
            {
              "id": nodeResUrl+"Rohit_Sharma",
              "label": "Rohit Sharma",
              "value": 1,
              "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
            },
            {
              "id": nodeResUrl+"Virat_Kohli",
              "label": "Virat Kohli",
              "value": 1,
              "title": "<b>Virat Kohli</b>["+nodeResUrl+"Virat_Kohli]"
            }
          ],
          "edges": [
            {
              "id": 1,
              "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "team2OdisMostRuns",
              "title": "<b>Indian cricket team in West Indies in 2011 --> team2OdisMostRuns --> Rohit Sharma<b>"
            },
            {
              "id": 2,
              "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm",
              "title": "<b>Indian cricket team in West Indies in 2011 --> motm --> Virat Kohli<b>"
            }
          ],
          "length": 1
        }
      ];
    }

    
    function getScreenData() {
      return {
          "nodes": {
            "_subscribers": {
              "*": [
                
              ],
              "add": [
                null
              ],
              "remove": [
                null
              ],
              "update": [
                null
              ]
            },
            "_options": {
              
            },
            "_data": {
              
            },
            "length": 10,
            "_idProp": "id",
            "_type": {
              
            }
          },
          "edges": {
            "_subscribers": {
              "*": [
                
              ],
              "add": [
                null
              ],
              "remove": [
                null
              ],
              "update": [
                null
              ]
            },
            "_options": {
              
            },
            "_data": {
              
            },
            "length": 21,
            "_idProp": "id",
            "_type": {
              
            }
          }
        };
    }

});