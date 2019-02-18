import {Injectable}    from '@angular/core';
import {HttpHelperLib} from '../library/http-helper.lib';
import {Utils}         from '../util/utils';

const accountUrl = '/api/json/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  constructor(private httpHelper: HttpHelperLib) {
  }

  /**
   *
   * @param params (pageSize,pageNum)
   */
  queryAll(params) {
    return this.httpHelper.postWithFn(accountUrl, 'queryAll', params);
  }

  /**
   *
   * @param name
   * @param pwd
   */
  queryByNamePwd(name, pwd) {
    return this.httpHelper.postWithFn(accountUrl, 'queryByNamePwd', {name, pwd});
  }

  /**
   *
   * @param name
   * @param pwd
   */
  login(name, pwd) {
    return this.httpHelper.postWithFn(accountUrl, 'login', {name, pwd});
  }

  /**
   *
   * @param token
   */
  logout(token) {
    return this.httpHelper.postWithFn(accountUrl, 'logout', {token: token});
  }

  /**
   *
   * @param name
   */
  queryByName(name) {
    return this.httpHelper.postWithFn(accountUrl, 'queryByName', {name});
  }

  /**
   *
   * @param name
   * @param pwd
   * @param img_id
   */
  accountInsert(name, pwd, img_id?) {
    return this.httpHelper.postWithFn(accountUrl, 'accountInsert', {name, pwd, img_id});
  }

  /**
   *
   * @param id
   * @param params (name,pwd,img_id)
   */
  update(token, params) {
    return this.httpHelper.postWithFn(accountUrl, 'update', Utils.objConcat(params, {token: token}));
  }

  del(id) {
    return this.httpHelper.postWithFn(accountUrl, 'del', {id});
  }
}
