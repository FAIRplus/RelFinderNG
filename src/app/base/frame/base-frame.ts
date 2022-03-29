import * as events from "events";
import "jquery";
import $ from "jquery";
import "jqueryui";
import { ConstantsService } from 'src/app/services/util/constants.service';
import { Theme, Themes } from "../../config/theme";
import { EVENT_ARGS_FRAME, EVENT_ARGS_FRAME_RESIZE, FrameEventName, FRAME_OPTIONS, GraphEdge, GraphEdgeSet, GraphNetwork, GraphNode, GraphNodeSet, LoadGraphOption, NETWORK_OPTIONS, NodeEdgeSet } from "../../models/vis.model";
import { Utils } from "../../services/util/common.utils";
import { Control } from "../control/control";
import { GraphService } from '../service/graph-service';

var CANVAS_PADDING: number = 80;
var MAX_EDGES_COUNT = 5000;
var MAX_NODES_COUNT = 5000;
export abstract class MainFrame {
    private _htmlFrame: HTMLElement;
    private _minScale: number = 0.1;
    private _maxScale: number = 2;
    public _graphService: GraphService;
    public _network: GraphNetwork;
    private _emiter = new events.EventEmitter();
    private _networkOptions: NETWORK_OPTIONS;
    private DEFAULT_NODE_BACKGROUND_COLOR = '#F5F5F5';
    private DEFAULT_NODE_BORDER_COLOR = '#000000';
    private NODE_BACKGROUND_COLOR_ON_CLASS_SELECT = '#E6FFC8';
    private NODE_BORDER_COLOR_ON_CLASS_SELECT = '#5A8F18';

    public _selectedSources;
    private mapLanguage = new Map();
    private enLocale = [];
    private isLangulageEN = true;
    
    public _screenData: NodeEdgeSet = {       
        nodes: new GraphNodeSet(),
        edges: new GraphEdgeSet()
    };

    private _rawData = {
        nodes: [],
        edges: []
    };

    private _autoCompletionItemLimit = 30;
    protected _ctrls: Map<string, Control> = new Map<string, Control>();
    private _showGraphOptions: FRAME_OPTIONS = {};
    private _theme: Theme;

    public constructor(htmlFrame: HTMLElement, showGraphOptions: FRAME_OPTIONS, theme?: Theme) {
        this._htmlFrame = htmlFrame;

        showGraphOptions = showGraphOptions || {};
        this._showGraphOptions = Utils.deepExtend(this._createDefaultShowGraphOptions(), showGraphOptions);
        this._networkOptions = this._createDefaultNetworkOptions();
        this._network = new GraphNetwork(htmlFrame, this._screenData, this._networkOptions);

        this._bindNetworkEvents();
        this._bindControlEvents(FrameEventName.FRAME_RESIZE);

        this.updateTheme(theme);

        this.on(FrameEventName.GRAPH_CONNECTED, (args: EVENT_ARGS_FRAME) => {
            this.clearScreen();
        });
    }

    public setSelectedSources(sources: any) {
        this._selectedSources = sources;
    }

    public emit(event: string, args: object) {
        this._emiter.emit(event, args);
    }

    public fire(event: string, extra?: object) {
        this._emiter.emit(event, this._composeEventArgs(extra));
    }

    public on(event: string, listener: (args: EVENT_ARGS_FRAME) => void) {
        this._emiter.on(event, listener);
    }

    public off(event: string, listener?: (args: EVENT_ARGS_FRAME) => void): Function[] {
        if (listener === undefined) {
            var listeners = this._emiter.listeners(event);
            this._emiter.removeAllListeners(event);
            return listeners;
        }
        else {
            this._emiter.removeListener(event, listener);
            return [listener];
        }
    }

    public getGraphService() {
        return this._graphService;
    }

    public getScreenData(): NodeEdgeSet {
        return this._screenData;
    }

    public addControl<T extends Control>(ctrl: T): T {
        this._ctrls.set(ctrl.getTypeName(), ctrl);
        ctrl.emit(FrameEventName.CREATE_CONTROL, this._createEventArgs());
        this.fire(FrameEventName.ADD_CONTROL, { ctrl: ctrl });
        return ctrl;
    }

    public connectService(service: GraphService, callback) {
        this._graphService = service;
        this._graphService.requestConnect(() => {
            this.fire(FrameEventName.GRAPH_CONNECTED);
            if (callback != undefined)
                callback();
        });
    }

    public updateTheme(theme: Theme | Function | any | string) {
        if (theme instanceof Function) {
            theme(this._theme);
        } else if (typeof theme == 'string') {
            this._theme = Themes[theme]();
        } else {
            // this._theme = theme || Themes.DEFAULT();
            this._theme = Themes.DEFAULT();
            this._theme = <Theme>Utils.deepExtend(this._theme, theme);
        }
        $(this._htmlFrame).css('background', this._theme.canvasBackground);
        //update network option
        let _temp = {
            nodes: this._theme.nodes,
            edges: this._theme.edges,
            groups: {}
        };
        //for groups, future purpose
        if (this._theme.groups) {
            if (this._theme.groups.useSeqColors) {
                this._network['groups'].defaultGroups = this._theme.groups.SeqColors
                this._network.redraw()
            } else {
                _temp.groups = this._theme.groups.custom
            }
        }
        this._networkOptions = Utils.deepExtend(this._networkOptions, _temp);
        this.updateNetworkOptions(this._networkOptions);

        this._notifyControls(FrameEventName.THEME_CHANGED, { theme: this._theme });
    }

    public updateNetworkOptions(options: NETWORK_OPTIONS | Function) {
        if (options instanceof Function) {
            options(this._networkOptions);
        }
        else {
            this._networkOptions = options;
        }

        this._network.setOptions(this._networkOptions);
    }

    public scaleTo(scale: number) {
        this._network.moveTo({ scale: scale });
    }

    public fits(nodeIds: string[], animation = false) {
        this._network.fit({ nodes: nodeIds, animation: animation });
    }

    public redraw() {
        this._network.redraw();
    }

    public search(keyword: any, callback: (nodes: GraphNode[]) => void) {
        this._graphService.requestSearch(keyword, this._autoCompletionItemLimit, callback);
    }

    public updateGraph(showGraphOptions: FRAME_OPTIONS | Function, callback?: () => void) {
        if (showGraphOptions instanceof Function) {
            showGraphOptions(this._showGraphOptions);
        }
        else {
            this._showGraphOptions = showGraphOptions;
        }

        var frame = this;
        frame._screenData.nodes.update(frame._rawData.nodes.map((x) => {
            return frame._formatNode(x, frame._showGraphOptions);
        })
        );
        frame._screenData.edges.update(frame._rawData.edges.map((x) => {
            return frame._formatEdge(x, frame._showGraphOptions);
        })
        );
    }

    public updateNodes(updates: any[]) {
        this._screenData.nodes.update(updates);
    }

    public updateEdges(updates: any[]) {
        this._screenData.edges.update(updates);
    }

    public clearScreen() {
        this._screenData.nodes.clear();
        this._screenData.edges.clear();
    }

    /**
     * load graph data and show network in current format
     * @param callback
     */
    public loadGraph(options, callback: () => void) {
        var frame = this;
        this._graphService.requestLoadGraph(
            function (nodes: GraphNode[], edges: GraphEdge[], option: LoadGraphOption) {

                frame.fire(FrameEventName.GRAPH_LOADED, {
                    nodes: nodes,
                    edges: edges,
                    option: option
                });

                frame._rawData = { nodes: nodes, edges: edges };
                frame._screenData.nodes = new GraphNodeSet(frame._rawData.nodes.map((x) => {
                    return frame._formatNode(x);
                })
                );
                frame._screenData.edges = new GraphEdgeSet(frame._rawData.edges.map((x) => {
                    return frame._formatEdge(x);
                })
                );

                //too large!!
                if (
                    ((option || {}).autoLayout === false) ||
                    frame._rawData.nodes.length > MAX_NODES_COUNT ||
                    frame._rawData.edges.length > MAX_EDGES_COUNT) {
                    frame.updateNetworkOptions((networkOptions: NETWORK_OPTIONS) => {
                        networkOptions.physics = false;
                    });
                }
                frame._network.setData(frame._screenData);

                if (options.scale !== undefined) {
                    frame.scaleTo(options.scale);
                }

                if (callback !== undefined)
                    callback();
            });
    }

    /**
     * insert a set of nodes, if some nodes exists, ignore the errors
     * @param nodes nodes to be inserted
     * @returns new node ids (without which exist already)
     */
    public insertNodes(nodes: any[]): string[] {
        var browser = this;

        var newNodeIds = nodes.filter((node) => {
            return this._screenData.nodes.get(node.id) === null;
        }).map((node) => {
            return node.id;
        });

        this._screenData.nodes.update(nodes.map((node) => {
            return browser._formatNode(node);
        }));
        return newNodeIds;
    }

    /**
     * delete matched nodes
     * @param filter a function tells id the node should be deleted, set undefined if want to delete all
     */
    public deleteNodes(filter: (node) => boolean) {
        if (filter === undefined) {
            this._screenData.nodes.clear();
            return;
        }

        var nodeIds = [];
        this._screenData.nodes.forEach((node) => {
            if (filter(node))
                nodeIds.push(node.id);
        })

        this._screenData.nodes.remove(nodeIds);
    }

    public focusNodes(nodeIds: string[]): void {
        this._network.fit({ nodes: nodeIds, animation: true });
    }

    public focusEdges(edgeIds: string[]): void {
        this._network.selectEdges(edgeIds)
    }
     
    public insertEdges(edges: any[]): void {
        var browser = this;
        this._screenData.edges.update(edges.map((edge) => {
            return browser._formatEdge(edge);
        }));
    }

    public getNodeById(nodeId: string) {
        return this._screenData.nodes.get(nodeId);
    }

    public placeNodes(nodeIds: string[]) {
        if (nodeIds.length == 0)
            return;
        var updates = [];

        var ratio = 1 - 1 / (nodeIds.length * nodeIds.length);
        var jq = $(this._htmlFrame);
        
        var canvasWidth = jq.width()-52; // Excludig in form canvasleft menu 52 px
        var canvasHeight = jq.height()-(56+72+30); // Excludig in form canvas header 56px , 72px  top panel and footer 30px

        var angle = Math.PI, scopeX = ratio * canvasWidth / 2, scopeY = ratio * canvasHeight / 2;
        var delta = 2 * Math.PI / nodeIds.length;
        nodeIds.forEach((nodeId) => {
            var x = scopeX * Math.cos(angle);
            var y = scopeY * Math.sin(angle);
            angle += delta;
            updates.push({ id: nodeId, x: x, y: y, physics: false });
        });
        this.updateNodes(updates);
    }

    public updateGraphData(nodeIds: any[], edgeIds: any[]) {
        let updatedEdges = this.edgeColorUpdate(edgeIds);
        let updatedNodes = this.nodeColorUpdate(nodeIds);

        // To clear the previous selected paths.
        this._network.unselectAll();
        this._screenData.nodes.update(updatedNodes);
        this._screenData.edges.update(updatedEdges);

        //this.moveToTop(nodeIds, edgeIds);
    }

    private nodeColorUpdate(nodeIds: any[]) {
        let updatedNodes = [];
        this._screenData.nodes.forEach((node: any) => {
            if (!this._selectedSources.includes(node.id)) {
                if (nodeIds.includes(node.id)) {
                    updatedNodes.push({ id: node.id, color: { border: this.NODE_BORDER_COLOR_ON_CLASS_SELECT, background: this.NODE_BACKGROUND_COLOR_ON_CLASS_SELECT, opacity: 1 } });
                } else {
                    updatedNodes.push({ id: node.id, color: { border: this.DEFAULT_NODE_BORDER_COLOR, background: this.DEFAULT_NODE_BACKGROUND_COLOR } });
                }
            }
        });
        //To set default colors to other nodes
        this._network.storePositions();
        return updatedNodes;
    }

    private edgeColorUpdate(edgeIds: any[]) {
        let updatedEdges: any = [];
        //To set specific color to selected edges.
        this._screenData.edges.forEach((edge) => {
            if (edgeIds.includes(edge.id)) {
                updatedEdges.push({ id: edge.id, font: { background: this.NODE_BACKGROUND_COLOR_ON_CLASS_SELECT, strokeWidth: 0, size: 12, opacity: 1 } });
            } else {
                updatedEdges.push({ id: edge.id, font: { background: 'white', size: 7 } });
            }
        });
        return updatedEdges;
    }

    // Hack to highlight selected nodes
    /*private moveToTop(nodeIds: string[], edgeIds: string[]) {
        let updatedNodes = [];
        let updatedEdges = [];

        let nodesToHighlight: any = [];
        let edgesToHighlight: any = [];
        let delNodeIds: string[] = [];
        let delEdgeIds: string[] = [];
        this._screenData.nodes.forEach((node: any) => {
            if (nodeIds.includes(node.id)) {
                updatedNodes.push({ id: node.id, opacity: 1 })
                nodesToHighlight.push(node);
                delNodeIds.push(node.id);
            }
        });
        this._screenData.edges.forEach((edge: any) => {
            if (edgeIds.includes(edge.id)) {
                edgesToHighlight.push(edge);
                updatedEdges.push({ id: edge.id, opacity: 1 })
                delEdgeIds.push(edge.id);
            }
        });
        this._screenData.nodes.remove(delNodeIds);
        this._screenData.edges.remove(delEdgeIds);
        this._screenData.nodes.update(nodesToHighlight);
        this._screenData.edges.update(edgesToHighlight);
        this._screenData.nodes.update(updatedNodes);
        this._screenData.edges.update(updatedEdges);
    }*/

    public updateLocalization(language: any, constantService: ConstantsService) {
        let mapObjForLocaleData = constantService.localeResourceService.mapNodeObj;
        let updateLocale = [];
        if (this.isLangulageEN) {
            this.getGraphService().getRawNodes().forEach((node) => {
                this.enLocale.push({ id: node['id'], label: Utils.truncateString(node['label'], 20) });
            });
            this.mapLanguage.set("English", this.enLocale);
            this.isLangulageEN = false;
        }
        if (language === 'res') {
            if (!this.mapLanguage.has(language)) {
                this._screenData.nodes.forEach((node) => {
                    updateLocale.push({ id: node.id, label: node.id.toString().substring(0, 18).concat('...') });
                    if (constantService.localeResourceService.selectionNodeID === node.id) {
                        let localeData = Utils.getLocaleData(node.id, mapObjForLocaleData, language);
                        if (localeData && localeData !== undefined && localeData.length > 0) {
                            constantService.localeResourceService.sendMessage(localeData[0].desc, localeData[0].lang);
                        } else {
                            constantService.localeResourceService.sendMessage('There is no information...!', node.id);
                        }
                    }
                });
            } else {

                if (this._screenData.nodes.get(constantService.localeResourceService.selectionNodeID) != null && constantService.localeResourceService.selectionNodeID === this._screenData.nodes.get(constantService.localeResourceService.selectionNodeID)['id']) {
                    let localeData = Utils.getLocaleData(constantService.localeResourceService.selectionNodeID, mapObjForLocaleData, language);
                    if (localeData && localeData !== undefined && localeData.length > 0) {
                        constantService.localeResourceService.sendMessage(localeData[0].desc, localeData[0].lang);
                    } else {
                        constantService.localeResourceService.sendMessage('There is no information...!', constantService.localeResourceService.selectionNodeID);
                    }
                }
            }
        } else {
            if (language !== 'English') {
                Object.keys(this.mapLanguage).forEach(function (k) {
                    if (k.includes(language)) {
                        delete this.mapLanguage[k];
                    }
                });
                this.updateNodes(this.mapLanguage.get('English'));
            }
            for (let obj of mapObjForLocaleData) {
                if (language === 'English') {
                    if (this.mapLanguage.has(language)) {
                        if (this._screenData.nodes.get(constantService.localeResourceService.selectionNodeID) != null &&
                            constantService.localeResourceService.selectionNodeID === this._screenData.nodes.get(constantService.localeResourceService.selectionNodeID)['id']) {
                            let localeData = Utils.getLocaleData(constantService.localeResourceService.selectionNodeID, mapObjForLocaleData, language);
                            if (localeData && localeData !== undefined && localeData.length > 0) {
                                constantService.localeResourceService.sendMessage(localeData[0].desc, localeData[0].lang);
                            } else {
                                constantService.localeResourceService.sendMessage('There is no information...!', constantService.localeResourceService.selectionNodeID);
                            }
                        }
                        break;
                    }
                }
                let labelValue = '';
                if (this._screenData.nodes.get(obj.id) != null && obj.id === this._screenData.nodes.get(obj.id)['id']) {
                    for (let lableObj of obj.value.labeledData) {
                        if (lableObj.lang === language) {
                            updateLocale.push({ id: obj.id, label: Utils.truncateString(lableObj.value, 20) });
                            if (constantService.localeResourceService.selectionNodeID === obj.id) {
                                labelValue = lableObj.value
                            }

                        }
                    }
                    if (constantService.localeResourceService.selectionNodeID === obj.id) {

                        for (let abstract of obj.value.abstractData) {
                            if (language === abstract.lang) {
                               let linkURI=obj.value.linkURIData[0] !=null && obj.value.linkURIData[0] != 'undefined' ? obj.value.linkURIData[0] : '';
                                constantService.localeResourceService.sendMessage(linkURI+"_SEP_"+abstract.value+"_SEP_"+obj.value.imageURI[0], labelValue);
                            } else {
                                if (!labelValue) {
                                    constantService.localeResourceService.sendMessage('There is no information...!', Utils.trimNodeURI(constantService.localeResourceService.selectionNodeID));
                                }
                            }
                        }
                    }
                }
            }
        }
        if (updateLocale.length > 0) {
            this.mapLanguage.set(language, updateLocale);
        }
        if (this.mapLanguage.has(language)) {
            this.updateNodes(this.mapLanguage.get(language));
        }
    }

    hideNodesAndEdges(visibleNodes: any[], visibleEdges: any[]) {
        let updatedNodes = [];
        let updatedEdges = [];
        this._screenData.nodes.forEach((node: any) => {
            if (visibleNodes.includes(node.id)) {
                updatedNodes.push({ id: node.id, hidden: false });
            } else {
                updatedNodes.push({ id: node.id, hidden: true });
            }
        });
        this._screenData.edges.forEach((edge: any) => {
            if (visibleEdges.includes(edge.id)) {
                updatedEdges.push({ id: edge.id, hidden: false });
            } else {
                updatedEdges.push({ id: edge.id, hidden: true });
            }
        });
        this._screenData.nodes.update(updatedNodes);
        this._screenData.edges.update(updatedEdges);
    }

    private _bindNetworkEvent(networkEventName, frameEventName) {
        var browser: MainFrame = this;
        this._network.on(networkEventName, function (args) {
            browser.fire(frameEventName,
                args instanceof CanvasRenderingContext2D ? { context2d: args } : args);
        });
    }

    private _bindNetworkEvents() {
        var eventsMap = Utils.toMap({
            "click": FrameEventName.NETWORK_CLICK,
            "doubleClick": FrameEventName.NETWORK_DBLCLICK,
            "beforeDrawing": FrameEventName.NETWORK_BEFORE_DRAWING,
            "afterDrawing": FrameEventName.NETWORK_AFTER_DRAWING,
            "selectEdge": FrameEventName.NETWORK_SELECT_EDGES,
            "deselectEdge": FrameEventName.NETWORK_DESELECT_EDGES,
            "dragging": FrameEventName.NETWORK_DRAGGING,
            "resize": FrameEventName.FRAME_RESIZE,
        });

        eventsMap.forEach((v, k, map) => {
            this._bindNetworkEvent(k, v);
        });
    }

    private _createEventArgs(): EVENT_ARGS_FRAME {
        return {
            mainFrame: this,
            network: this._network,
            theme: this._theme,
            htmlMainFrame: this._htmlFrame,
        }
    }

    private _formatEdge(gsonEdge: any, showGraphOptions?: FRAME_OPTIONS): GraphEdge {
        if (showGraphOptions === undefined)
            showGraphOptions = this._showGraphOptions;

        var visEdge: any = { id: gsonEdge.id };
        visEdge.from = gsonEdge.from;
        visEdge.to = gsonEdge.to;
        visEdge.hidden = (showGraphOptions.showEdges === false);
        visEdge.label = gsonEdge.label;
        visEdge.smooth = gsonEdge.smooth;
        visEdge.title = gsonEdge.title;
        return visEdge;
    }

    private _formatNode(gsonNode: any, showGraphOptions?: FRAME_OPTIONS): GraphNode {
        if (showGraphOptions === undefined)
            showGraphOptions = this._showGraphOptions;

        var visNode: any = { id: gsonNode.id };

        if (gsonNode.x !== undefined) {
            visNode.x = gsonNode.x;
        }

        if (gsonNode.y !== undefined) {
            visNode.y = gsonNode.y;
        }

        ///////show label
        if (showGraphOptions.showLabels === true) {
            if (this._selectedSources.includes(visNode.id)) {
                visNode.label = gsonNode.label;
                visNode.borderWidth = 0;
                visNode.borderWidthSelected = 0;
                visNode.color = {
                    background: '#002B4B',
                    hover: '#FF8244'
                };
                visNode.font = {
                    color: 'white'
                };
                visNode.value = 3;
            } else {
                visNode.label = Utils.truncateString(gsonNode.label, 20);
                visNode.borderWidth = 0.5;
                visNode.borderWidthSelected = 1;
                // Commented as it is overriding the existing node color if user select any filter while graph loading.
                // visNode.color = {
                //     border: this.DEFAULT_NODE_BORDER_COLOR,
                //     background: this.DEFAULT_NODE_BACKGROUND_COLOR
                // };
            }
        }
        if (showGraphOptions.showLabels === false) {
            visNode.label = null;
        }

        ///////show label
        if (showGraphOptions.showTitles === true) {
            visNode.title = gsonNode.title;
        }
        if (showGraphOptions.showTitles === false) {
            visNode.title = null;
        }

        ///////show node?
        if (showGraphOptions.showNodes === true) {
            visNode.hidden = false;
        }
        if (showGraphOptions.showNodes === false) {
            visNode.hidden = true;
        }

        ///////show degree?
        if (showGraphOptions.showDegrees === true && gsonNode.value !== undefined) {
            visNode.value = gsonNode.value;
        }
        if (showGraphOptions.showDegrees === false) {
            visNode.value = 1;
        }

        return visNode;
    }

    private _bindControlEvents(event: string, event2?: string) {
        var frame = this;
        if (event2 === undefined)
            event2 = event;

        this.on(event, (args: EVENT_ARGS_FRAME_RESIZE) => {
            frame._ctrls.forEach((ctrl: Control, name: string, map) => {
                ctrl.emit(event2, args);
            });
        });
    }

    protected _notifyControls(event: string, extra?: object) {
        var args = this._composeEventArgs(extra);
        this._ctrls.forEach((ctrl: Control, name: string, map) => {
            ctrl.emit(event, args);
        });
    }

    private _createDefaultShowGraphOptions(): FRAME_OPTIONS {
        return {
            showNodes: true,
            showEdges: true,
            showLabels: true
        };
    }

    private _composeEventArgs(extra?: object): EVENT_ARGS_FRAME {
        var args: any = this._createEventArgs();

        if (extra !== undefined) {
            for (let key in extra) {
                if (extra.hasOwnProperty(key)) {
                    args[key] = extra[key];
                }
            }
        }

        return args;
    }

    private _createDefaultNetworkOptions(): NETWORK_OPTIONS {
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

    // For testing only
    public setScreenDataForTesting(nodes: any[], edges: any[], htmlFrame: HTMLDivElement ) {
        this._screenData.nodes.update(nodes);
        this._screenData.edges.update(edges);
        //this.getGraphService()._nodes = nodes;
        this._networkOptions = this._createDefaultNetworkOptions();
        this._network = new GraphNetwork(htmlFrame, this._screenData, this._networkOptions);
    }
}
