import {Component, Inject, OnDestroy, OnInit, Type} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef}              from '@angular/material';

/**
 */
@Component({
  selector   : 'app-modal-confirm',
  templateUrl: './confirm.component.html',
  styleUrls  : ['./confirm.component.scss'],
})
export class ModalConfirmComponent implements OnInit, OnDestroy {
  /**
   */
  title = 'Confirm';
  /**
   */
  msg = '';
  /**
   */
  btnOkStr = 'Ok';
  /**
   */
  btnOkFnPromise: Function;
  /**
   */
  btnCancelStr = 'Cancel';
  /**
   */
  hiddenCancel = false;

  /**
   * @type {boolean}
   */
  clickDisabled = false;

  /**
   * @type {boolean}
   * @private
   */
  isError = false;

  /**
   * @type {number}
   */
  debounceSecondForClose = -1;

  /**
   */
  private _closeInterval;

  /**
   * @param {MatDialogRef<Type<any>>} dialogRef
   * @param data
   */
  constructor(
    private dialogRef: MatDialogRef<Type<any>>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    if (undefined !== data['title']) {
      this.title = data['title'];
    }
    if (undefined !== data['msg']) {
      this.msg = data['msg'];
    }
    if (undefined !== data['btnOkStr']) {
      this.btnOkStr = data['btnOkStr'];
    }
    if (undefined !== data['btnOkFnPromise']) {
      this.btnOkFnPromise = data['btnOkFnPromise'];
    }
    if (undefined !== data['btnCancelStr']) {
      this.btnCancelStr = data['btnCancelStr'];
    }
    if (undefined !== data['hiddenCancel']) {
      this.hiddenCancel = data['hiddenCancel'];
      if (undefined !== data['debounceSecondForClose']) {
        this.debounceSecondForClose = data['debounceSecondForClose'];
      }
    }
    if (undefined !== data['isError']) {
      this.isError = data['isError'];
    }
  }

  /**
   */
  ngOnInit() {
    if (0 < this.debounceSecondForClose) {
      this._closeInterval = setInterval(() => {
        // 若小于等于0，则关闭该提示框
        if (--this.debounceSecondForClose <= 0) {
          clearInterval(this._closeInterval);
          this.dialogRef.close(true);
        }
      }, 1000);
    }
  }

  /**
   */
  ngOnDestroy() {
    // 取消关闭
    if (0 < this.debounceSecondForClose && this._closeInterval) {
      clearInterval(this._closeInterval);
    }
  }

  /**
   */
  close(flag: boolean) {
    if (flag && undefined !== this.btnOkFnPromise) {
      this.clickDisabled = true;
      this.btnOkFnPromise().then((flag2) => {
        this.clickDisabled = false;
        this.dialogRef.close(undefined !== flag2 ? flag2 : flag);
      });
    } else {
      this.dialogRef.close(flag);
    }
  }

}
