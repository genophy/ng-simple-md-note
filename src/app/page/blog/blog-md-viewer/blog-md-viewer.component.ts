import {Component, OnInit}      from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService}            from '../../../api/blog.service';
import {Constants}              from '../../../util/constants';
import {CookieUtil}             from '../../../util/cookie-util';

@Component({
  selector   : 'app-blog-md-viewer',
  templateUrl: './blog-md-viewer.component.html',
  styleUrls  : ['./blog-md-viewer.component.scss'],
})
export class BlogMdViewerComponent implements OnInit {

  blogInfo = {};
  mdContent = '';
  isForCurrentUser;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService) {
  }

  ngOnInit() {

    const id = this.activatedRoute.params['value']['id'];
    const userInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO) || '{}');

    this.blogService.queryAll({id: id}).then(returnData => {
      this.blogInfo = returnData[0];

      this.mdContent = this.blogInfo['content'].slice();

      this.isForCurrentUser = userInfo['id'] === this.blogInfo['create_user_id'];
      if (!this.isForCurrentUser) {
        this.watched(this.blogInfo['id'], this.blogInfo['watched'] + 1);
      }
    }).catch(errorData => {
      throw errorData;
    });

  }

  watched(id, watchedCount) {
    this.blogService.updateBlogWatched({id: id, watched: watchedCount}).then(returnData => {
    }).catch(errorData => {
    });
  }

  btnGotoEditBlog() {
    this.router.navigateByUrl(`/main/blog-md-editor/${this.blogInfo['id']}`);
  }

  btnGotoPrevPage() {

    window.history.back();
  }

  btnPrint() {
    this.router.navigateByUrl(`/blog-print-view-content/${this.blogInfo['id']}`);
  }
}
