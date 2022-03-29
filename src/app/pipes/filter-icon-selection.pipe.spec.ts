import { FilterIconSelection } from "./filter-icon-selection.pipe";
import { FilterProcessService } from '../services/filters/filter-process.service';
import { TestBed } from '@angular/core/testing';
import { TestConfUtil } from '../test/test-conf.util';
import { TestConfigModel } from '../test/test-config.model';


describe('FilterIconSelection', () => {
    let pipe : FilterIconSelection;
    let filterProcessService: FilterProcessService;
    let testConf : TestConfUtil = new TestConfUtil();
    let testConfigData: TestConfigModel = testConf.getConfigData();
    let classFilterLabels = testConfigData.classFilterLabels;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FilterIconSelection],
            providers: [FilterProcessService]
        });
        filterProcessService = TestBed.get(FilterProcessService);
        pipe = new FilterIconSelection(filterProcessService);
        filterProcessService.filterObj.set('class', [classFilterLabels[2]]);
    });

    afterEach(() => {
        pipe = null;
        filterProcessService.filterObj.clear();
    });

    it('Should create an instance.', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the closedEye.svg for child type', (done) => {
        let result = pipe.transform(false, classFilterLabels[2], 'class', '0/3', 'child');
        expect(result).toEqual('assets/icons/hide.svg');
        done();
    });

    it('should return the openEye.svg for child type', (done) => {
        let result = pipe.transform(true, classFilterLabels[2], 'class', '3/3', 'child');
        expect(result).toEqual('assets/icons/view.svg');
        done();
    });

    it('should return the disabledEye.svg for child type', (done) => {
        let result = pipe.transform(false, classFilterLabels[3], 'class', '0/3', 'child');
        expect(result).toEqual('assets/icons/disabled_hide.svg');
        done();
    });

    it('should return the openEye.svg for parent type', (done) => {
        let result = pipe.transform(true, classFilterLabels[2], 'class', '3/3', 'parent');
        expect(result).toEqual('assets/icons/view.svg');
        done();
    });

    it('should return the closedEye.svg for parent type', (done) => {
        let result = pipe.transform(false, classFilterLabels[2], 'class', '3/3', 'parent');
        expect(result).toEqual('assets/icons/hide.svg');
        done();
    });
});