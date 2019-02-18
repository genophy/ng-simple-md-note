import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment}                   from '../../environments/environment';
import {blogListChangeReducer}         from './blog-list-change/blog-list-change.reducer';

export const reducers: ActionReducerMap<any> = {
  'blogListChange': blogListChangeReducer,
};

export const metaReducers: MetaReducer<any>[] = !environment.production ? [] : [];
