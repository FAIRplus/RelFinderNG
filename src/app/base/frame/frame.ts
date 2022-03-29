import { Theme } from '../../config/theme';
import { EVENT_ARGS_FRAME, FrameEventName, FRAME_OPTIONS, GraphNode } from "../../models/vis.model";
import { GraphService } from '../service/graph-service';
import { MainFrame } from './base-frame';



export abstract class BaseApp extends MainFrame {
    protected _toggleEdgeLabelHandlers;

    protected constructor(htmlFrame: HTMLElement,
        initialOptions: FRAME_OPTIONS, extra?: object, theme?: Theme) {
        super(htmlFrame, initialOptions, theme);
        super.on(FrameEventName.FRAME_CREATED, this.onCreateFrame.bind(this));
        super.fire(FrameEventName.FRAME_CREATED, extra || {});
    }
    
    protected abstract onCreateFrame(args: EVENT_ARGS_FRAME);

    public loadData(data, graph,callback) {
        super.connectService(GraphService.loadDataFromSPARQLParser(data,graph), callback);
    }

    public pickup(keywords: object[], callback: (nodes: GraphNode[]) => void) {
        super.search(keywords, (nodes: GraphNode[]) => {
            var nodeIds = super.insertNodes(nodes);
            super.placeNodes(nodeIds);
            super.updateNodes(nodeIds.map(function (nodeId: any) {
                return { id: nodeId, physics: false };
            }));
            if (callback !== undefined)
                callback(nodes);
        });
    }

    public updateTheme(theme: Theme | Function) {
        super.updateTheme(theme);
    }
}