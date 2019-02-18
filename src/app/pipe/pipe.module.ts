import {NgModule}         from '@angular/core';
import {HtmlConvertPipe}  from './html-convert.pipe';
import {ImageUrlByIdPipe} from './image-url-by-id.pipe';

const pipes = [HtmlConvertPipe, ImageUrlByIdPipe];

@NgModule({
  declarations: pipes,
  exports     : pipes,
})
export class PipeModule {
}
