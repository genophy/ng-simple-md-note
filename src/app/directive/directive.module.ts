import {CommonModule}                     from '@angular/common';
import {NgModule}                         from '@angular/core';
import {ContainerEmptyCharacterDirective} from './container-empty-character.directive';

const directives = [
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
