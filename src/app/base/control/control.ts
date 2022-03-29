import * as events from "events";
import $ from "jquery";
import { MainFrame } from "../frame/base-frame";
import { EVENT_ARGS_FRAME, FrameEventName, POINT, RECT } from "../../models/vis.model";

export abstract class Control extends events.EventEmitter {
    public _disabled: boolean = false;

    public abstract getTypeName(): string;

    abstract onCreate(args: EVENT_ARGS_FRAME) : any;
    abstract onDestroy(args: EVENT_ARGS_FRAME) : any;

    constructor() {
        super();

        this.on(FrameEventName.CREATE_CONTROL, this.onCreate.bind(this));
        this.on(FrameEventName.DESTROY_CONTROL, this.onDestroy.bind(this));
    }

    public enable() {
        this._disabled = false;
    }

    public disable() {
        this._disabled = true;
    }
}

/**
 * control with no UI
 */
export abstract class BGControl extends Control {
}

/**
 * control with UI
 */
export abstract class UIControl extends Control {
    protected _htmlContainer: HTMLElement;
    protected _position: (frameRect: RECT, ctrlRect: RECT) => POINT;

    constructor() {
        super();
    }

    public onBindElement(htmlContainer: HTMLElement, frame: MainFrame, args: EVENT_ARGS_FRAME) {
    }

    public bindElement(htmlContainer: HTMLElement, frame: MainFrame, args: EVENT_ARGS_FRAME) {
        this._htmlContainer = htmlContainer;
        this.onBindElement(htmlContainer, frame, args);
    }

    public setPosition(position: (frameRect: RECT, ctrlRect: RECT) => POINT) {
        this._position = position;
    }

    public onDestroy(args: EVENT_ARGS_FRAME) {
        $(this._htmlContainer).hide();
        $(this._htmlContainer).remove();
    }
}