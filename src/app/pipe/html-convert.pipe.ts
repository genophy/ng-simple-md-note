import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer}        from '@angular/platform-browser';

@Pipe({
  name: 'htmlConvert',
})
export class HtmlConvertPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {

  }

  transform(value: any, args?: any): any {
    if (value) {
      const res = value.replace(/\r\n/g, '<br/>').replace(/\r/g, '<br/>').replace(/\n/g, '<br/>');
      return this.sanitizer.bypassSecurityTrustHtml(res);
    }
    return '';
  }

}
