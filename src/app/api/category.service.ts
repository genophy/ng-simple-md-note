import {Injectable}    from '@angular/core';
import {HttpHelperLib} from '../library/http-helper.lib';

const categoryUrl = '/api/json/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private httpHelper: HttpHelperLib) {
  }

  queryAll(params = {}) {
    return this.httpHelper.postWithFn(categoryUrl, 'queryAll', params);
  }

  queryAllWithBlogCount(params = {}) {
    return this.httpHelper.postWithFn(categoryUrl, 'queryAllWithBlogCount', params);
  }

  /**
   *
   * @param name
   */
  insert(name) {
    return this.httpHelper.postWithFn(categoryUrl, 'insert', {name});
  }

  /**
   *
   * @param id
   */
  del(id) {
    return this.httpHelper.postWithFn(categoryUrl, 'del', {id});
  }
}
