import { GraphService } from "./graph-service";
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RELATION_PATH, GraphNode } from 'src/app/models/vis.model';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('GraphService', () =>{
    let service: GraphService;
    let sparqlConnectionService: SPARQLConnectionService;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let nodeResUrl = testConfigData.nodeResource;  
    let schemaClassLabel = testConfigData.classFilterLabels[0]; 

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SPARQLConnectionService],
            imports: [
              HttpClientTestingModule
            ]
        });
        sparqlConnectionService = TestBed.get(SPARQLConnectionService);
        service = new GraphService();
        service.setDummyDataForTest(getIndexDbDummyData(), sparqlConnectionService);
        sparqlConnectionService.filterProcessService._nodes= getNodes();
        sparqlConnectionService.filterProcessService._edges= getEdges();
        sparqlConnectionService.filterProcessService._paths= getPaths();
        sparqlConnectionService.filterProcessService.connectivity = getConnectivity();
        sparqlConnectionService.filterProcessService.classData = getClass();
        sparqlConnectionService.selectedSources = getInputNodes();
        sparqlConnectionService.filterProcessService.consumedRelationPaths = getTransformedPaths();
        GraphService.setServices(sparqlConnectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#setServices should initialize sparqlConnectionService.', (done) => {
        spyOn(GraphService, "setServices").and.callThrough();
        GraphService.setServices(sparqlConnectionService);
        expect(GraphService.setServices).toHaveBeenCalled();
        done();
    });

    it('#getNodes should return the nodes aray object.', (done) => {
        spyOn(service, "getNodes").and.callThrough();
        let result = service.getNodes(['node1']) as any;
        expect(service.getNodes).toHaveBeenCalled();
        expect(result[0].label).toEqual('node1');
        done();
    });

    it('#getEdgesbyLabel should return the edge by its label.', (done) => {
        spyOn(service, "getEdgesbyLabel").and.callThrough();
        let result = service.getEdgesbyLabel('label1');
        expect(service.getEdgesbyLabel).toHaveBeenCalled();
        expect(result[0]).toBe(1);
        done();
    });

    it('#getConnectivityData should return the connectivity data for specific key.', (done) => {
        spyOn(service, "getConnectivityData").and.callThrough();
        let result = service.getConnectivityData(1);
        expect(service.getConnectivityData).toHaveBeenCalled();
        expect(result[0]).toEqual(nodeResUrl+'One_Day_International');
        done();
    });

    it('#getRelPaths will call the callback method with transformedpath as parameter.', (done) => {
        spyOn(service, "getRelPaths").and.callThrough();
        var callback = function(queryResults: RELATION_PATH[]){};
        service.getRelPaths(callback);
        expect(service.getRelPaths).toHaveBeenCalled();
        done();
    });

    it('#getRawNodes will should return the existing nodes array.', (done) => {
        spyOn(service, "getRawNodes").and.callThrough();
        let result = service.getRawNodes() as any;
        expect(service.getRawNodes).toHaveBeenCalled();
        expect(result.length).toBe(5);
        expect(result[0].label).toBe("Rohit Sharma");
        done();
    });

    it('#getRawEdges will should return the existing edges array.', (done) => {
        spyOn(service, "getRawEdges").and.callThrough();
        let result = service.getRawEdges() as any;
        expect(service.getRawEdges).toHaveBeenCalled();
        expect(result.length).toBe(5);
        expect(result[0].label).toBe("column");
        done();
    });

    it('#loadDataFromSPARQLParser will process the raw data.', (done) => {
        spyOn(GraphService, "loadDataFromSPARQLParser").and.callThrough();
        let serviceObj = GraphService.loadDataFromSPARQLParser(getRawData(),service);
        expect(GraphService.loadDataFromSPARQLParser).toHaveBeenCalled();
        expect(serviceObj).not.toBeUndefined();
        var callback = function(){};
        serviceObj._perfermLoadData(callback);
        done();
    });

    it('#_async should be called.', (done) => {
        spyOn(service, "_async").and.callThrough();
        var callback = function(timerId: number){};
        service._async(callback);
        expect(service._async).toHaveBeenCalled();
        done();
    });

    xit('#requestConnect should be called.', (done) => {
        spyOn(service, "requestConnect").and.callThrough();
        var callback = function(){};
        service.requestConnect(callback);
        expect(service.requestConnect).toHaveBeenCalled();
        done();
    });

    it('#requestSearch should be called.', (done) => {
        spyOn(service, "requestSearch").and.callThrough();
        var callback = function(nodes: GraphNode[]){};
        service.requestSearch(['node1'], 1, callback);
        expect(service.requestSearch).toHaveBeenCalled();
        done();
    });

    function getRawData() {
        return [
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|1|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/property/column|"+nodeResUrl+"One_Day_International",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|1|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/property/column|"+nodeResUrl+"One_Day_International",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|2|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/property/column|"+nodeResUrl+"First-class_cricket",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|2|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/property/column|"+nodeResUrl+"First-class_cricket",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|3|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/property/column|"+nodeResUrl+"List_A_cricket",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|3|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/property/column|"+nodeResUrl+"List_A_cricket",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|4|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/team2OdisMostRuns|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|4|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|5|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|5|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|6|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/playerOfOdiSeries|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|6|"+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|7|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|7|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|8|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/playerOfOdiSeries|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|8|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|9|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|9|"+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312|http://dbpedia.org/property/motm|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|10|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1Twenty20sMostRuns|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|10|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|11|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/playerOfTwenty20Series|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|11|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|12|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/motm|"+nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|12|"+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311|http://dbpedia.org/property/team1OdisMostRuns|"+nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|13|"+nodeResUrl+"Rohit_Sharma|http://dbpedia.org/ontology/country|"+nodeResUrl+"India",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|13|"+nodeResUrl+"Virat_Kohli|http://dbpedia.org/ontology/birthPlace|"+nodeResUrl+"Delhi",
            nodeResUrl+"Rohit_Sharma|"+nodeResUrl+"Virat_Kohli|13|"+nodeResUrl+"Delhi|http://dbpedia.org/ontology/country|"+nodeResUrl+"India"
          ];
    }

    function getIndexDbDummyData() {        
        let indexDB = {
            _mapId2Node: new Map<string, object>(),
            _mapId2Edge: new Map<string, object>(),
            _mapEdgeLabel2ID: new Map<string, number[]>(),
            _mapNodeId2NeighbourNodeIds: new Map<string, Set<string>>(),
            _mapNodePair2EdgeIds: new Map<string, Set<string>>(),
        };

        indexDB._mapNodePair2EdgeIds.set('node', new Set<string>());
        indexDB._mapNodeId2NeighbourNodeIds.set('1', new Set<string>());
        indexDB._mapEdgeLabel2ID.set('label1', [1,2])
        indexDB._mapId2Edge.set('1' , {label: 'label'});
        indexDB._mapId2Node.set('node1', {label: 'node1'});

        return indexDB;
    }

    function getNodes() {
        return [
            {
              "id": nodeResUrl+"Rohit_Sharma",
              "label": "Rohit Sharma",
              "value": 1,
              "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
            },
            {
              "id": nodeResUrl+"One_Day_International",
              "label": "One Day International",
              "value": 1,
              "title": "<b>One Day International</b>["+nodeResUrl+"One_Day_International]"
            },
            {
              "id": nodeResUrl+"Virat_Kohli",
              "label": "Virat Kohli",
              "value": 1,
              "title": "<b>Virat Kohli</b>["+nodeResUrl+"Virat_Kohli]"
            },
            {
              "id": nodeResUrl+"First-class_cricket",
              "label": "First-class cricket",
              "value": 1,
              "title": "<b>First-class cricket</b>["+nodeResUrl+"First-class_cricket]"
            },
            {
              "id": nodeResUrl+"List_A_cricket",
              "label": "List A cricket",
              "value": 1,
              "title": "<b>List A cricket</b>["+nodeResUrl+"List_A_cricket]"
            }
          ];
    }

    function getEdges() {
        return [
            {
              "id": 1,
              "from": nodeResUrl+"Rohit_Sharma",
              "to": nodeResUrl+"One_Day_International",
              "label": "column"
            },
            {
              "id": 2,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"One_Day_International",
              "label": "column"
            },
            {
              "id": 3,
              "from": nodeResUrl+"Rohit_Sharma",
              "to": nodeResUrl+"First-class_cricket",
              "label": "column"
            },
            {
              "id": 4,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"First-class_cricket",
              "label": "column"
            },
            {
              "id": 5,
              "from": nodeResUrl+"Rohit_Sharma",
              "to": nodeResUrl+"List_A_cricket",
              "label": "column"
            }
          ];
    }

    function getPaths() {
        return [
            {
              "nodes": [
                nodeResUrl+"Rohit_Sharma",
                nodeResUrl+"One_Day_International",
                nodeResUrl+"Virat_Kohli"
              ],
              "edges": [
                1,
                2
              ]
            },
            {
              "startNode": nodeResUrl+"Rohit_Sharma",
              "endNode": nodeResUrl+"Virat_Kohli",
              "nodes": [
                nodeResUrl+"Rohit_Sharma",
                nodeResUrl+"First-class_cricket",
                nodeResUrl+"Virat_Kohli"
              ],
              "edges": [
                3,
                4
              ]
            },
            {
              "startNode": nodeResUrl+"Rohit_Sharma",
              "endNode": nodeResUrl+"Virat_Kohli",
              "nodes": [
                nodeResUrl+"Rohit_Sharma",
                nodeResUrl+"List_A_cricket",
                nodeResUrl+"Virat_Kohli"
              ],
              "edges": [
                5,
                6
              ]
            },
            {
              "startNode": nodeResUrl+"Rohit_Sharma",
              "endNode": nodeResUrl+"Virat_Kohli",
              "nodes": [
                nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                nodeResUrl+"Rohit_Sharma",
                nodeResUrl+"Virat_Kohli"
              ],
              "edges": [
                7,
                8
              ]
            },
            {
              "startNode": nodeResUrl+"Rohit_Sharma",
              "endNode": nodeResUrl+"Virat_Kohli",
              "nodes": [
                nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                nodeResUrl+"Rohit_Sharma",
                nodeResUrl+"Virat_Kohli"
              ],
              "edges": [
                9,
                8
              ]
            }
          ];
    }

    function getConnectivity() {
        return [
            {
              "key": "1",
              "value": [
                nodeResUrl+"One_Day_International"
              ]
            },
            {
              "key": "2",
              "value": [
                nodeResUrl+"First-class_cricket",
                nodeResUrl+"List_A_cricket",
                nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
                nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
                nodeResUrl+"India",
                nodeResUrl+"Delhi"
              ]
            }
          ];
    }

    function getClass() {
        return [
            {
              "key": "db:Country",
              "value": [
                nodeResUrl+"India"
              ]
            },
            {
              "key": schemaClassLabel,
              "value": [
                nodeResUrl+"Delhi"
              ]
            }
          ];
    }

    function getInputNodes() {
        return [nodeResUrl+"Rohit_Sharma",nodeResUrl+"Virat_Kohli"];
    }

    function getTransformedPaths() {
        return [
            {
              "nodes": [
                {
                  "id": nodeResUrl+"Rohit_Sharma",
                  "label": "Rohit Sharma",
                  "value": 1,
                  "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
                },
                {
                  "id": nodeResUrl+"One_Day_International",
                  "label": "One Day International",
                  "value": 1,
                  "title": "<b>One Day International</b>["+nodeResUrl+"One_Day_International]"
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
                  "from": nodeResUrl+"Rohit_Sharma",
                  "to": nodeResUrl+"One_Day_International",
                  "label": "column"
                },
                {
                  "id": 2,
                  "from": nodeResUrl+"Virat_Kohli",
                  "to": nodeResUrl+"One_Day_International",
                  "label": "column"
                }
              ],
              "length": 1
            },
            {
              "nodes": [
                {
                  "id": nodeResUrl+"Rohit_Sharma",
                  "label": "Rohit Sharma",
                  "value": 1,
                  "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
                },
                {
                  "id": nodeResUrl+"First-class_cricket",
                  "label": "First-class cricket",
                  "value": 1,
                  "title": "<b>First-class cricket</b>["+nodeResUrl+"First-class_cricket]"
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
                  "id": 3,
                  "from": nodeResUrl+"Rohit_Sharma",
                  "to": nodeResUrl+"First-class_cricket",
                  "label": "column"
                },
                {
                  "id": 4,
                  "from": nodeResUrl+"Virat_Kohli",
                  "to": nodeResUrl+"First-class_cricket",
                  "label": "column"
                }
              ],
              "length": 1
            },
            {
              "nodes": [
                {
                  "id": nodeResUrl+"Rohit_Sharma",
                  "label": "Rohit Sharma",
                  "value": 1,
                  "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
                },
                {
                  "id": nodeResUrl+"List_A_cricket",
                  "label": "List A cricket",
                  "value": 1,
                  "title": "<b>List A cricket</b>["+nodeResUrl+"List_A_cricket]"
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
                  "id": 5,
                  "from": nodeResUrl+"Rohit_Sharma",
                  "to": nodeResUrl+"List_A_cricket",
                  "label": "column"
                },
                {
                  "id": 6,
                  "from": nodeResUrl+"Virat_Kohli",
                  "to": nodeResUrl+"List_A_cricket",
                  "label": "column"
                }
              ],
              "length": 1
            },
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
                  "id": 7,
                  "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                  "to": nodeResUrl+"Rohit_Sharma",
                  "label": "team2OdisMostRuns"
                },
                {
                  "id": 8,
                  "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                  "to": nodeResUrl+"Virat_Kohli",
                  "label": "motm"
                }
              ],
              "length": 1
            },
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
                  "id": 9,
                  "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                  "to": nodeResUrl+"Rohit_Sharma",
                  "label": "motm",
                  "smooth": {
                    "type": "curvedCW",
                    "roundness": -0.2
                  }
                },
                {
                  "id": 8,
                  "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
                  "to": nodeResUrl+"Virat_Kohli",
                  "label": "motm"
                }
              ],
              "length": 1
            }
          ]; 
    }
});