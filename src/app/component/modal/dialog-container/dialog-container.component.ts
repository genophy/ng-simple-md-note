import {Component, Inject, Type}       from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogParams}                  from '../../../library/material-ui/dialog-scope/dialog-params';

/**
 *
 */
@Component({
  selector   : 'app-dialog-container',
  templateUrl: './dialog-container.component.html',
  styleUrls  : ['./dialog-container.component.scss'],
})
export class DialogContainerComponent {

  component;

  dialogParams: DialogParams;

  /**
   *
   * @param dialogRef
   * @param data
   */
  constructor(
    private dialogRef: MatDialogRef<Type<any>>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.component = data['component'];
    this.dialogParams = data['dialogParams'];
  }

  /**
   *
   * @param event
   */
  close(event) {
    this.dialogRef.close(event);
  }
}
