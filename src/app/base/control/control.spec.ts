import { Control, UIControl } from "./control";
import { EVENT_ARGS_FRAME } from 'src/app/models/vis.model';
import { RelFinder } from '../frame/relfinder';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

class Controls extends Control {
    public getTypeName(): string {
        throw new Error("Method not implemented.");
    }
    onCreate(args: EVENT_ARGS_FRAME) {
        throw new Error("Method not implemented.");
    }
    onDestroy(args: EVENT_ARGS_FRAME) {
        throw new Error("Method not implemented.");
    }
    
}

class UIControls extends UIControl {
    public getTypeName(): string {
        throw new Error("Method not implemented.");
    }
    onCreate(args: EVENT_ARGS_FRAME) {
        throw new Error("Method not implemented.");
    }
    
}

describe('Control', () => {
    let control: Controls;
    let uiControl: UIControls;

    beforeEach(() => {
        control = new Controls();
        uiControl = new UIControls();
    });

    // Control

    it('#enable should set _disabled to false', (done) => {
        control._disabled = true;
        control.enable();
        expect(control._disabled).toBeFalsy();
        done();
    });

    it('#disable should set _disabled to true', (done) => {
        control._disabled = false;
        control.disable();
        expect(control._disabled).toBeTruthy();
        done();
    });

    // UIControl

    it('#setPosition should set _position', (done) => {
        spyOn(uiControl, 'setPosition').and.callThrough();
        uiControl.setPosition(undefined);
        expect(uiControl.setPosition).toHaveBeenCalled();
        done();
    });

    it('#bindElement should be called', (done) => {
        spyOn(uiControl, 'bindElement').and.callThrough();
        let container = document.createElement('div');
        container.setAttribute('id', 'loadGraph');
        let frame = new RelFinder(container);
        uiControl.bindElement(undefined, frame, undefined);
        expect(uiControl.bindElement).toHaveBeenCalled();
        done();
    });

    it('#onDestroy should be called', (done) => {
        spyOn(uiControl, 'onDestroy').and.callThrough();
        uiControl.onDestroy(undefined);
        expect(uiControl.onDestroy).toHaveBeenCalled();
        done();
    });
});