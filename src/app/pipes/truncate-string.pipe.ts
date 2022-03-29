import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateString'
})
export class TruncateStringPipe implements PipeTransform {

  transform(str: any,maxLen: number, position: string = 'middle'): any {
    if (str.length <= maxLen) return str;
    let separator = '...';
    let sepLen = separator.length,
        charsToShow = maxLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    if (position == 'start') {
        frontChars = 0;
        backChars = charsToShow;
        separator = '...';
    } else if (position == 'end') {
        frontChars = charsToShow;
        backChars = 0;
        separator = '...';
    } else if (position == 'end-space') {
        frontChars = charsToShow;
        backChars = 0;
        separator = '  ...';
      } else if(position == 'truncat-end') {
        let txt = str.substr(0, maxLen) + separator;
        console.log(txt);
        return txt;
    }

    return str.substr(0, frontChars).charAt(0).toUpperCase() +
        separator + str.substr(str.length - backChars).toLowerCase();
  }

}
