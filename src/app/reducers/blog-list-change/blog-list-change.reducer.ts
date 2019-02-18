import {createEntityAdapter, EntityAdapter, EntityState}  from '@ngrx/entity';
import {BlogListChangeActions, BlogListChangeActionTypes} from './blog-list-change.actions';
import {BlogListChange}                                   from './blog-list-change.model';
import {createFeatureSelector} from '@ngrx/store';

export interface State extends EntityState<BlogListChange> {
  // additional entities state properties
}

export const adapter: EntityAdapter<BlogListChange> = createEntityAdapter<BlogListChange>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties

  ids     : ['blog-list-change'],
  entities: {
    'blog-list-change': {
      id   : 'blog-list-change',
      changeFlag: false,
    },
  },
});

export function blogListChangeReducer(
  state = initialState,
  action: BlogListChangeActions,
): State {
  switch (action.type) {

    case BlogListChangeActionTypes.UpdateBlogListChange: {
      return adapter.updateOne(action.payload.blogListChange, state);
    }

    default: {
      return state;
    }
  }
}

export const getBlogListChangeState = createFeatureSelector<State>('blogListChange');

export const {
               selectIds,
               selectEntities,
               selectAll,
               selectTotal,
             } = adapter.getSelectors(getBlogListChangeState);
