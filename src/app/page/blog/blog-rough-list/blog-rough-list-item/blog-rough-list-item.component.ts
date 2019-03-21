import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Router}                               from '@angular/router';
import hljs                                   from 'highlight.js/lib/highlight';
import * as marked                            from 'marked';
import {BlogService}                          from '../../../../api/blog.service';
import {AppModalLib}                          from '../../../../library/app-modal.lib';
import {DialogParams}                         from '../../../../library/material-ui/dialog-scope/dialog-params';
import {BlogListChangeHelper}                 from '../../../../reducers/blog-list-change/blog-list-change-helper.service';
import {Constants}                            from '../../../../util/constants';
import {CookieUtil}                           from '../../../../util/cookie-util';

@Component({
  selector   : 'app-blog-rough-list-item',
  templateUrl: './blog-rough-list-item.component.html',
  styleUrls  : ['./blog-rough-list-item.component.scss'],
})
export class BlogRoughListItemComponent implements OnInit {
  mdContent = '';
  @Input()
  itemInfo = {};

  isForCurrentUser;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private appModal: AppModalLib,
    private blogListChangeHelper: BlogListChangeHelper,
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
    const userInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO) || '{}');

    this.isForCurrentUser = userInfo['id'] === this.itemInfo['create_user_id'];
    this.mdContent = marked(this.itemInfo['content'].slice(0, 128));
  }

  btnDeleteBlogByBlogId(blogId) {

    this.appModal.openConfirm(DialogParams.newInstance({
      msg           : 'Del this blog?',
      btnOkFnPromise: () => {
        return this._delBlogById(blogId);
      },
    }));

  }

  gotoBlogDetailForEdit() {
    this.router.navigateByUrl(`/main/blog-md-editor/${this.itemInfo['id']}`);
  }

  gotoBlogDetailForView() {
    this.router.navigateByUrl(`/main/blog-md-viewer/${this.itemInfo['id']}`);
  }

  private _delBlogById(blogId) {
    return new Promise(resolve => {
      this.blogService.del(blogId).then(returnData => {
        if (1 === returnData['affectedRows']) {
          this.appModal.openSnackBar(DialogParams.newInstance({
            msg: 'Del Success!!!',
          }));
          this.elementRef.nativeElement.remove();
          this.blogListChangeHelper.dispatch(true);
        } else {
          this.appModal.openSnackBar(DialogParams.newInstance({
            msg: 'Del Fail!!!',
          }));
        }
        resolve(true);
      }).catch(errorData => {
        this.appModal.openSnackBar(DialogParams.newInstance({
          msg: 'Del Error!!!',
        }));
        resolve(true);
      });
    });
  }
}
