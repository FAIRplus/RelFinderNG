import { } from "jquery";
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { CommunityData, GraphEdge, GraphNode, GSON, LoadGraphOption, NodesEdges, PAIR, RELATION_PATH } from '../../models/vis.model';
import { Utils } from '../../services/util/common.utils';

export class GraphService {
   // public _nodes: object[];
   // public _transformedPaths: RELATION_PATH[];
  //  public _edges: object[];
  //  private _communityData: CommunityData;
  // public _class: any = {};
   // private _eventHandlers = {};
    public _paths: object[];
    public _inputNodes: string[] = [];

    private _loadGraphOption: LoadGraphOption;
    public _perfermLoadData: (callbackAfterLoad: () => void) => void;
    private static sparqlConnectionService: SPARQLConnectionService;

    static setServices(sparqlConnectionService: SPARQLConnectionService) {
        this.sparqlConnectionService = sparqlConnectionService;
    }

    // For testing only
    public setDummyDataForTest(indexDB: any, sparqlConnectionService: SPARQLConnectionService) {
        this._indexDB = indexDB;
        GraphService.sparqlConnectionService = sparqlConnectionService;
    }

    //indices
    private _indexDB = {
        _mapId2Node: new Map<string, object>(),
        _mapId2Edge: new Map<string, object>(),
        _mapEdgeLabel2ID: new Map<string, number[]>(),
        _mapNodeId2NeighbourNodeIds: new Map<string, Set<string>>(),
        _mapNodePair2EdgeIds: new Map<string, Set<string>>(),
    };

    getNodes(nodeIds: [string]) {
        let nodeObj: object[] = new Array;

        nodeIds.forEach(nodeId => {
            let node = this._indexDB._mapId2Node.get(nodeId);
            if (node != null)
                nodeObj.push(node);
        });
        return nodeObj;
    }

    getEdgesbyLabel(edgeLable: string) {
        return this._indexDB._mapEdgeLabel2ID.get(edgeLable);
    }

    getConnectivityData(connectivityId: number) {
        let connectivityData: any;
        GraphService.sparqlConnectionService.filterProcessService.connectivity.forEach((connectivityObj: any) => {
            if (connectivityObj.key == connectivityId) {
                connectivityData = connectivityObj.value;
            }
        });
        return connectivityData;
    }

    getRelPaths(callback: (queryResults: RELATION_PATH[]) => void) {
        callback(GraphService.sparqlConnectionService.filterProcessService.consumedRelationPaths);
    }

    private _translate(gson: GSON): NodesEdges {
        //console.log("Node data translate------"+JSON.stringify(gson.data.nodes))
        let nodes = gson.data.nodes;
        let edges = gson.data.edges;
        let paths = gson.data.paths;
        let connectivity = gson.data.connectivity;
        let inputNodes =gson.data.inputNodes;

        let counterNode = 1;
        let counterEdge = 1;

        // let finalRelPaths: { nodes: [], edges: [] }[] = [];
        // let relPath: { nodes: [], edges: [] };

        nodes.forEach((node: any) => {
            if (node.id === undefined)
                node.id = counterNode++;
            //set title
            if (node.title === undefined && node.label !== undefined)
                node.title = "<b>" + node.label + "</b>" + "[" + decodeURI(node.id) + "]";
            //set group
            if (node.group === undefined && node.categories instanceof Array)
                node.group = node.categories[0];
        });

        edges.forEach((edge: any) => {
            if (edge.id === undefined)
                edge.id = counterEdge++;
            edge.title = "<b>"+Utils.lastEleInArray(Utils.trimURI(edge.from).split('/'))+ "&nbsp <span style='font-size:14px'>&#x2192</span> &nbsp" +edge.label+ " &nbsp <span style='font-size:14px'>&#x2192</span> &nbsp" +Utils.lastEleInArray(Utils.trimURI(edge.to).split('/')) +"<b>";
        });

        return {
            nodes: nodes,
            edges: edges,
            paths: paths,
            connectivity: connectivity,
            inputNodes: inputNodes
        };
    }

    public constructor() {
    }

    public _processGson(gson: GSON) {
        console.log("calling _processGson------------")
        var data = this._translate(gson);
        GraphService.sparqlConnectionService.filterProcessService.setGlobalData(data.nodes,data.edges,data.paths);
       // this._nodes = GraphService.sparqlConnectionService.filterProcessService._nodes;
       // this._edges = GraphService.sparqlConnectionService.filterProcessService._edges;
        this._paths = [...data.paths]; //GraphService.sparqlConnectionService.filterProcessService._paths;
        if(GraphService.sparqlConnectionService.filterProcessService.connectivity && GraphService.sparqlConnectionService.filterProcessService.connectivity.length > 0) {
            this.setConnectivityData(data.connectivity);
        } else {
            GraphService.sparqlConnectionService.filterProcessService.connectivity = data.connectivity;
        }
        //this._class = [...this.setClassData()];

        this._inputNodes = data.inputNodes;
        //set loadGraphOption
        this._loadGraphOption = gson.option || {
            autoLayout: gson.data.communities === undefined
        };

        this._createIndexDB();
    }

    private setConnectivityData(newConnectivityData: any[]) {
        newConnectivityData.forEach((newConnData) => {
            let itemIndex = GraphService.sparqlConnectionService.filterProcessService.connectivity.findIndex(item => item.key == newConnData.key);
            if (itemIndex !== -1) {
                let tempObj = GraphService.sparqlConnectionService.filterProcessService.connectivity[itemIndex].value;
                tempObj = tempObj.concat(newConnData.value);
                GraphService.sparqlConnectionService.filterProcessService.connectivity[itemIndex].value = Array.from(new Set(tempObj));
            } else {
                GraphService.sparqlConnectionService.filterProcessService.connectivity.push(newConnData);
            }
        });
    }

    public setClassData(): any[] {
        let classArr: any[] = [];
        let classUris = GraphService.sparqlConnectionService.classUrisWithResUris;
        for (let [key, value] of classUris) {
            classArr.push({key: key, value: value});
        }
        return classArr;
    }
    
    private _createIndexDB() {
        //create indices
        var indexDB = this._indexDB;
        let finalRelPaths: RELATION_PATH[] = [];
        GraphService.sparqlConnectionService.filterProcessService._nodes.forEach((x: any) => {
            //console.log("nodes ids---"+x.id);
            indexDB._mapId2Node.set(x.id, x);
        });

        GraphService.sparqlConnectionService.filterProcessService._edges.forEach((x: any) => {
            let edgeIds = [];          
            let edgeLabel = x.label + '';
            indexDB._mapId2Edge.set(x.id + '', x);
            if (indexDB._mapEdgeLabel2ID.has(edgeLabel)) {
                edgeIds = indexDB._mapEdgeLabel2ID.get(edgeLabel);
                edgeIds.push(x.id);
                indexDB._mapEdgeLabel2ID.set(edgeLabel, edgeIds)
            } else {
                edgeIds.push(x.id);
                indexDB._mapEdgeLabel2ID.set(edgeLabel,edgeIds)
            }

            //create adjacent matrix
            var pairs = [{ _1: x.from, _2: x.to }, { _1: x.to, _2: x.from }];
            pairs.forEach((pair: PAIR<string, string>) => {
                if (!indexDB._mapNodeId2NeighbourNodeIds.has(pair._1))
                    indexDB._mapNodeId2NeighbourNodeIds.set(pair._1, new Set<string>());

                var neighbours = indexDB._mapNodeId2NeighbourNodeIds.get(pair._1);
                neighbours.add(pair._2);
            });

            //create node pair->edges
            pairs.forEach((pair: PAIR<string, string>) => {
                var key = "" + pair._1 + "-" + pair._2;
                if (!indexDB._mapNodePair2EdgeIds.has(key))
                    indexDB._mapNodePair2EdgeIds.set(key, new Set<string>());

                var edges = indexDB._mapNodePair2EdgeIds.get(key);
                edges.add(x.id);
            });
        });

        this._paths.forEach((path: any) => {            
            let relPath: RELATION_PATH = { nodes: [], edges: [], length: 0};
            let length: number = 0;
            path.edges.forEach((edge: number) => {
                relPath.edges.push(indexDB._mapId2Edge.get(edge.toString()));
            });
            path.nodes.forEach((node: string) => {
                relPath.nodes.push(indexDB._mapId2Node.get(node));
            });

            length = path.nodes.filter((n: string) => !GraphService.sparqlConnectionService.selectedSources.includes(n)).length;
            relPath.length = length;
            finalRelPaths.push(relPath);
        });

        //Preparing baseFilters data
       // this._transformedPaths = [...finalRelPaths];
        let selectedSources = GraphService.sparqlConnectionService.selectedSources;
        GraphService.sparqlConnectionService.filterProcessService.setGlobalVariables(finalRelPaths, selectedSources);
        GraphService.sparqlConnectionService.filterProcessService.setConnectivityFilterData();
        GraphService.sparqlConnectionService.filterProcessService.fetchFilterData();
        if(GraphService.sparqlConnectionService.isNodesEmpty && GraphService.sparqlConnectionService.filterProcessService.consumedRelationPaths.length <=0 ){
            GraphService.sparqlConnectionService.emptyNodesObjectSubject.next("There is no relationship between given inputs.Please try different inputs....!");
            GraphService.sparqlConnectionService.graphLoadStatus.next(GraphService.sparqlConnectionService.constantService.FINISHED);
            GraphService.sparqlConnectionService.relfinderObj.stopEmptyNodeIntervals();
        }
        console.log("Transformed path length-----: "+GraphService.sparqlConnectionService.filterProcessService.consumedRelationPaths.length);
    }

    public static _string2GSON(gsonString: string): GSON {
        return JSON.parse(gsonString);
    }

    getRawNodes() {
        return GraphService.sparqlConnectionService.filterProcessService._nodes;
    }
    getRawEdges() {
        return GraphService.sparqlConnectionService.filterProcessService._edges;
    }
   
    public static loadDataFromSPARQLParser(data: string[],graph) { 
        graph._perfermLoadData = (callback: () => void) => {
            graph._processGson(GraphService._string2GSON(JSON.stringify(Utils.triplesToNodeEdgeSet(data, GraphService.sparqlConnectionService.duplicateEdgesMap,GraphService.sparqlConnectionService.selectedSources))));
            callback();
        };
        return graph;
    }
    
    _async(fn: (timerId: number) => void) {
        var timerId;
        timerId = window.setTimeout(() => {
            fn(timerId);
        }, 1);
    }

    requestConnect(callback: () => void) {
        var local: GraphService = this;
        this._async(() => {
            local._perfermLoadData(callback);
        });
    }

    requestLoadGraph(callback: (nodes: GraphNode[], edges: GraphEdge[], option: LoadGraphOption) => void) {
        var local: GraphService = this;
        this._async(() =>
            callback( GraphService.sparqlConnectionService.filterProcessService._nodes, GraphService.sparqlConnectionService.filterProcessService._edges, local._loadGraphOption));
    }

    requestSearch(expr: any, limit: number, callback: (nodes: GraphNode[]) => void) {
        var results = this.getNodes(expr);
        callback(results);
    }

    // private _getNode(nodeId: string) {
    //     return this._indexDB._mapId2Node.get(nodeId);
    // }

    // private _getEdge(edgeId: string) {
    //     return this._indexDB._mapId2Edge.get(edgeId);
    // }

    // private _getEdgesInPath(path: string[]): string[] {
    //     var edges = [];
    //     var lastNodeId = null;

    //     for (var node of path) {
    //         if (lastNodeId != null) {
    //             this._getEdgesBetween(lastNodeId, node).forEach((edge) => {
    //                 edges.push(edge);
    //             });
    //         }
    //         lastNodeId = node;
    //     }
    //     return edges;
    // }

    // private _getEdgesBetween(startNodeId, endNodeId): Set<string> {
    //     return this._indexDB._mapNodePair2EdgeIds.get("" + startNodeId + "-" + endNodeId);
    // }
}