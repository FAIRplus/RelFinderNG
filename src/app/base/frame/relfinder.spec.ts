import { RelFinder } from "./relfinder";
import { TestBed } from '@angular/core/testing';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { GraphService } from '../service/graph-service';
import { Utils } from 'src/app/services/util/common.utils';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('RelFinder', () => {
    let service: RelFinder;
    let constantService: ConstantsService;
    let filterProcessService: FilterProcessService;
    let graphLoadStatus = new Subject<string>();
    let dataUpdateSubject = new BehaviorSubject<any>('');
    let languageSubject = new BehaviorSubject<any>('');
    let intervalSubject = new BehaviorSubject<number>(500);
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let nodeResUrl = testConfigData.nodeResource;   

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConstantsService, FilterProcessService]
        });
        constantService = TestBed.get(ConstantsService);
        filterProcessService = TestBed.get(FilterProcessService);
        let container = document.createElement('div');
        container.setAttribute('id', 'loadGraph');
        service = new RelFinder(container);
        service._graphService = new GraphService();
        service.setSPARQLConnServiceObj(graphLoadStatus, constantService, languageSubject, filterProcessService, intervalSubject,dataUpdateSubject);
        service.setSelectedSources(getInputNodes());
        filterProcessService._nodes=getNodes();
        filterProcessService._nodes=getEdges();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#setSelectedSources should set the input source ids .', (done) => {
        spyOn(service, "setSelectedSources").and.callThrough();
        service.setSelectedSources(getInputNodes());
        expect(service.setSelectedSources).toHaveBeenCalled();
        expect(service._selectedSources[0]).toEqual(nodeResUrl+'Rohit_Sharma');
        done();
    });

    it('#setSPARQLConnServiceObj should initialize the services and subjects.', (done) => {
        spyOn(service, "setSPARQLConnServiceObj").and.callThrough();
        service.setSPARQLConnServiceObj(graphLoadStatus, constantService, languageSubject, filterProcessService, intervalSubject,dataUpdateSubject);
        expect(service.setSPARQLConnServiceObj).toHaveBeenCalled();
        done();
    });

    it('#startQuery should  initialize the graph process by calling graph control startQuery method.', (done) => {
        spyOn(service, "startQuery").and.callThrough();
        service.startQuery(400, 5);
        expect(service.startQuery).toHaveBeenCalled();
        done();
    });

    it('#stopQuery will stop the graph loading.', (done) => {
        spyOn(service, "stopQuery").and.callThrough();
        service.stopQuery();
        expect(service.stopQuery).toHaveBeenCalled();
        done();
    });

    it('#pickup should update _loadGraphSubject and call the parent pickup method.', (done) => {
        spyOn(service, "pickup").and.callThrough();
        service.pickup();
        expect(service.pickup).toHaveBeenCalled();
        done();
    });

    function getInputNodes() {
        return [nodeResUrl+"Rohit_Sharma",nodeResUrl+"Virat_Kohli"];
    }
    function getNodes() {
        return [{id: nodeResUrl+"Rohit_Sharma"},{id: nodeResUrl+"Virat_Kohli"}];
    }

    function getEdges() {
        return [{id: "1", from: nodeResUrl+"Rohit_Sharma", to: nodeResUrl+"Virat_Kohli", label: "column"}];
    }
});