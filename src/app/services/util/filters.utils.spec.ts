import { TestBed} from '@angular/core/testing';
import { FiltersUtils } from './filters.utils';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('FiltersUtils', () => {

  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let classFilterLabels = testConfigData.classFilterLabels;
  
    it('should be created', () => {
      const service: FiltersUtils = new FiltersUtils();
      expect(service).toBeTruthy();
    });
  
    it('#getFilterObject should return the array of object.', (done) => {
      let data: Map<string, {counts: string, isVisible: boolean}> = new Map();
      data.set(classFilterLabels[1], {counts: "3/3" , isVisible: true});
      data.set(classFilterLabels[2], {counts: "2/2" , isVisible: true});
      data.set(classFilterLabels[5], {counts: "3/3" , isVisible: true});
      data.set(classFilterLabels[3], {counts: "1/3" , isVisible: true});
      data.set(classFilterLabels[4], {counts: "2/3" , isVisible: true});
      data.set(classFilterLabels[0], {counts: "3/3" , isVisible: true});
      let filterData = FiltersUtils.getFilterObject(data, 'class');
      let filterObj = filterData.filter(elem => elem.label === classFilterLabels[2]);

      expect(filterData.length).toEqual(6);
      expect(filterObj[0].label).toEqual(classFilterLabels[2]);
      expect(filterObj[0].updatedLabel).toEqual(classFilterLabels[2]);
      expect(filterObj[0].count).toEqual("2/2");
      done();
    });

    it('#getFilterObject should check the empty map.', (done) => {
      let data: Map<string, {counts: string, isVisible: boolean}> = new Map();  
      let filterData = FiltersUtils.getFilterObject(data, 'class');   
      expect(filterData.length).toEqual(0); 
      done();
     });
  
});