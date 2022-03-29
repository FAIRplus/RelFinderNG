import * as vis from "vis-network";
import { MainFrame } from '../base/frame/base-frame';
import { Theme } from '../config/theme';

export type IdType = string | number;

export interface NodesEdges {
    nodes: object[];
    edges: object[];
    paths?: object[];
    connectivity?: [];
    inputNodes?: []
}

export interface BaseFilters {
    lengthF: Map<string, number>;
    classF: Map<string, number>;
    linkF: Map<string, number>;
    connectivityF: Map<string, number>;
}


export interface NodeEdgeIds {
    nodes: string[];
    edges: string[];
}

export class GraphNodeSet extends vis.DataSet<vis.Node> {
}

export class GraphEdgeSet extends vis.DataSet<vis.Edge> {
}

export interface NodeEdgeSet {
    nodes: GraphNodeSet,
    edges: GraphEdgeSet
}

/** 
 * graph json objects
*/
export interface Community {
    id: string,
    fillColor: string,
    borderColor: string,
    outline: POINT[]
}

export interface GSON {
    option: {
        autoLayout?: boolean;
    }
    data: {
        nodes: object[];
        edges?: object[];
        paths?: object[];
        communities?: Community[];
        connectivity?: [];
        inputNodes?: [];
    }
    dbinfo?: object;
    categories?: object;
    translator?: {
        nodes?: (node: object) => void;
        edges?: (node: object) => void;
    };
}


export interface GraphNode extends vis.Node {
}

export interface LoadGraphOption {
    autoLayout?: boolean
}

export interface NodeCommunityEntry {
    node: string,
    community: string
}

export interface CommunityData {
    communities: Community[];
    nodeMap: NodeCommunityEntry[];
}

export interface GraphEdge extends vis.Edge {

}

export class GraphNetwork extends vis.Network {
}

export interface NETWORK_OPTIONS extends vis.Options {

}

export interface FRAME_OPTIONS {
    showFaces?: boolean;
    showGroups?: boolean;
    showNodes?: boolean;
    showDegrees?: boolean;
    showEdges?: boolean;
    showLabels?: boolean;
    showTitles?: boolean;
}

export interface EVENT_ARGS_FRAME {
    mainFrame: MainFrame;
    network: GraphNetwork;
    theme: Theme;
    htmlMainFrame: HTMLElement;
}

export interface EVENT_ARGS_FRAME_INPUT extends EVENT_ARGS_FRAME, NodeEdgeIds {
    previousSelection?: NodeEdgeIds;
}

export interface EVENT_ARGS_FRAME_SHOW_INFO extends EVENT_ARGS_FRAME, NodeEdgeIds {
    htmlInfoBox: HTMLElement;
}

export interface EVENT_ARGS_FRAME_RESIZE extends EVENT_ARGS_FRAME {
    width?: number;
    height?: number;
    oldWidth?: number;
    oldHeight?: number;
}

export interface EVENT_ARGS_RELFINDER extends EVENT_ARGS_FRAME {
    maxDepth: number;
}
export enum FrameEventName {
    FRAME_CLEAR_ALL_FLAGS = "FRAME_CLEAR_ALL_FLAGS",
    THEME_CHANGED = "THEME_CHANGED",
    DESTROY_CONTROL = "DESTROY_CONTROL",
    REMOVE_CONTROL = "REMOVE_CONTROL",
    CREATE_CONTROL = "CREATE_CONTROL",
    ADD_CONTROL = "ADD_CONTROL",
    GRAPH_CONNECTED = "GRAPH_CONNECTED",
    GRAPH_LOADED = "GRAPH_LOADED",
    FRAME_CREATED = "FRAME_CREATED",
    FOCUS_NODES = "FOCUS_NODES",
    INSERT_NODES = "INSERT_NODES",
    NETWORK_SELECT_NODES = "NETWORK_SELECT_NODES",
    NETWORK_DESELECT_NODES = "NETWORK_DESELECT_NODES",
    NETWORK_SELECT_EDGES = "NETWORK_SELECT_EDGES",
    NETWORK_DESELECT_EDGES = "NETWORK_DESELECT_EDGES",
    NETWORK_BEFORE_DRAWING = "NETWORK_BEFORE_DRAWING",
    NETWORK_AFTER_DRAWING = "NETWORK_END_DRAWING",
    NETWORK_DBLCLICK = "NETWORK_DBLCLICK",
    NETWORK_CLICK = "NETWORK_CLICK",
    NETWORK_DRAGGING = "NETWORK_DRAGGING",
    FRAME_RESIZE = "FRAME_RESIZE",
    RESULTLISTPUT = "RESULTLISTPUT",
    IMAGEBOXOPEN = "IMAGEBOXOPEN",
    SHOW_INFO = "SHOW_INFO",
}

export interface RELATION_PATH {
    nodes: object[];
    edges: object[];
    length?: number;
    //class?: any[]
}

export interface PAIR<K, V> {
    _1: K,
    _2: V;
}

export interface RECT {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface POINT {
    x: number;
    y: number;
}