import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'filterHeading'})
export class FilterHeading implements PipeTransform { 
    transform(value: string): string {
        let filterHeading = '';
        switch (value) {
        case 'class': {
            filterHeading = 'Object class';
            break;
        }
        case 'link': {
            filterHeading = 'Link type';
            break;
        }
        case 'length': {
            filterHeading = 'No of objects';
            break;
        }
        case 'connectivity': {
            filterHeading = 'Connectivity level';
            break;
        }
        }
        return filterHeading;
    }
}