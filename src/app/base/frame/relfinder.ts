import { BehaviorSubject, Subject } from 'rxjs';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { EVENT_ARGS_FRAME, GraphNode, NETWORK_OPTIONS } from '../../models/vis.model';
import { GraphControl } from '../control/graph-control';
import { BaseApp } from './frame';
import { Utils } from 'src/app/services/util/common.utils';

export class RelFinder extends BaseApp {
    private _relfinder: GraphControl;
    private _loadGraphSubject;
    private _constantService;
    private _languageSubject;
    private _filterProcessService;
    private _intervalSubject;
    private _dataUpdateSubject;

    public constructor(htmlFrame: HTMLElement) {
        super(htmlFrame, {
            showLabels: true,
            showFaces: true,
            showDegrees: true,
            showEdges: true,
            showGroups: true,
            showTitles: true
        }, { showDialog: false });
    }

    public setSelectedSources(sources: any) {
        this._selectedSources = sources;
    }
    public setSPARQLConnServiceObj(obj: Subject<string>, constObj: ConstantsService,
        languageSubject: BehaviorSubject<any>, filterProcessService: FilterProcessService, intervalSubject: BehaviorSubject<any>,dataUpdateSubject: BehaviorSubject<any>) {
        this._loadGraphSubject = obj;
        this._constantService = constObj;
        this._languageSubject = languageSubject;
        this._filterProcessService = filterProcessService;
        this._intervalSubject = intervalSubject;
        this._dataUpdateSubject=dataUpdateSubject
    }
    protected onCreateFrame(args: EVENT_ARGS_FRAME) {
        var frame = args.mainFrame;
        this._relfinder = frame.addControl(new GraphControl());
        frame.updateNetworkOptions(function (options: NETWORK_OPTIONS) {
            options.edges.physics = false;
            options.edges.length = 0.5;
            options.physics.timestep = 0.1;
        });
    }
    public startQuery(refreshInterval: number = 500, maxDepth: number = 6) {
        var pickedNodeIds = this._selectedSources;
        super.deleteNodes(function (node) {
            return pickedNodeIds.indexOf(node.id) < 0;
        });
        this._relfinder.startQuery(pickedNodeIds, refreshInterval, this._loadGraphSubject, this._constantService, this._languageSubject, this._filterProcessService, this._intervalSubject,this._dataUpdateSubject);
    }

    public stopQuery() {
        this._relfinder.stopQuery();
    }

    public stopEmptyNodeIntervals(){
        this._relfinder.stopEmptyNodeIntervals();
    }
   
    public pickup() {
        this._loadGraphSubject.next(this._constantService.LOADED)
        super.pickup(this._selectedSources, (nodes: GraphNode[]) => {
        });
    }
}