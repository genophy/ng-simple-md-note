import {Update}         from '@ngrx/entity';
import {Action}         from '@ngrx/store';
import {BlogListChange} from './blog-list-change.model';

export enum BlogListChangeActionTypes {
  UpdateBlogListChange = '[BlogListChange] Update BlogListChange',
}

export class UpdateBlogListChange implements Action {
  readonly type = BlogListChangeActionTypes.UpdateBlogListChange;

  constructor(public payload: { blogListChange: Update<BlogListChange> }) {
  }
}

export type BlogListChangeActions = UpdateBlogListChange;
