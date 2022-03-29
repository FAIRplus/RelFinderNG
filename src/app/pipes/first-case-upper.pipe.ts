import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCaseUpper'
})
export class FirstCaseUpperPipe implements PipeTransform {

  transform(inputValue: any): any {
    return inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
  }

}
