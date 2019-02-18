import {EventEmitter, Input, Output} from '@angular/core';
import {DialogParams}                from '../../../library/material-ui/dialog-scope/dialog-params';

export class DialogInter {

  /**
   */
  @Input() dialogParams: DialogParams;

  /**
   *
   */
  @Output() protected eventHandler: EventEmitter<any> = new EventEmitter<any>();
  /**
   *
   */
  @Output() protected eventClose: EventEmitter<any> = new EventEmitter<any>();
}
