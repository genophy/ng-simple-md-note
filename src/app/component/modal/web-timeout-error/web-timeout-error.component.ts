import {Component, OnInit} from '@angular/core';

/**
 * 网络超时页面
 */
@Component({
  selector   : 'app-modal-web-timeout-error',
  templateUrl: './web-timeout-error.component.html',
  styleUrls  : ['./web-timeout-error.component.scss'],
})
export class ModalWebTimeoutErrorComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * 刷新页面
   */
  refreshPage() {
    document.location.reload();
  }
}
