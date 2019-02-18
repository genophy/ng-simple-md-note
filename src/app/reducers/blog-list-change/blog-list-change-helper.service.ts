import {Injectable}    from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable}    from 'rxjs';
import {map}           from 'rxjs/operators';

import {UpdateBlogListChange}  from './blog-list-change.actions';
import * as fromBlogListChange from './blog-list-change.reducer';

@Injectable({
  providedIn: 'root',
})
export class BlogListChangeHelper {

  constructor(private store: Store<any>) {
  }

  /**
   * 获取值
   * @returns {Promise<boolean>}
   */
  public select(): Observable<boolean> {
    return this.store.pipe(select(fromBlogListChange.selectAll)).pipe(map(value => value[0]['changeFlag']));
  }

  /**
   * 发送
   * @param {boolean} value
   */
  public dispatch(changeFlag: boolean): void {
    this.store.dispatch(new UpdateBlogListChange({
      blogListChange: {
        id     : 'blog-list-change',
        changes: {changeFlag},
      },
    }));
  }
}
