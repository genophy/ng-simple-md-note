import {Injectable}    from '@angular/core';
import {HttpHelperLib} from '../library/http-helper.lib';

const blogUrl = '/api/json/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  constructor(private httpHelper: HttpHelperLib) {
  }

  queryAll(params = {}) {
    return this.httpHelper.postWithFn(blogUrl, 'queryAll', params);
  }

  /**
   *
   * @param title
   * @param content
   * @param category_id
   */
  insert(title, content, category_id) {
    return this.httpHelper.postWithFn(blogUrl, 'insert', {title, content, category_id});
  }

  /**
   *
   * @param params
   */
  update(params = {}) {
    return this.httpHelper.postWithFn(blogUrl, 'update', params);
  }

  /**
   *
   * @param params
   */
  updateBlogWatched(params = {}) {
    return this.httpHelper.postWithFn(blogUrl, 'updateBlogWatched', params);
  }

  /**
   *
   * @param id
   */
  del(id) {
    return this.httpHelper.postWithFn(blogUrl, 'del', {id: id});
  }

}
