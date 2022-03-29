import { PipeTransform, Pipe } from '@angular/core';
import { FilterProcessService } from '../services/filters/filter-process.service';

@Pipe({ name: 'filterIconSelection' })
export class FilterIconSelection implements PipeTransform {
    constructor(private filterProcessService: FilterProcessService) { }

    transform(value: boolean, filterVal: string, filterType: string, countVal: string, type: string): string {
        if (type === 'child') {
            return this.getChildIcon(value, filterVal, filterType, countVal);
        } else {
            return this.getParentIcon(value, filterType, countVal);
        }
    }

    private getChildIcon(isVisible: boolean, filterVal: string, filterType: string, countVal: string) {
        let retVal = 'enabled_icon';
        let filterArr = this.filterProcessService.filterObj.get(filterType);
        // if(!isVisible) {
        //     retVal = 'visible_icon';
        if (filterArr && countVal.trim().startsWith('0')) {
            if (filterArr.length > 0 && filterArr.includes(filterVal)) {
                retVal = 'visible_icon';
            } else {
                // alert('pipe diable icon: type: ' + filterType);
                retVal = 'disabled_icon';
            }
        }
        // }        
        retVal = this.getImageIcon(retVal);
        return retVal;
    }

    private getParentIcon(isVisible: boolean, filterType: string, countVal: string) {
        let retVal = 'enabled_icon';
        let filterArr = this.filterProcessService.filterObj.get(filterType);
        if(!isVisible) {
            retVal = 'visible_icon';
            if (filterArr && filterArr.length > 0) {
                retVal = 'visible_icon';
            }
        // else if(countVal.trim().startsWith('0')) {
        //     retVal = 'disabled_icon';
        // }            
        }
        // retVal = retVal +'_parent';
        retVal = this.getImageIcon(retVal);
        return retVal;
    }

    private getImageIcon(type) {
        switch (type) {
            case 'enabled_icon': return 'assets/icons/view.svg';
            case 'visible_icon': return 'assets/icons/hide.svg';
            case 'disabled_icon': return 'assets/icons/disabled_hide.svg';
            default: return;
        }
    }
}