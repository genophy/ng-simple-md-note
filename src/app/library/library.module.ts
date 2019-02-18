import {HttpClientModule}                 from '@angular/common/http';
import {NgModule}                         from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialUiModule}                 from './material-ui/material-ui.module';

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialUiModule,
  ],
  exports: [MaterialUiModule],
})
export class LibraryModule {
}
