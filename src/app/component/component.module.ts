import {CommonModule}                                                                from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule}                                            from '@angular/core';
import {FormsModule, ReactiveFormsModule}                                            from '@angular/forms';
import {LibraryModule}                                                               from '../library/library.module';
import {PipeModule}                                                                  from '../pipe/pipe.module';
import {ModalConfirmComponent, ModalLoadingComponent, ModalWebTimeoutErrorComponent} from './modal';
import {DialogContainerComponent}                                                    from './modal/dialog-container/dialog-container.component';
import {DialogEncapsulationComponent}                                                from './modal/dialog-container/dialog-encapsulation/dialog-encapsulation.component';

const components = [
  ModalConfirmComponent,
  ModalLoadingComponent,
  ModalWebTimeoutErrorComponent,
  DialogEncapsulationComponent,
  DialogContainerComponent];

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    PipeModule,
    ReactiveFormsModule,
    LibraryModule,
  ],
  declarations   : components,
  entryComponents: components,
  exports        : components,
  providers      : [],
  schemas        : [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule {
}
