import { BehaviorSubject, Subject, Subscription, empty } from 'rxjs';
import { EVENT_ARGS_FRAME, EVENT_ARGS_FRAME_INPUT, FrameEventName, RELATION_PATH, NodeEdgeSet, GraphNodeSet, GraphEdgeSet } from 'src/app/models/vis.model';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { Utils } from 'src/app/services/util/common.utils';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { MainFrame } from '../frame/base-frame';
import { BGControl } from "./control";
import { GraphService } from '../service/graph-service';
import { RelFinder } from '../frame/relfinder';

export class GraphControl extends BGControl {
    private _frame: MainFrame;
    private _stopped;
    private _queryCompleted = false;
    private _queryStartNodeIds: string[];
    private _consumeTimer: number;
    private _collectedPaths: RELATION_PATH[];
    private _consumedPaths: RELATION_PATH[];
    private sparqlConstantService: ConstantsService;
    private subscriber: Subject<any>;
    //private currentFilterType: string = 'class';
   // private currentFilterLabel: string | number = '';
    private trigger: boolean = true;
    private languageSubject: BehaviorSubject<any>;
    private suscription: Subscription;
    private visibleNodesEdgesSubscription: Subscription;
    public filterProcessService: FilterProcessService;
    private intervalSubject: BehaviorSubject<number>;
    private refreshInterval: number;
    private isNodeClickFirstTime = true;

    public getTypeName(): string {
        return "GraphControl";
    }

    //colors of selected paths
    private _pathColors = [
        '#4D4C7D', '#005518', '#E65A14', '#5A3F11', '#D45079', '#0096AA'];
    languageGlobally: string = '';
    onCreate(arg: EVENT_ARGS_FRAME) {
        var frame = arg.mainFrame;
        var network = arg.network;
        this._frame = frame;
        //when a node/edge is clicked
        var onselect = function (args: EVENT_ARGS_FRAME_INPUT) {
            var thisCtrl = this;

            if (args.nodes[0]) {
                this.sparqlConstantService.localeResourceService.setLocaleNodeID(args.nodes[0].toString());
            } else {
                this.sparqlConstantService.configurationsService.toggleLeftMenu.next({ type: 'search', visible: false });
            }
            if (!this.languageGlobally) {
                this.languageGlobally = 'English';
            }
            this.filterProcessService.setFitlersSubject(this.filterProcessService.activeFilter, "", false);
            // to handle node click event in filters
            this.filterProcessService.changeFilterOnNodeClick(args.nodes[0]);

            if (this.sparqlConstantService.localeResourceService != undefined && args.nodes[0] != undefined && this.sparqlConstantService.isProcessCompleted) {
                //this.sparqlConstantService.configurationsService.toggleLeftMenu.next({ type: 'info', visible: true });
                this.sparqlConstantService.configurationsService.disableInfoMenu.next(false);
                this.sparqlConstantService.localeResourceService.setSelectedNodeLocaleData(this.languageGlobally, args.nodes[0]);
            }

            if (this._queryStartNodeIds !== undefined) {
                var inPathNodeIds: string[] = [];
                var inPathEdgeIds: string[] = [];

                var selectedNodeIds: string[] = args.nodes;
                var selectedEdgeIds: string[] = args.edges;
                var colorIndex = 0;
                var updateEdges = [];
                //var updateNodes = [];

                //when a non-start node is selected
                if (selectedNodeIds.length == 1 && this._queryStartNodeIds.indexOf(selectedNodeIds[0]) < 0) {
                    this._consumedPaths.forEach((path: RELATION_PATH) => {
                        var inPath = false;
                        for (var n of path.nodes) {
                            if (selectedNodeIds.indexOf(n['id']) >= 0) {
                                inPath = true;
                                break;
                            }
                        }
                        if (!inPath) {
                            for (var e of path.edges) {
                                if (selectedEdgeIds.indexOf(e['id']) >= 0) {
                                    inPath = true;
                                    break;
                                }
                            }
                        }

                        //hilight paths which contain selected node/edge
                        if (inPath) {
                            path.nodes.forEach((y: any) => {
                                inPathNodeIds.push(y.id);
                            });
                            path.edges.forEach((z: any) => {
                                inPathEdgeIds.push(z.id);
                                const selectedColor = thisCtrl._pathColors[colorIndex % thisCtrl._pathColors.length];
                                updateEdges.push({
                                    id: z.id,
                                    chosen: {
                                        edge: function (values, id, selected, hovering) {
                                            if (selected) {
                                                values.color = selectedColor;
                                                values.width = 1;
                                                values.opacity = 1;

                                            }
                                        },
                                        //Edge labels with border
                                        //https://github.com/visjs/vis-network/issues/535
                                        label: function (values, id, selected, hovering) {
                                            if (selected) {
                                                values.color = selectedColor;
                                                values.font = {
                                                    background: "blue"
                                                }
                                                //values.strokeColor = "yellow";
                                                //values.strokeWidth = 1;
                                                values.size = 12;
                                            }
                                        }
                                    }
                                });
                            });
                        }
                        colorIndex++;
                    });
                    if (this.isNodeClickFirstTime) {
                        this.isNodeClickFirstTime = false;
                        setTimeout(() => {
                            frame.updateEdges(updateEdges);
                            args.network.selectNodes(Utils.distinct(inPathNodeIds), false);
                            args.network.selectEdges(Utils.distinct(inPathEdgeIds));
                        }, 1);
                    } else {
                        frame.updateEdges(updateEdges);
                        args.network.selectNodes(Utils.distinct(inPathNodeIds), false);
                        args.network.selectEdges(Utils.distinct(inPathEdgeIds));
                    }
                }
            }
        }

        var onclickoutside = function (args1: any) {
            if (this.filterProcessService && this.filterProcessService.getFitlersSubject()) {
                let nodes = [];
                //Each and every action its creating recurssive subscribes
                if (this.subscriber === undefined) {
                    this.subscriber = this.filterProcessService.getFitlersSubject().subscribe((subdata: any) => {
                        let nodeIds = [];
                        let edgeIds = [];
                        let classLabels = [];

                        if (subdata && subdata.type) {// && subdata.value
                            this.filterProcessService.activeFilter = subdata.type;
                            this.filterProcessService.activeFilterLabel = subdata.value;
                            this.trigger = subdata.trigger;
                        } else {
                            return;
                        }
                        if (this.filterProcessService.activeFilter === 'class') {
                            nodeIds = [];
                            classLabels = [];
                            classLabels.push(this.filterProcessService.activeFilterLabel);
                            if (classLabels.length > 0) {
                                this.filterProcessService.getClassFilterData().forEach((data: any) => {
                                    if (classLabels.includes(data.key)) {
                                        nodeIds = nodeIds.concat(data.value);
                                    }
                                });
                                nodeIds = Array.from(new Set(nodeIds));
                                this._frame.updateGraphData(nodeIds, edgeIds);
                            }
                        } else if (this.filterProcessService.activeFilter === 'link') {
                            edgeIds = this._frame.getGraphService().getEdgesbyLabel(subdata.value);
                            edgeIds = Array.from(new Set(edgeIds));
                            this._frame.updateGraphData(nodeIds, edgeIds);
                        } else if (this.filterProcessService.activeFilter === 'connectivity') {
                            nodeIds = [];
                            nodeIds = this._frame.getGraphService().getConnectivityData(subdata.value);
                            nodeIds = Array.from(new Set(nodeIds));
                            this._frame.updateGraphData(nodeIds, edgeIds);
                        } else if (this.filterProcessService.activeFilter == 'length') {
                            // To clear the previous selected nodes or edges.
                            this._frame.updateGraphData(nodeIds, edgeIds);
                            var colorIndex = 0;
                            var inPathNodeIds: string[] = [];
                            var inPathEdgeIds: string[] = [];
                            var updateEdges = [];
                           // var updateNodes = [];
                            this._consumedPaths.forEach((path: RELATION_PATH) => {
                                if (path.length == this.filterProcessService.activeFilterLabel) {
                                    path.nodes.forEach((x: any) => {
                                        inPathNodeIds.push(x.id);
                                    });
                                    path.edges.forEach((x: any) => {
                                        inPathEdgeIds.push(x.id);
                                        const selectedColor = this._pathColors[colorIndex % this._pathColors.length];
                                        updateEdges.push({
                                            id: x.id,
                                            chosen: {
                                                edge: function (values, id, selected, hovering) {
                                                    if (selected) {
                                                        values.color = selectedColor;
                                                        values.width = 2;
                                                        values.opacity = 0.9;
                                                    }
                                                },
                                                label: function (values, id, selected, hovering) {
                                                    if (selected) {
                                                        values.color = selectedColor;
                                                        // values.strokeColor = "yellow";
                                                        // values.strokeWidth = 2;
                                                        values.size = 12;
                                                    }
                                                }
                                            }
                                        });
                                    });
                                    colorIndex++;
                                }
                            });

                            frame.updateEdges(updateEdges);
                            network.selectNodes(Utils.distinct(inPathNodeIds), false);
                            network.selectEdges(Utils.distinct(inPathEdgeIds));
                        }
                        nodes = nodeIds;
                    });
                }
                if (this.trigger) {
                    this.filterProcessService.changeFilterOnNodeClick(nodes[0]); // For backward compatibility.
                }
            }
            if (this.filterProcessService) {
                this.filtersSubscriptionAndTriggerEvent();
            }
        }

        document.onselectionchange = () => {
            this.onclickoutsideLanguage();
        };
        
        frame.off(FrameEventName.NETWORK_SELECT_EDGES);
        frame.off(FrameEventName.NETWORK_DESELECT_EDGES);
        frame.on(FrameEventName.NETWORK_CLICK, onselect.bind(this));
        document.body.addEventListener("click", onclickoutside.bind(this));
    }
     onclickoutsideLanguage() {
        if (this.suscription == undefined && this.languageSubject) {
            this.suscription = this.languageSubject.subscribe((data: any) => {
                if (data.lang != undefined) {
                    let lang = data.lang;
                    this.languageGlobally = lang;
                    this._frame.updateLocalization(lang, this.sparqlConstantService);
                }
            });
        }
    }

    private filtersSubscriptionAndTriggerEvent() {
        let visibleNodesEdgesSub = this.filterProcessService.getVisibleNodesEdgesSubject();
        if (visibleNodesEdgesSub && this.visibleNodesEdgesSubscription === undefined) {
            this.visibleNodesEdgesSubscription = visibleNodesEdgesSub.subscribe((nodesEdges: any) => {
                if (nodesEdges) {
                    this._frame.hideNodesAndEdges(nodesEdges.nodes, nodesEdges.edges);
                }
            });
        }
    }

     _retrieveMoreRelations() {
        // let nodesCount: object[] = [];
        // let edgesCount: object[] = [];
        var thisCtrl = this;
        let RETRIEVE_INTERVAL = 500;
        if (this.intervalSubject) {
            this.intervalSubject.subscribe((val: number) => {
                if (val) {
                    RETRIEVE_INTERVAL = val;
                    this.refreshInterval = val;
                } else {
                    RETRIEVE_INTERVAL = 500;
                }
                console.log("retrival interval:" + RETRIEVE_INTERVAL)
            });
        }
        setTimeout(() => {
            thisCtrl._frame.getGraphService().getRelPaths(
                (queryResults: RELATION_PATH[]) => {
                    queryResults.forEach((path: RELATION_PATH) => {
                        thisCtrl._collectedPaths.push(path);
                        thisCtrl._collectedPaths=Array.from(new Set(thisCtrl._collectedPaths));
                    })
                    // thisCtrl._queryCompleted = true;
                });
        }, RETRIEVE_INTERVAL);

    }

    public startQuery(nodeIds: string[],
        refreshInterval: number = 100,
        loadGraphSubj: Subject<string>,
        constService: ConstantsService,
        languageSubject: BehaviorSubject<any>,
        filterProcessService: FilterProcessService,
        intervalSubject: BehaviorSubject<any>, dataUpdateSubject: BehaviorSubject<any>) {

        this.filterProcessService = filterProcessService;
        this._stopped = false;
        this._queryCompleted = false;
        this._frame.placeNodes(nodeIds);
        this._frame.focusNodes(nodeIds);
        this.languageSubject = languageSubject;
        this.intervalSubject = intervalSubject;
        this.refreshInterval = refreshInterval;
        var thisCtrl = this;

        this._collectedPaths = [];
        this._consumedPaths = [];

        this._queryStartNodeIds = nodeIds;
        this.sparqlConstantService = constService;
        //consume data and visualize
        if (dataUpdateSubject != undefined) {
            dataUpdateSubject.subscribe((data: any) => {
                thisCtrl._retrieveMoreRelations();
                if (thisCtrl._collectedPaths.length > 0) {
                    this.refreshInterval = 30;
                    thisCtrl.getCollectedPaths(loadGraphSubj, constService);
                }
                this._stopped = false;
                thisCtrl._queryCompleted = data;
            });
        }
        this.refreshInterval = 200;
        thisCtrl._retrieveMoreRelations();
        thisCtrl.getCollectedPaths(loadGraphSubj, constService);
       

    }
    timerObj = [];
    public getCollectedPaths(loadGraphSubj: Subject<string>, constService: ConstantsService) {
        var thisCtrl = this;
        this._consumeTimer = window.setInterval(() => {
            console.log("calling refreshInterval:" + this.refreshInterval)
            if (thisCtrl._collectedPaths && thisCtrl._collectedPaths.length > 0) {
                //consume retrieved paths
                var path = thisCtrl._collectedPaths.shift();
                thisCtrl._frame.insertNodes(path.nodes);
                thisCtrl._frame.insertEdges(path.edges);
                thisCtrl._consumedPaths.push(path);
                if (thisCtrl._collectedPaths.length == 0 && thisCtrl._queryCompleted) {
                        loadGraphSubj.next(constService.FINISHED);
                        thisCtrl.stopQuery(); 
                        this._stopped=false;                                    
                }
            }
            else {

                for (let interval in this.timerObj) {
                    window.clearInterval(this.timerObj[interval]);
                    this.timerObj.splice(parseInt(interval), 1);
                }
                if (thisCtrl._queryCompleted) {
                    loadGraphSubj.next(constService.FINISHED);
                    thisCtrl.stopQuery();
                    this._stopped=false;
                    // thisCtrl.filterProcessService.setConnectivityFilterData();
                    // thisCtrl.filterProcessService.fetchFilterData();
                }
            }
            // Hide/un-hide or highlight nodes/edges If user selected any filter during graph loading
            thisCtrl.filterProcessService.setFilterSelectionIfAny();

        },
            this.refreshInterval);

        this.timerObj.push(this._consumeTimer);
    }

    public stopQuery() {
        if (!this._stopped) {
            this._stopped = true;
            for (let entry of this.timerObj) {
                window.clearInterval(entry);
            }
        }
    }

    public stopEmptyNodeIntervals() {
            for (let entry of this.timerObj) {
                window.clearInterval(entry);
            }
        
    }
    public onDestroy(args: EVENT_ARGS_FRAME) {
    }

    // For testing only

    public setLanguageSubjectForTest(value: string) {
        this.languageSubject = new BehaviorSubject<any>('');
        this.languageSubject.next({lang: value});
    }

    public callMethodsForTesting() {
        this.filtersSubscriptionAndTriggerEvent();
    }

    public setCommonObj(frameObj: MainFrame, constantService: ConstantsService): void {
        this._frame = frameObj;
        this.sparqlConstantService = constantService;
    }

    // For testing only.
    public setPaths(collectedPath: RELATION_PATH[], consumedPath: RELATION_PATH[]) {
        this._collectedPaths = collectedPath;
        this._consumedPaths = consumedPath;
        this._queryCompleted = true;
    }
}