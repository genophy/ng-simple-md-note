import {OverlayModule}              from '@angular/cdk/overlay';
import {CommonModule}               from '@angular/common';
import {NgModule}                   from '@angular/core';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
import {MaterialUiModule}           from '../material-ui.module';
import {ScopeDialog}                from './scope-dialog';
import {ScopeOverlay}               from './scope-overlay';
import {ScopeOverlayContainer}      from './scope-overlay-container';
import {ScopeSnackbar}              from './scope-snackbar';

/**
 * 所有ScopeDialog类
 * @type {(ScopeDialog | ScopeOverlay | ScopeOverlayContainer | ScopeSnackbar | {provide: InjectionToken<MatDialogConfig<any>>; useValue: {hasBackdrop: boolean}})[]}
 */
const comps = [
  ScopeDialog,
  ScopeOverlay,
  ScopeOverlayContainer,
  ScopeSnackbar,
  {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
];

@NgModule({
  imports     : [
    CommonModule,
    OverlayModule,
    MaterialUiModule,
  ],
  declarations: [],
  providers   : comps,
})
export class ScopeDialogModule {
}
