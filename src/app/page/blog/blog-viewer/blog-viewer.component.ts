import {Component, OnInit}      from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import hljs                     from 'highlight.js/lib/highlight';
import * as marked              from 'marked';
import {BlogService}            from '../../../api/blog.service';
import {Constants}              from '../../../util/constants';
import {CookieUtil}             from '../../../util/cookie-util';

@Component({
  selector   : 'app-blog-viewer',
  templateUrl: './blog-viewer.component.html',
  styleUrls  : ['./blog-viewer.component.scss'],
})
export class BlogViewerComponent implements OnInit {
  blogInfo = {};
  mdContent = '';
  isForCurrentUser;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService) {
    hljs.initHighlightingOnLoad();
    marked.setOptions({
      renderer   : new marked.Renderer(),
      highlight  : function(code) {
        hljs.configure({
          classPrefix: 'hljs', useBR: true,

        });
        hljs.initHighlighting();
        return hljs.highlightAuto(code).value;
      },
      pedantic   : false,
      gfm        : true,
      tables     : true,
      breaks     : true,
      sanitize   : true,
      smartLists : true,
      smartypants: true,
      langPrefix : 'hljs-lang-',
      xhtml      : true,
    });

  }

  ngOnInit() {

    const id = this.activatedRoute.params['value']['id'];
    const userInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO) || '{}');

    this.blogService.queryAll({id: id}).then(returnData => {
      this.blogInfo = returnData[0];

      this.mdContent = marked(this.blogInfo['content']);

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
}
