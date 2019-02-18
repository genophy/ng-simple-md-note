import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable}              from '@angular/core';
import {MatDialog}               from '@angular/material';
import {ActivatedRoute, Router}  from '@angular/router';
import {retry, timeout}          from 'rxjs/operators';
import {ApiUtil}                 from '../util/api-util';
import {Constants}               from '../util/constants';
import {CookieUtil}              from '../util/cookie-util';
import {AppModalLib}             from './app-modal.lib';
import {DialogParams}            from './material-ui/dialog-scope/dialog-params';

@Injectable({
  providedIn: 'root',
})
export class HttpHelperLib {

  /**
   *
   * @param httpClient
   * @param router
   * @param appModal
   * @param matDialog
   */
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appModal: AppModalLib,
    private matDialog: MatDialog,
  ) {
  }

  /**
   *
   * @param url
   * @param fnName
   * @param params
   */
  getWithFn(url, fnName, params?) {
    return this.get(url, {fn: fnName, data: params});
  }

  /**
   *
   * @param url
   * @param params
   */
  get(url, params?) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(url, params).pipe(timeout(1000 * 30), retry(1)).subscribe(value => {

        const res = ApiUtil.responseStatus(value);
        if (res.isSuccess) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      }, err => {
        if (err['name']) {
          reject({
            returnCode: '-1',
            returnData: null,
            returnMsg : err['name'] === '"TimeoutError"' ? 'timeout' : err['msg'],
          });
        }
        this.appModal.openSnackBarForWebTimeoutError(5000);
      });
    });

  }

  postWithFn(url, fnName, params?) {
    return this.post(url, {fn: fnName, data: params});
  }

  /**
   *
   * @param url
   * @param params
   */
  post(url, params?): Promise<any> {

    return new Promise((resolve, reject) => {

      this.httpClient.post(url, params, {headers: new HttpHeaders().set(Constants.COOKIE_USER_TOKEN, CookieUtil.cookie('token'))})
      .pipe(timeout(1000 * 30), retry(1))
      .subscribe(value => {

        const res = ApiUtil.responseStatus(value);

        if (res.isSuccess) {
          resolve(res.data);
        } else {

          // not auth
          if (0 === res.code) {
            CookieUtil.cookie(Constants.COOKIE_USER_INFO, '');
            CookieUtil.cookie(Constants.COOKIE_USER_TOKEN, '');
            this.router.navigateByUrl('/login', {relativeTo: this.activatedRoute.root});
            this.appModal.openSnackBar(DialogParams.newInstance({msg: 'Please Login!!!'}));
          } else {
            reject(res.data);
          }

        }
      }, err => {
        if (err['name']) {
          reject({
            returnCode: '-1',
            returnData: null,
            returnMsg : err['name'] === '"TimeoutError"' ? 'timeout' : err['msg'],
          });

        }

        this.appModal.openSnackBarForWebTimeoutError(5000);
      });
    });
  }
}
