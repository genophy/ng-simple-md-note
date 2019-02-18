import {CommonModule}                     from '@angular/common';
import {NgModule}                         from '@angular/core';
import {ContainerEmptyCharacterDirective} from './container-empty-character.directive';
import {ContentLimitTipDirective}         from './content-limit-tip.directive';

const directives = [
  ContentLimitTipDirective,
  ContainerEmptyCharacterDirective,
];

@NgModule({
  imports     : [
    CommonModule,
  ],
  declarations: directives,
  exports     : directives,

})
export class DirectiveModule {
}
