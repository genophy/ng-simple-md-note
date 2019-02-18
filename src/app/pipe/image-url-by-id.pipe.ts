import {Pipe, PipeTransform} from '@angular/core';
import {Utils}               from '../util/utils';

@Pipe({
  name: 'imageUrlById',
})
export class ImageUrlByIdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value && Utils.getImageUrl(value);
  }

}
