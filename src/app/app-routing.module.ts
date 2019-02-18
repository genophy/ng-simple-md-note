import {NgModule}               from '@angular/core';
import {RouterModule, Routes}   from '@angular/router';
import {AboutComponent}         from './page/account/about/about.component';
import {SetAccountComponent}    from './page/account/settings/set-account/set-account.component';
import {SetCategoryComponent}   from './page/account/settings/set-category/set-category.component';
import {SetPwdComponent}        from './page/account/settings/set-pwd/set-pwd.component';
import {SettingsComponent}      from './page/account/settings/settings.component';
import {BlankComponent}         from './page/blank/blank.component';
import {BlogEditorComponent}    from './page/blog/blog-editor/blog-editor.component';
import {BlogMdEditorComponent}  from './page/blog/blog-md-editor/blog-md-editor.component';
import {BlogMdViewerComponent}  from './page/blog/blog-md-viewer/blog-md-viewer.component';
import {BlogRoughListComponent} from './page/blog/blog-rough-list/blog-rough-list.component';
import {BlogViewerComponent}    from './page/blog/blog-viewer/blog-viewer.component';
import {MyBlogListComponent}    from './page/blog/my-blog-list/my-blog-list.component';
import {LoginComponent}         from './page/login/login.component';
import {MainComponent}          from './page/main/main.component';
import {AuthService}            from './service/auth.service';

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {
    path: 'main', component: MainComponent, children: [
      {path: '', redirectTo: 'blog-list', pathMatch: 'full'},
      {path: 'blog-list', component: BlogRoughListComponent},
      {path: 'my-blog-list', component: MyBlogListComponent, canActivate: [AuthService]},
      {path: 'blog-md-editor/:id', component: BlogMdEditorComponent, canActivate: [AuthService]},
      {path: 'blog-md-viewer/:id', component: BlogMdViewerComponent},
      {path: 'blog-editor/:id', component: BlogEditorComponent, canActivate: [AuthService]},
      {path: 'blog-viewer/:id', component: BlogViewerComponent},
      {
        path: 'settings', component: SettingsComponent, canActivate: [AuthService], children: [
          {path: '', redirectTo: 'set-account', pathMatch: 'full'},
          {path: 'set-account', component: SetAccountComponent},
          {path: 'set-category', component: SetCategoryComponent},
          {path: 'set-pwd', component: SetPwdComponent},
        ],
      },
      {path: 'about', component: AboutComponent},
      {path: '**', redirectTo: 'blog-list', pathMatch: 'full'},
    ],
  },
  {path: 'login', component: LoginComponent},
  {path: 'blank', component: BlankComponent},
  {path: '**', redirectTo: 'main', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
