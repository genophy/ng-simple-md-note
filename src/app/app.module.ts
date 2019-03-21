import {NgModule}                         from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule}                    from '@angular/platform-browser';
import {BrowserAnimationsModule}          from '@angular/platform-browser/animations';
import {StoreModule}                      from '@ngrx/store';
import {StoreDevtoolsModule}              from '@ngrx/store-devtools';
import {FileUploadModule}                 from 'ng2-file-upload';
import {LMarkdownEditorModule}            from 'ngx-markdown-editor';
import {DirectiveModule}                  from '../directive/directive.module';
import {environment}                      from '../environments/environment';

import {AppRoutingModule}             from './app-routing.module';
import {AppComponent}                 from './app.component';
import {ComponentModule}              from './component/component.module';
import {LibraryModule}                from './library/library.module';
import {AboutComponent}               from './page/account/about/about.component';
import {SetAccountComponent}          from './page/account/settings/set-account/set-account.component';
import {SetCategoryComponent}         from './page/account/settings/set-category/set-category.component';
import {SetPwdComponent}              from './page/account/settings/set-pwd/set-pwd.component';
import {SettingsComponent}            from './page/account/settings/settings.component';
import {BlankComponent}               from './page/blank/blank.component';
import {BlogDiscussLineComponent}     from './page/blog/blog-discuss/blog-discuss-line/blog-discuss-line.component';
import {BlogDiscussListItemComponent} from './page/blog/blog-discuss/blog-discuss-list/blog-discuss-list-item/blog-discuss-list-item.component';
import {BlogDiscussListComponent}      from './page/blog/blog-discuss/blog-discuss-list/blog-discuss-list.component';
import {BlogEditorComponent}           from './page/blog/blog-editor/blog-editor.component';
import {BlogMdEditorComponent}         from './page/blog/blog-md-editor/blog-md-editor.component';
import {BlogMdViewerContentComponent}  from './page/blog/blog-md-viewer/blog-md-viewer-content/blog-md-viewer-content.component';
import {BlogMdViewerComponent}         from './page/blog/blog-md-viewer/blog-md-viewer.component';
import {BlogPrintViewContentComponent} from './page/blog/blog-print-view-content/blog-print-view-content.component';
import {BlogRoughListItemComponent}    from './page/blog/blog-rough-list/blog-rough-list-item/blog-rough-list-item.component';
import {BlogRoughListComponent}        from './page/blog/blog-rough-list/blog-rough-list.component';
import {BlogViewerComponent}           from './page/blog/blog-viewer/blog-viewer.component';
import {MyBlogListItemComponent}       from './page/blog/my-blog-list/my-blog-list-item/my-blog-list-item.component';
import {MyBlogListComponent}           from './page/blog/my-blog-list/my-blog-list.component';
import {LoginComponent}          from './page/login/login.component';
import {RegisterComponent}       from './page/login/register/register.component';
import {MainComponent}           from './page/main/main.component';
import {PipeModule}              from './pipe/pipe.module';
import {metaReducers, reducers}  from './reducers';

const components = [
  AboutComponent,
  AppComponent,
  BlankComponent,
  BlogDiscussLineComponent,
  BlogDiscussListComponent,
  BlogDiscussListItemComponent,
  BlogEditorComponent,
  BlogMdEditorComponent,
  BlogMdViewerComponent,
  BlogRoughListComponent,
  BlogRoughListItemComponent,
  BlogViewerComponent,
  LoginComponent,
  MainComponent,
  MyBlogListComponent,
  MyBlogListItemComponent,
  RegisterComponent,
  SetAccountComponent,
  SetCategoryComponent,
  SetPwdComponent,
  SettingsComponent,
  BlogMdViewerContentComponent,
  BlogPrintViewContentComponent
];

@NgModule({
  declarations   : components,
  entryComponents: components,
  imports        : [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ComponentModule,
    DirectiveModule,
    FileUploadModule,
    FormsModule,
    LibraryModule,
    PipeModule,
    LMarkdownEditorModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers      : [],
  bootstrap      : [AppComponent],
})
export class AppModule {
}
