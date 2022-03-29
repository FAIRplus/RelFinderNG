import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyjson'
})
export class PrettyjsonPipe implements PipeTransform {

  transform(value: any): any {
    try {
      if (value) {
        let obj = JSON.parse(value);
        return JSON.stringify(obj, undefined, 4)
          .replace(/ /g, '&nbsp;')
          .replace(/\n/g, '<br/>');
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }

}
