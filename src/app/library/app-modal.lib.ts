import {Injectable, Renderer2, Type}                                                 from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar}                       from '@angular/material';
import {ModalConfirmComponent, ModalLoadingComponent, ModalWebTimeoutErrorComponent} from '../component/modal';

import {DialogContainerComponent} from '../component/modal/dialog-container/dialog-container.component';
import {Utils}                    from '../util/utils';
import {DialogParams}             from './material-ui/dialog-scope/dialog-params';
import {ScopeDialog}              from './material-ui/dialog-scope/scope-dialog';
import {ScopeSnackbar}            from './material-ui/dialog-scope/scope-snackbar';

@Injectable({
  providedIn: 'root',
})
export class AppModalLib {

  /**
   * 加载loading的对象
   */
  loadingDialog: MatDialogRef<any>;
  /**
   * 加载loading的timeout对象
   */
  loadingTimeout;

  /**
   * 构造方法
   * @param {ScopeDialog} scopeDialog 自定义的局部对话框
   * @param {MatDialog} dialog material的对话框
   * @param {ScopeSnackbar} scopeSnackbar 自定义的局部snackbar
   * @param {MatSnackBar} snackbar material的snackbar
   */
  constructor(
    private scopeDialog: ScopeDialog,
    private dialog: MatDialog,
    private scopeSnackbar: ScopeSnackbar,
    private snackbar: MatSnackBar,
  ) {
  }

  /**
   * 打开对话框
   *
   * @param {Type<any>} component 需要打开的模块
   * @param {DialogParams} dialogParams 模块对应的参数params ,若没有elementRef，则打开全局组件
   * @param {{}} options options 自定义配置
   * @returns {Promise<any>} 返回关闭后的Promise,子页面需继承RouteBoxWrap,通过 this.dialogParams.getParams()获取params值
   */
  openDialog(
    component: Type<any>,
    dialogParams: DialogParams,
    options = {},
  ): Promise<any> {
    // 若没有设置样式，则默认是对话框panel。
    if (!options['panelClass']) {
      options['panelClass'] = 'app-modal-dialog-panel';
    }
    if (dialogParams.getElementRef() && dialogParams.getRenderer2()) {
      return this.openScopeDialog(component, dialogParams, options);
    } else {
      return this.openGlobalDialog(component, dialogParams, options);
    }

  }

  /**
   *
   * @param dialogParams
   */
  openAlert(dialogParams: DialogParams) {
    dialogParams.setParams('hiddenCancel', true);
    return this.openConfirm(dialogParams);
  }

  /**
   *
   * @param dialogParams
   */
  openAlertError(dialogParams: DialogParams) {
    dialogParams.setParams('hiddenCancel', true);
    dialogParams.setParams('isError', true);
    return this.openConfirm(dialogParams);
  }

  /**
   *
   * @param dialogParams
   */
  openConfirm(dialogParams: DialogParams) {
    if (dialogParams.getElementRef() && dialogParams.getRenderer2()) {
      return this.openScopeConfirm(dialogParams);
    } else {
      return this.openGlobalConfirm(dialogParams);
    }
  }

  /**
   *
   * @param component
   * @param dialogParams
   */
  openWindow(
    component: Type<any>,
    dialogParams: DialogParams,
  ): Promise<any> {
    const config = new MatDialogConfig();
    config.minWidth = '100%'; // 给折叠按钮腾出空间
    config.height = '100%';
    config.maxHeight = '100%';
    config.hasBackdrop = false;
    config.panelClass = 'app-modal-window-panel';
    return this.openDialog(component, dialogParams, config);
  }

  /**
   * @param {DialogParams} dialogParams ({msg:string,duration:number=3000})
   * @returns {Promise<any>}
   */
  openSnackBar(dialogParams: DialogParams) {
    if (dialogParams.getElementRef() && dialogParams.getRenderer2()) {
      return this.openScopeSnackBar(dialogParams);
    } else {
      return this.openGlobalSnackBar(dialogParams);
    }
  }

  /**
   * @param {number} duration 默认5秒
   * @returns {Promise<MatSnackBarDismiss>}
   */
  openSnackBarForWebTimeoutError(duration = 3000) {
    const snackBarRef = this.snackbar.openFromComponent(ModalWebTimeoutErrorComponent, {
      duration  : duration,
      panelClass: 'snack-bar-white-theme',
    });
    return snackBarRef.afterDismissed().toPromise();
  }

  /**
   *
   * @param dialogParams
   */
  openLoading(dialogParams: DialogParams): void {
    if (this.loadingTimeout) {
      this.closeLoading();
    }
    dialogParams.mergeParams('duration', 30000, false);
    dialogParams.mergeParams('overlay', false, false);
    dialogParams.mergeParams('disableClose', true, false);
    const duration = dialogParams.getParams()['duration'];
    const overlay = dialogParams.getParams()['overlay'];
    const disableClose = dialogParams.getParams()['disableClose'];

    if (dialogParams.getElementRef() && dialogParams.getRenderer2()) {
      this.openScopeLoading(
        duration,
        dialogParams.getElementRef().nativeElement,
        dialogParams.getRenderer2(),
        overlay,
        disableClose,
      );
    } else {
      this.openGlobalLoading(duration, overlay, disableClose);
    }

  }

  /**
   *
   */
  closeLoading(): void {
    if (this.loadingDialog && this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = undefined;
      this.loadingDialog.close();
    }
  }

  /**
   *
   * @param dialogParams
   */
  private openScopeSnackBar(
    dialogParams: DialogParams,
  ): Promise<any> {
    dialogParams.mergeParams('duration', 3000, false);
    const msg = dialogParams.getParams()['msg'];
    const duration = dialogParams.getParams()['duration'];
    this.scopeSnackbar.setContainerElement(dialogParams.getElementRef().nativeElement, dialogParams.getRenderer2());
    const snackBarRef = this.scopeSnackbar.open(msg, '', {
      duration          : duration,
      horizontalPosition: 'center',
    });
    return snackBarRef.afterDismissed().toPromise();
  }

  /**
   *
   * @param dialogParams
   */
  private openGlobalSnackBar(dialogParams: DialogParams): Promise<any> {
    dialogParams.mergeParams('duration', 3000, false);
    const msg = dialogParams.getParams()['msg'];
    const duration = dialogParams.getParams()['duration'];
    const snackBarRef = this.snackbar.open(msg, '', {
      duration          : duration,
      horizontalPosition: 'center',
    });
    return snackBarRef.afterDismissed().toPromise();
  }

  /**
   *
   * @param dialogParams
   */
  private openScopeConfirm(dialogParams: DialogParams) {
    this.scopeDialog.setContainerElement(
      dialogParams.getElementRef().nativeElement,
      dialogParams.getRenderer2(),
    );
    const config = new MatDialogConfig();
    config.data = dialogParams.getParams();
    config.maxHeight = '100%';
    config.hasBackdrop = true;
    config.disableClose = true;
    config.autoFocus = false;
    config.panelClass = 'app-modal-dialog-panel';

    const tmpOverFlowX = dialogParams.getElementRef().nativeElement.style.overflowX;
    const tmpOverFlowY = dialogParams.getElementRef().nativeElement.style.overflowY;
    dialogParams.getElementRef().nativeElement.style.overflowX = 'hidden';
    dialogParams.getElementRef().nativeElement.style.overflowY = 'hidden';

    const dialogRef = this.scopeDialog.open(ModalConfirmComponent, config);
    //  是否刚加载
    let openStartFlag = true;
    // 500毫秒后才允许关闭，取消刚加载完成标志
    const tOut = setTimeout(() => {
      openStartFlag = false;
    }, 500);
    // 阴影点击
    dialogRef.backdropClick().subscribe(event => {
      if (!openStartFlag) {
        dialogRef.close();
      }
    });
    return dialogRef.afterClosed().toPromise().then(value => {
      dialogParams.getElementRef().nativeElement.style.overflowX = tmpOverFlowX;
      dialogParams.getElementRef().nativeElement.style.overflowY = tmpOverFlowY;
      if (tOut) {
        clearTimeout(tOut);
      }
      return value;
    });
  }

  /**
   *
   * @param dialogParams
   */
  private openGlobalConfirm(dialogParams: DialogParams) {
    const config = new MatDialogConfig();
    config.data = dialogParams.getParams();
    config.maxHeight = '100%';
    config.hasBackdrop = true;
    config.disableClose = true;
    config.autoFocus = false;
    config.panelClass = 'app-modal-dialog-panel';
    const dialogRef = this.dialog.open(ModalConfirmComponent, config);
    //  是否刚加载
    let openStartFlag = true;
    // 500毫秒后才允许关闭，取消刚加载完成标志
    const tOut = setTimeout(() => {
      openStartFlag = false;
    }, 500);
    // 阴影点击
    dialogRef.backdropClick().subscribe(event => {
      if (!openStartFlag) {
        dialogRef.close();
      }
    });
    return dialogRef.afterClosed().toPromise().then(value => {
      if (tOut) {
        clearTimeout(tOut);
      }
      return value;
    });
  }

  /**
   *
   * @param duration
   * @param nativeElement
   * @param renderer2
   * @param overlay
   * @param disableClose
   */
  private openScopeLoading(
    duration: number      = 30000,
    nativeElement: HTMLElement,
    renderer2: Renderer2,
    overlay: boolean      = false,
    disableClose: boolean = true,
  ): void {
    if (this.loadingTimeout) {
      this.closeLoading();
    }
    this.scopeDialog.setContainerElement(nativeElement, renderer2);
    const config = new MatDialogConfig();
    config.minWidth = '100%';
    config.hasBackdrop = true;
    config.disableClose = true;
    config.autoFocus = false;
    config.position = {top: '0'};
    if (!overlay) {
      config.backdropClass = 'background:none;';
    }
    config.disableClose = disableClose;
    this.loadingDialog = this.scopeDialog.open(ModalLoadingComponent, config);

    this.loadingTimeout = setTimeout(() => {
      this.loadingDialog.close();
      this.loadingTimeout = undefined;
    }, duration);

  }

  /**
   *
   * @param duration
   * @param overlay
   * @param disableClose
   */
  private openGlobalLoading(duration: number = 30000, overlay: boolean = false, disableClose: boolean = true): void {
    if (this.loadingTimeout) {
      this.closeLoading();
    }
    const config = new MatDialogConfig();
    config.minWidth = '100%';
    config.hasBackdrop = true;
    config.disableClose = true;
    config.autoFocus = false;
    config.position = {top: '0'};
    if (!overlay) {
      config.backdropClass = 'background:none;';
    }
    config.disableClose = disableClose;
    this.loadingDialog = this.dialog.open(ModalLoadingComponent, config);
    this.loadingTimeout = setTimeout(() => {
      this.loadingDialog.close();
      this.loadingTimeout = undefined;
    }, duration);
  }

  /**
   *
   * @param component
   * @param dialogParams
   * @param options
   */
  private openScopeDialog(
    component: Type<any>,
    dialogParams: DialogParams,
    options = {},
  ) {
    this.scopeDialog.setContainerElement(
      dialogParams.getElementRef().nativeElement,
      dialogParams.getRenderer2(),
    );
    const config = new MatDialogConfig();
    config.data = {
      'component'   : component,
      'dialogParams': dialogParams,
    };
    config.panelClass = 'overflow-y';
    config.maxWidth = '100%';
    config.maxHeight = '100%';
    config.hasBackdrop = true; // 有阴影
    config.disableClose = true; // 默认阴影部分不可关闭
    config.autoFocus = false;

    const configNew = Utils.objConcat(config, options);
    const dialogRef = this.scopeDialog.open(DialogContainerComponent, configNew);

    //  是否刚加载
    let openStartFlag = true;
    // 500毫秒后才允许关闭，取消刚加载完成标志
    const tOut = setTimeout(() => {
      openStartFlag = false;
    }, 500);
    // 阴影点击
    dialogRef.backdropClick().subscribe(event => {
      if (!openStartFlag) {
        dialogRef.close();
      }
    });
    return dialogRef.afterClosed().toPromise().then((value => {
      // nElement.style.overflow = tmpOverFlow;
      if (tOut) {
        clearTimeout(tOut);
      }
      return value;
    }));
  }

  /**
   * 打开全局对话框(大小固定)
   *
   * 采用的是dialog-container页面作为主页面
   *
   * @param {Type<any>} component 需要打开的模块
   * @param {{}} params 模块对应的参数
   * @param {MatDialogConfig} options 自定义配置
   * @returns {Promise<any>} 返回关闭后的Promise
   */
  private openGlobalDialog(
    component: Type<any>,
    dialogParams: DialogParams,
    options = {},
  ): Promise<any> {
    const config = new MatDialogConfig();
    config.data = {
      'component'   : component,
      'dialogParams': dialogParams,
    };
    config.panelClass = 'overflow-y';
    config.maxHeight = '100%';
    config.hasBackdrop = true; // 有阴影
    config.disableClose = true; // 默认阴影部分不可关闭
    config.autoFocus = false;
    // 合并用户输入的options
    const configFinal = Utils.objConcat(config, options);
    const dialogRef = this.dialog.open(DialogContainerComponent, configFinal);
    //  是否刚加载
    let openStartFlag = true;
    // 500毫秒后才允许关闭，取消刚加载完成标志
    const tOut = setTimeout(() => {
      openStartFlag = false;
    }, 500);
    // 阴影点击
    dialogRef.backdropClick().subscribe(event => {
      if (!openStartFlag) {
        dialogRef.close();
      }
    });
    return dialogRef.afterClosed().toPromise().then(value => {
      if (tOut) {
        clearTimeout(tOut);
      }
      return value;
    });
  }
}
