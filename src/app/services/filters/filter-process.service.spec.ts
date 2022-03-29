import { FilterProcessService } from "./filter-process.service";
import { TestBed } from '@angular/core/testing';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('FilterProcessService', () => {
    let service: FilterProcessService;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let classFilterLabels = testConfigData.classFilterLabels;
    let nodeResUrl = testConfigData.nodeResource;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FilterProcessService]
        });
        service = TestBed.get(FilterProcessService);

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#clearAllFilters should clear all data related to filters', (done) => {
        spyOn(service, 'clearAllFilters').and.callThrough();
        service.filterObj = getFilterObj();
        expect(service.filterObj.size).toEqual(2);
        service.clearAllFilters();
        expect(service.clearAllFilters).toHaveBeenCalled();
        expect(service.filterObj.size).toEqual(0);
        done();
    });

    it('#setGlobalVariables should set the path data initially.', (done) => {
        spyOn(service, 'setGlobalVariables').and.callThrough();
        setGlobalVariables();
        expect(service.setGlobalVariables).toHaveBeenCalled();
        expect(service.consumedRelationPaths.length).toEqual(13);
        expect(service.consumedRelationPaths[0].nodes.length).toEqual(3);
        expect(service.consumedRelationPaths[0].edges.length).toEqual(2);
        done();
    });

    it('#setGlobalData should set the filter data initially.', (done) => {
      spyOn(service, 'setGlobalData').and.callThrough();
      setGlobalData();
      expect(service.setGlobalData).toHaveBeenCalled();
      expect(service._nodes.length).toEqual(12);
      expect(service._edges.length).toEqual(21);
      expect(service._paths.length).toEqual(13);
      done();
  });

    it('#fetchFilterData should fetch global data and apply filter on the graph for class.', (done) => {
        spyOn(service, 'fetchFilterData').and.callThrough();
        let filterLabel = classFilterLabels[1];
        let filterType = 'class';
        setClassData();
        setGlobalData();
        setGlobalVariables();
        service.setConnectivityFilterData();
        // Calling this method to load all filters during graph load
        service.fetchFilterData();
        let deSelectedFilters = [filterLabel,classFilterLabels[0]];
        service.filterObj.set(filterType, deSelectedFilters);
        // Calling this method to apply filter
        service.fetchFilterData();
        expect(service.fetchFilterData).toHaveBeenCalled();

        service.getBaseFilterSubject().subscribe((allFiltersData: Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}>) => {
           expect(allFiltersData.size).toEqual(4);
           expect(allFiltersData.get("class").active).toBeFalsy();
           expect(allFiltersData.get("class").filterData.size).toEqual(2);
           expect(allFiltersData.get("class").filterData.get(filterLabel).counts).toEqual('0/1');
           expect(allFiltersData.get("link").active).toBeFalsy();
           expect(allFiltersData.get("link").filterData.size).toEqual(9);
           expect(allFiltersData.get("link").filterData.get('column').counts).toEqual('6/6');
           expect(allFiltersData.get("length").active).toBeTruthy();
           expect(allFiltersData.get("length").filterData.size).toEqual(2);
           expect(allFiltersData.get("length").filterData.get('2').counts).toEqual('0/1');
           expect(allFiltersData.get("connectivity").active).toBeFalsy();
           expect(allFiltersData.get("connectivity").filterData.size).toEqual(1);
           expect(allFiltersData.get("connectivity").filterData.get('2').counts).toEqual('6/8');
           done();
        });           
    });

    it('#fetchFilterData should fetch global data and apply filter on the graph for link.', (done) => {
        spyOn(service, 'fetchFilterData').and.callThrough();
        let filterType = 'link';
        let deSelectedFilters = ["column","team2OdisMostRuns"];
        setClassData();
        setGlobalData();
        setGlobalVariables();
        service.setConnectivityFilterData();
        // Calling this method to load all filters during graph load
        service.fetchFilterData();
        service.filterObj.set(filterType, deSelectedFilters);
        // Calling this method to apply filter
        service.fetchFilterData();
        expect(service.fetchFilterData).toHaveBeenCalled();

        service.getBaseFilterSubject().subscribe((allFiltersData: Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}>) => {
           expect(allFiltersData.size).toEqual(4);
           expect(allFiltersData.get("class").active).toBeFalsy();
           expect(allFiltersData.get("class").filterData.size).toEqual(2);
           expect(allFiltersData.get("class").filterData.get(classFilterLabels[1]).counts).toEqual('1/1');
           expect(allFiltersData.get("link").active).toBeFalsy();
           expect(allFiltersData.get("link").filterData.size).toEqual(9);
           expect(allFiltersData.get("link").filterData.get('column').counts).toEqual('0/6');
           expect(allFiltersData.get("link").filterData.get('team2OdisMostRuns').counts).toEqual('0/1');
           expect(allFiltersData.get("length").active).toBeTruthy();
           expect(allFiltersData.get("length").filterData.size).toEqual(2);
           expect(allFiltersData.get("length").filterData.get('2').counts).toEqual('1/1');
           expect(allFiltersData.get("connectivity").active).toBeFalsy();
           expect(allFiltersData.get("connectivity").filterData.size).toEqual(1);
           expect(allFiltersData.get("connectivity").filterData.get('2').counts).toEqual('5/8');
           done();
        });           
    });

    it('#fetchFilterData should fetch global data and apply filter on the graph for length.', (done) => {
        spyOn(service, 'fetchFilterData').and.callThrough();
        let filterType = 'length';
        setGlobalData();
        setGlobalVariables();
        setClassData();
        service.setConnectivityFilterData();
        let deSelectedFilters = ["1","2"];
        // Calling this method to load all filters during graph load
        service.fetchFilterData();
        service.filterObj.set(filterType, deSelectedFilters);
        // Calling this method to apply filter
        service.fetchFilterData();
        expect(service.fetchFilterData).toHaveBeenCalled();

        service.getBaseFilterSubject().subscribe((allFiltersData: Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}>) => {
           expect(allFiltersData.size).toEqual(4);
           expect(allFiltersData.get("class").active).toBeFalsy();
           expect(allFiltersData.get("class").filterData.size).toEqual(2);
           expect(allFiltersData.get("class").filterData.get(classFilterLabels[1]).counts).toEqual('0/1');
           expect(allFiltersData.get("link").active).toBeFalsy();
           expect(allFiltersData.get("link").filterData.size).toEqual(9);
           expect(allFiltersData.get("link").filterData.get('column').counts).toEqual('0/6');
           expect(allFiltersData.get("link").filterData.get('team2OdisMostRuns').counts).toEqual('0/1');
           expect(allFiltersData.get("length").active).toBeTruthy();
           expect(allFiltersData.get("length").filterData.size).toEqual(2);
           expect(allFiltersData.get("length").filterData.get('2').counts).toEqual('0/1');
           expect(allFiltersData.get("connectivity").active).toBeFalsy();
           expect(allFiltersData.get("connectivity").filterData.size).toEqual(1);
           expect(allFiltersData.get("connectivity").filterData.get('2').counts).toEqual('0/8');
           done();
        });           
    });

    it('#fetchFilterData should fetch global data and apply filter on the graph for connectivity.', (done) => {
        spyOn(service, 'fetchFilterData').and.callThrough();
        let filterType = 'connectivity';
        setGlobalData();
        setGlobalVariables();
        setClassData();
        service.setConnectivityFilterData();
        let deSelectedFilters = ["2"];
        // Calling this method to load all filters during graph load
        service.fetchFilterData();
        service.filterObj.set(filterType, deSelectedFilters);
        // Calling this method to apply filter
        service.fetchFilterData();
        expect(service.fetchFilterData).toHaveBeenCalled();

        service.getBaseFilterSubject().subscribe((allFiltersData: Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}>) => {
          expect(allFiltersData.size).toEqual(4);
          expect(allFiltersData.get("class").active).toBeFalsy();
          expect(allFiltersData.get("class").filterData.size).toEqual(2);
          expect(allFiltersData.get("class").filterData.get(classFilterLabels[1]).counts).toEqual('0/1');
          expect(allFiltersData.get("link").active).toBeFalsy();
          expect(allFiltersData.get("link").filterData.size).toEqual(9);
          expect(allFiltersData.get("link").filterData.get('column').counts).toEqual('0/6');
          expect(allFiltersData.get("link").filterData.get('team2OdisMostRuns').counts).toEqual('0/1');
          expect(allFiltersData.get("length").active).toBeTruthy();
          expect(allFiltersData.get("length").filterData.size).toEqual(2);
          expect(allFiltersData.get("length").filterData.get('2').counts).toEqual('0/1');
          expect(allFiltersData.get("connectivity").active).toBeFalsy();
          expect(allFiltersData.get("connectivity").filterData.size).toEqual(1);
          expect(allFiltersData.get("connectivity").filterData.get('2').counts).toEqual('0/8');
          done();
        });           
    });

    function getFilterObj() {
        let mapObj = new Map<string, string[]>();
        let arr = ['India','Bihar'];
        mapObj.set('db:place', arr);
        arr = ['Sachin','Dhoni'];
        mapObj.set(classFilterLabels[2], arr);
        return mapObj;
    }

  function setClassData() {
    let classData = [
        {
          "key": "db:Country",
          "value": [
              nodeResUrl+"India"
          ]
        },
        {
          "key": classFilterLabels[0],
          "value": [
              nodeResUrl+"Delhi"
          ]
        }
    ];
    
    service.setClassData(classData);
  }

    function setGlobalVariables() {        
        let selectedSources = [
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
        ];

        service.setGlobalVariables(getConsumedRelationPath(),selectedSources);
    }

    function setGlobalData() {
        service.setGlobalData(getNodes(), getEdges(), getPaths());
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
          "id": nodeResUrl+"Virat_Kohli",
          "label": "Virat Kohli",
          "value": 1,
          "title": "<b>Virat Kohli</b>["+nodeResUrl+"Virat_Kohli]"
        },
        {
          "id": nodeResUrl+"One_Day_International",
          "label": "One Day International",
          "value": 1,
          "title": "<b>One Day International</b>["+nodeResUrl+"One_Day_International]"
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
        },
        {
          "id": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
          "label": "Indian cricket team in West Indies in 2011",
          "value": 1,
          "title": "<b>Indian cricket team in West Indies in 2011</b>["+nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011]"
        },
        {
          "id": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
          "label": "West Indian cricket team in India in 2011–12",
          "value": 1,
          "title": "<b>West Indian cricket team in India in 2011–12</b>["+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011–12]"
        },
        {
          "id": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
          "label": "Indian cricket team in South Africa in 2010–11",
          "value": 1,
          "title": "<b>Indian cricket team in South Africa in 2010–11</b>["+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010–11]"
        },
        {
          "id": nodeResUrl+"Rohit_Sharma",
          "label": "Rohit Sharma",
          "value": 1,
          "title": "<b>Rohit Sharma</b>["+nodeResUrl+"Rohit_Sharma]"
        },
        {
          "id": nodeResUrl+"India",
          "label": "India",
          "value": 1,
          "title": "<b>India</b>["+nodeResUrl+"India]"
        },
        {
          "id": nodeResUrl+"Virat_Kohli",
          "label": "Virat Kohli",
          "value": 1,
          "title": "<b>Virat Kohli</b>["+nodeResUrl+"Virat_Kohli]"
        },
        {
          "id": nodeResUrl+"Delhi",
          "label": "Delhi",
          "value": 1,
          "title": "<b>Delhi</b>["+nodeResUrl+"Delhi]"
        }
      ];
    }

    function getEdges() {
      return [
        {
          "id": 1,
          "from": nodeResUrl+"Rohit_Sharma",
          "to": nodeResUrl+"One_Day_International",
          "label": "column",
          "title": "<b>Rohit Sharma --> column --> One Day International<b>"
        },
        {
          "id": 2,
          "from": nodeResUrl+"Virat_Kohli",
          "to": nodeResUrl+"One_Day_International",
          "label": "column",
          "title": "<b>Virat Kohli --> column --> One Day International<b>"
        },
        {
          "id": 3,
          "from": nodeResUrl+"Rohit_Sharma",
          "to": nodeResUrl+"First-class_cricket",
          "label": "column",
          "title": "<b>Rohit Sharma --> column --> First-class cricket<b>"
        },
        {
          "id": 4,
          "from": nodeResUrl+"Virat_Kohli",
          "to": nodeResUrl+"First-class_cricket",
          "label": "column",
          "title": "<b>Virat Kohli --> column --> First-class cricket<b>"
        },
        {
          "id": 5,
          "from": nodeResUrl+"Rohit_Sharma",
          "to": nodeResUrl+"List_A_cricket",
          "label": "column",
          "title": "<b>Rohit Sharma --> column --> List A cricket<b>"
        },
        {
          "id": 6,
          "from": nodeResUrl+"Virat_Kohli",
          "to": nodeResUrl+"List_A_cricket",
          "label": "column",
          "title": "<b>Virat Kohli --> column --> List A cricket<b>"
        },
        {
          "id": 7,
          "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "team2OdisMostRuns",
          "title": "<b>Indian cricket team in West Indies in 2011 --> team2OdisMostRuns --> Rohit Sharma<b>"
        },
        {
          "id": 8,
          "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
          "to": nodeResUrl+"Virat_Kohli",
          "label": "motm",
          "title": "<b>Indian cricket team in West Indies in 2011 --> motm --> Virat Kohli<b>"
        },
        {
          "id": 9,
          "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "motm",
          "smooth": {
            "type": "curvedCW",
            "roundness": -0.2
          },
          "title": "<b>Indian cricket team in West Indies in 2011 --> motm --> Rohit Sharma<b>"
        },
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
          "id": 11,
          "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "team1OdisMostRuns",
          "title": "<b>West Indian cricket team in India in 2011–12 --> team1OdisMostRuns --> Rohit Sharma<b>"
        },
        {
          "id": 12,
          "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
          "to": nodeResUrl+"Virat_Kohli",
          "label": "motm",
          "title": "<b>West Indian cricket team in India in 2011–12 --> motm --> Virat Kohli<b>"
        },
        {
          "id": 13,
          "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "playerOfOdiSeries",
          "smooth": {
            "type": "curvedCW",
            "roundness": -0.2
          },
          "title": "<b>West Indian cricket team in India in 2011–12 --> playerOfOdiSeries --> Rohit Sharma<b>"
        },
        {
          "id": 14,
          "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "motm",
          "smooth": {
            "type": "curvedCW",
            "roundness": 0.2
          },
          "title": "<b>West Indian cricket team in India in 2011–12 --> motm --> Rohit Sharma<b>"
        },
        {
          "id": 15,
          "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "team1Twenty20sMostRuns",
          "title": "<b>Indian cricket team in South Africa in 2010–11 --> team1Twenty20sMostRuns --> Rohit Sharma<b>"
        },
        {
          "id": 16,
          "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
          "to": nodeResUrl+"Virat_Kohli",
          "label": "team1OdisMostRuns",
          "title": "<b>Indian cricket team in South Africa in 2010–11 --> team1OdisMostRuns --> Virat Kohli<b>"
        },
        {
          "id": 17,
          "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "playerOfTwenty20Series",
          "smooth": {
            "type": "curvedCW",
            "roundness": -0.2
          },
          "title": "<b>Indian cricket team in South Africa in 2010–11 --> playerOfTwenty20Series --> Rohit Sharma<b>"
        },
        {
          "id": 18,
          "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
          "to": nodeResUrl+"Rohit_Sharma",
          "label": "motm",
          "smooth": {
            "type": "curvedCW",
            "roundness": 0.2
          },
          "title": "<b>Indian cricket team in South Africa in 2010–11 --> motm --> Rohit Sharma<b>"
        },
        {
          "id": 19,
          "from": nodeResUrl+"Rohit_Sharma",
          "to": nodeResUrl+"India",
          "label": "country",
          "title": "<b>Rohit Sharma --> country --> India<b>"
        },
        {
          "id": 20,
          "from": nodeResUrl+"Virat_Kohli",
          "to": nodeResUrl+"Delhi",
          "label": "birthPlace",
          "title": "<b>Virat Kohli --> birthPlace --> Delhi<b>"
        },
        {
          "id": 21,
          "from": nodeResUrl+"Delhi",
          "to": nodeResUrl+"India",
          "label": "country",
          "title": "<b>Delhi --> country --> India<b>"
        }
      ];
    }

    function getPaths() {
      return [
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
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
            10,
            8
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
          ],
          "edges": [
            11,
            12
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
          ],
          "edges": [
            13,
            12
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
          ],
          "edges": [
            14,
            12
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
          ],
          "edges": [
            15,
            16
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
          ],
          "edges": [
            17,
            16
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"Virat_Kohli"
          ],
          "edges": [
            18,
            16
          ]
        },
        {
          "startNode": nodeResUrl+"Rohit_Sharma",
          "endNode": nodeResUrl+"Virat_Kohli",
          "nodes": [
            nodeResUrl+"Rohit_Sharma",
            nodeResUrl+"India",
            nodeResUrl+"Virat_Kohli",
            nodeResUrl+"Delhi"
          ],
          "edges": [
            19,
            20,
            21
          ]
        }
      ];
    }

    function getConsumedRelationPath() {
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
              "label": "column",
              "title": "<b>Rohit Sharma --> column --> One Day International<b>"
            },
            {
              "id": 2,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"One_Day_International",
              "label": "column",
              "title": "<b>Virat Kohli --> column --> One Day International<b>"
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
              "label": "column",
              "title": "<b>Rohit Sharma --> column --> First-class cricket<b>"
            },
            {
              "id": 4,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"First-class_cricket",
              "label": "column",
              "title": "<b>Virat Kohli --> column --> First-class cricket<b>"
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
              "label": "column",
              "title": "<b>Rohit Sharma --> column --> List A cricket<b>"
            },
            {
              "id": 6,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"List_A_cricket",
              "label": "column",
              "title": "<b>Virat Kohli --> column --> List A cricket<b>"
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
              "label": "team2OdisMostRuns",
              "title": "<b>Indian cricket team in West Indies in 2011 --> team2OdisMostRuns --> Rohit Sharma<b>"
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
              },
              "title": "<b>Indian cricket team in West Indies in 2011 --> motm --> Rohit Sharma<b>"
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
        },
        {
          "nodes": [
            {
              "id": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "label": "West Indian cricket team in India in 2011–12",
              "value": 1,
              "title": "<b>West Indian cricket team in India in 2011–12</b>["+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011–12]"
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
              "id": 11,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "team1OdisMostRuns",
              "title": "<b>West Indian cricket team in India in 2011–12 --> team1OdisMostRuns --> Rohit Sharma<b>"
            },
            {
              "id": 12,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm",
              "title": "<b>West Indian cricket team in India in 2011–12 --> motm --> Virat Kohli<b>"
            }
          ],
          "length": 1
        },
        {
          "nodes": [
            {
              "id": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "label": "West Indian cricket team in India in 2011–12",
              "value": 1,
              "title": "<b>West Indian cricket team in India in 2011–12</b>["+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011–12]"
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
              "id": 13,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "playerOfOdiSeries",
              "smooth": {
                "type": "curvedCW",
                "roundness": -0.2
              },
              "title": "<b>West Indian cricket team in India in 2011–12 --> playerOfOdiSeries --> Rohit Sharma<b>"
            },
            {
              "id": 12,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm",
              "title": "<b>West Indian cricket team in India in 2011–12 --> motm --> Virat Kohli<b>"
            }
          ],
          "length": 1
        },
        {
          "nodes": [
            {
              "id": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "label": "West Indian cricket team in India in 2011–12",
              "value": 1,
              "title": "<b>West Indian cricket team in India in 2011–12</b>["+nodeResUrl+"West_Indian_cricket_team_in_India_in_2011–12]"
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
              "id": 14,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "motm",
              "smooth": {
                "type": "curvedCW",
                "roundness": 0.2
              },
              "title": "<b>West Indian cricket team in India in 2011–12 --> motm --> Rohit Sharma<b>"
            },
            {
              "id": 12,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm",
              "title": "<b>West Indian cricket team in India in 2011–12 --> motm --> Virat Kohli<b>"
            }
          ],
          "length": 1
        },
        {
          "nodes": [
            {
              "id": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "label": "Indian cricket team in South Africa in 2010–11",
              "value": 1,
              "title": "<b>Indian cricket team in South Africa in 2010–11</b>["+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010–11]"
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
              "id": 15,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "team1Twenty20sMostRuns",
              "title": "<b>Indian cricket team in South Africa in 2010–11 --> team1Twenty20sMostRuns --> Rohit Sharma<b>"
            },
            {
              "id": 16,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "team1OdisMostRuns",
              "title": "<b>Indian cricket team in South Africa in 2010–11 --> team1OdisMostRuns --> Virat Kohli<b>"
            }
          ],
          "length": 1
        },
        {
          "nodes": [
            {
              "id": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "label": "Indian cricket team in South Africa in 2010–11",
              "value": 1,
              "title": "<b>Indian cricket team in South Africa in 2010–11</b>["+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010–11]"
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
              "id": 17,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "playerOfTwenty20Series",
              "smooth": {
                "type": "curvedCW",
                "roundness": -0.2
              },
              "title": "<b>Indian cricket team in South Africa in 2010–11 --> playerOfTwenty20Series --> Rohit Sharma<b>"
            },
            {
              "id": 16,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "team1OdisMostRuns",
              "title": "<b>Indian cricket team in South Africa in 2010–11 --> team1OdisMostRuns --> Virat Kohli<b>"
            }
          ],
          "length": 1
        },
        {
          "nodes": [
            {
              "id": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "label": "Indian cricket team in South Africa in 2010–11",
              "value": 1,
              "title": "<b>Indian cricket team in South Africa in 2010–11</b>["+nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010–11]"
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
              "id": 18,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Rohit_Sharma",
              "label": "motm",
              "smooth": {
                "type": "curvedCW",
                "roundness": 0.2
              },
              "title": "<b>Indian cricket team in South Africa in 2010–11 --> motm --> Rohit Sharma<b>"
            },
            {
              "id": 16,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "team1OdisMostRuns",
              "title": "<b>Indian cricket team in South Africa in 2010–11 --> team1OdisMostRuns --> Virat Kohli<b>"
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
              "id": nodeResUrl+"India",
              "label": "India",
              "value": 1,
              "title": "<b>India</b>["+nodeResUrl+"India]"
            },
            {
              "id": nodeResUrl+"Virat_Kohli",
              "label": "Virat Kohli",
              "value": 1,
              "title": "<b>Virat Kohli</b>["+nodeResUrl+"Virat_Kohli]"
            },
            {
              "id": nodeResUrl+"Delhi",
              "label": "Delhi",
              "value": 1,
              "title": "<b>Delhi</b>["+nodeResUrl+"Delhi]"
            }
          ],
          "edges": [
            {
              "id": 19,
              "from": nodeResUrl+"Rohit_Sharma",
              "to": nodeResUrl+"India",
              "label": "country",
              "title": "<b>Rohit Sharma --> country --> India<b>"
            },
            {
              "id": 20,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"Delhi",
              "label": "birthPlace",
              "title": "<b>Virat Kohli --> birthPlace --> Delhi<b>"
            },
            {
              "id": 21,
              "from": nodeResUrl+"Delhi",
              "to": nodeResUrl+"India",
              "label": "country",
              "title": "<b>Delhi --> country --> India<b>"
            }
          ],
          "length": 2
        }
      ];
    }
});