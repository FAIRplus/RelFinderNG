import { HttpClientModule } from '@angular/common/http';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { FilterHeading } from 'src/app/pipes/filter-heading.pipe';
import { FilterIconSelection } from 'src/app/pipes/filter-icon-selection.pipe';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let sparqlConService: SPARQLConnectionService;
  let filterProcessService: FilterProcessService;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let classFilterLabels = testConfigData.classFilterLabels;
  let nodeResUrl = testConfigData.nodeResource;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent, FilterHeading, FilterIconSelection],
      imports: [
        HttpClientModule
      ],
      providers: [
        SPARQLConnectionService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    sparqlConService = TestBed.get(SPARQLConnectionService);
    filterProcessService = TestBed.get(FilterProcessService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#initializeFiltersData should subcribe the all filters subject and get emmitted data.' , (done) => {
    let data = getFilterData();
    filterProcessService.setBaseFilterSubject(data);
    component.initializeFiltersData();
    expect(component.allFilters.get('class').filterData.get(classFilterLabels[1]).counts).toEqual("3/3");
    done();
  });

  it('#filterNodeClick should subcribe the filter specific subject and get emmitted data', (done) => {
    filterProcessService.setFilterNodeSubject(classFilterLabels[1], 'class', true);
    component.filterNodeClick();
    expect(filterProcessService.activeFilter).toEqual('class');
    expect(filterProcessService.activeFilterLabel).toEqual(classFilterLabels[1]);
    done();
  });

  it('#handleFilterValClick should handle the filter selection and deselection.', (done) => {
    let filterType= 'class';
    let filterLabel = classFilterLabels[1];
    setGlobalData();
    setGlobalVariables();
    component.filterProcessService.setConnectivityFilterData()
    let event = {target: {checked: false, value: filterLabel}};
   // component.filterProcessService.filterObj.set('', ['']);
    // Calling this method to load all filters during graph load
    component.filterProcessService.fetchFilterData();
    component.handleFilterValClick(event, filterType);
    let result = component.filterProcessService.filterObj.get(filterType);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(filterLabel);
    done();
  });

  it('#handleFilterHeaderClick should handle the filter selection and deselection.', (done) => {
    setGlobalData();
    setGlobalVariables();
    component.filterProcessService.setConnectivityFilterData()
    //component.filterProcessService.filterObj.set('', ['']);
    // Calling this method to load all filters during graph load
    component.filterProcessService.fetchFilterData();
    let checked= true;
    let filterType= 'class';
    component.allFilters = getFilterData();
    component.handleFilterHeaderClick(checked,filterType);
    let result = component.filterProcessService.filterObj.get(filterType);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(classFilterLabels[1]);
    done();
  });

  function getFilterData(): Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}> {
    let data: Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}> = new Map();
    let filterData = new Map();
    filterData.set(classFilterLabels[1], {counts: "3/3" , isVisible: true});
    data.set('class', {active: true, isAllVisible: false, filterData});
    return data;
  }

  function setGlobalData() {
    let edges = [
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
      },
      {
      "id": 6,
      "from": nodeResUrl+"Virat_Kohli",
      "to": nodeResUrl+"List_A_cricket",
      "label": "column"
      },
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
      },
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
      "id": 10,
      "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "playerOfOdiSeries",
      "smooth": {
          "type": "curvedCW",
          "roundness": 0.2
      }
      },
      {
      "id": 11,
      "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "team1OdisMostRuns"
      },
      {
      "id": 12,
      "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
      "to": nodeResUrl+"Virat_Kohli",
      "label": "motm"
      },
      {
      "id": 13,
      "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "playerOfOdiSeries",
      "smooth": {
          "type": "curvedCW",
          "roundness": -0.2
      }
      },
      {
      "id": 14,
      "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "motm",
      "smooth": {
          "type": "curvedCW",
          "roundness": 0.2
      }
      },
      {
      "id": 15,
      "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "team1Twenty20sMostRuns"
      },
      {
      "id": 16,
      "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
      "to": nodeResUrl+"Virat_Kohli",
      "label": "team1OdisMostRuns"
      },
      {
      "id": 17,
      "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "playerOfTwenty20Series",
      "smooth": {
          "type": "curvedCW",
          "roundness": -0.2
      }
      },
      {
      "id": 18,
      "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
      "to": nodeResUrl+"Rohit_Sharma",
      "label": "motm",
      "smooth": {
          "type": "curvedCW",
          "roundness": 0.2
      }
      },
      {
      "id": 19,
      "from": nodeResUrl+"Rohit_Sharma",
      "to": nodeResUrl+"India",
      "label": "country"
      },
      {
      "id": 20,
      "from": nodeResUrl+"Virat_Kohli",
      "to": nodeResUrl+"Delhi",
      "label": "birthPlace"
      },
      {
      "id": 21,
      "from": nodeResUrl+"Delhi",
      "to": nodeResUrl+"India",
      "label": "country"
      }
  ];

  let nodes = [
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
  ];

    let paths =  [
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
      }];

      component.filterProcessService.setGlobalData(nodes, edges, paths);
  }

  function setGlobalVariables() {
    let consumedRelationPaths = [
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
              "label": "team1OdisMostRuns"
            },
            {
              "id": 12,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm"
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
              }
            },
            {
              "id": 12,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm"
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
              }
            },
            {
              "id": 12,
              "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "motm"
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
              "label": "team1Twenty20sMostRuns"
            },
            {
              "id": 16,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "team1OdisMostRuns"
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
              }
            },
            {
              "id": 16,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "team1OdisMostRuns"
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
              }
            },
            {
              "id": 16,
              "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
              "to": nodeResUrl+"Virat_Kohli",
              "label": "team1OdisMostRuns"
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
              "label": "country"
            },
            {
              "id": 20,
              "from": nodeResUrl+"Virat_Kohli",
              "to": nodeResUrl+"Delhi",
              "label": "birthPlace"
            },
            {
              "id": 21,
              "from": nodeResUrl+"Delhi",
              "to": nodeResUrl+"India",
              "label": "country"
            }
          ],
          "length": 2
        }
    ];
    
    let edges = [
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
        },
        {
        "id": 6,
        "from": nodeResUrl+"Virat_Kohli",
        "to": nodeResUrl+"List_A_cricket",
        "label": "column"
        },
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
        },
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
        "id": 10,
        "from": nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "playerOfOdiSeries",
        "smooth": {
            "type": "curvedCW",
            "roundness": 0.2
        }
        },
        {
        "id": 11,
        "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "team1OdisMostRuns"
        },
        {
        "id": 12,
        "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
        "to": nodeResUrl+"Virat_Kohli",
        "label": "motm"
        },
        {
        "id": 13,
        "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "playerOfOdiSeries",
        "smooth": {
            "type": "curvedCW",
            "roundness": -0.2
        }
        },
        {
        "id": 14,
        "from": nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "motm",
        "smooth": {
            "type": "curvedCW",
            "roundness": 0.2
        }
        },
        {
        "id": 15,
        "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "team1Twenty20sMostRuns"
        },
        {
        "id": 16,
        "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
        "to": nodeResUrl+"Virat_Kohli",
        "label": "team1OdisMostRuns"
        },
        {
        "id": 17,
        "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "playerOfTwenty20Series",
        "smooth": {
            "type": "curvedCW",
            "roundness": -0.2
        }
        },
        {
        "id": 18,
        "from": nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311",
        "to": nodeResUrl+"Rohit_Sharma",
        "label": "motm",
        "smooth": {
            "type": "curvedCW",
            "roundness": 0.2
        }
        },
        {
        "id": 19,
        "from": nodeResUrl+"Rohit_Sharma",
        "to": nodeResUrl+"India",
        "label": "country"
        },
        {
        "id": 20,
        "from": nodeResUrl+"Virat_Kohli",
        "to": nodeResUrl+"Delhi",
        "label": "birthPlace"
        },
        {
        "id": 21,
        "from": nodeResUrl+"Delhi",
        "to": nodeResUrl+"India",
        "label": "country"
        }
    ];
    let connectivity = [
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
    let classData = [
        {
        "key": classFilterLabels[1],
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
    let selectedSources = [
        nodeResUrl+"Rohit_Sharma",
        nodeResUrl+"Virat_Kohli"
    ];

    component.filterProcessService.setGlobalVariables(consumedRelationPaths,selectedSources);
}

});
