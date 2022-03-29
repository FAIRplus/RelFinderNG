import { Utils } from './common.utils';

export class FiltersUtils {

    public static getFilterObject(filterData: Map<string, {counts: string, isVisible: boolean}>, filterType: string): Array<any> {
      let filteredData = [];
      if(filterData && filterData.size > 0) {
        for (let [key, value] of filterData) {
          let updatedLabel = Utils.truncateString(key, 12, 'start');      
          let obj = {label: key, count: value.counts, selected: value.isVisible, updatedLabel: updatedLabel, filterType: filterType};
          filteredData.push(obj);
        }
      }
      return filteredData;
    }
}