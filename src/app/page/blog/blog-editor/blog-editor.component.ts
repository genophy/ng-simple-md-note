import {Component, OnInit}                             from '@angular/core';
import {FormControl, FormGroup, Validators}            from '@angular/forms';
import {ActivatedRoute, Router}                        from '@angular/router';
import hljs                                            from 'highlight.js/lib/highlight';
import * as marked                                     from 'marked';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {debounceTime}                                  from 'rxjs/operators';
import {BlogService}                                   from '../../../api/blog.service';
import {CategoryService}                               from '../../../api/category.service';
import {AppModalLib}                                   from '../../../library/app-modal.lib';
import {DialogParams}                                  from '../../../library/material-ui/dialog-scope/dialog-params';
import {Constants}                                     from '../../../util/constants';
import {CookieUtil}                                    from '../../../util/cookie-util';
import {Utils}                                         from '../../../util/utils';

/**
 *
 */
@Component({
  selector   : 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls  : ['./blog-editor.component.scss'],
})
export class BlogEditorComponent implements OnInit {
  mdValue = '';
  updateDate = '';
  categoryList = [];
  blogId;
  isSubmitting = false;

  public hasBaseDropZoneOver = false;

  uploader: FileUploader = new FileUploader({
    url              : '/api/img/upload', // '/file/upload',
    // authTokenHeader        : CookieUtil.cookie('token'),
    headers          : [{name: Constants.COOKIE_USER_TOKEN, value: CookieUtil.cookie('token')}],
    autoUpload       : true,
    removeAfterUpload: true,
    isHTML5          : true,
    // disableMultipart : true,
  });

  formBlog = new FormGroup({
    id          : new FormControl(''),
    title       : new FormControl('', [Validators.required]),
    category_id : new FormControl('', [Validators.required]),
    key_word_ids: new FormControl(''),
    content     : new FormControl(''),
  });

  constructor(
    private appModal: AppModalLib,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
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

    const routeParams = this.activatedRoute.params;
    this.blogId = routeParams['value']['id'];
    this.blogId = '0' === this.blogId ? null : this.blogId;
    // query
    if (this.blogId) {
      this.queryById(this.blogId);
    }

    this.formBlog.controls['content'].valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.mdValue = marked(value);
    });
    this.queryAllCategory();

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.fileOnCompleteItem(item, response, status, headers);
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public onFileDrop(e: any): void {
    // this.uploader.queue[0].upload();

  }

  queryAllCategory() {
    this.categoryService.queryAll().then(returnData => {
      this.categoryList = returnData;
    }).catch(errorData => {
    });
  }

  btnGoBack() {
    history.back();
  }

  btnSave() {
    this.formBlog.controls['category_id'].markAsTouched();
    if (this.formBlog.valid) {
      this.isSubmitting = true;
      // update
      if (this.blogId) {
        // this.blogService.update(this.blogId);
        this.blogService.update(this.formBlog.value).then(returnData => {
          if (1 === returnData['affectedRows']) {
            this.appModal.openSnackBar(DialogParams.newInstance({
              msg: 'Update Success!!!',
            }));
            this.isSubmitting = false;

          } else {
            this.appModal.openSnackBar(DialogParams.newInstance({
              msg: 'Update Fail!!!',
            }));
            this.isSubmitting = false;

          }
        }).catch(errorData => {
          this.appModal.openSnackBar(DialogParams.newInstance({
            msg: 'Update Error!!!',
          }));
          this.isSubmitting = false;

        });

      } else { // insert
        this.blogService.insert(this.formBlog.controls['title'].value,
          this.formBlog.controls['content'].value,
          this.formBlog.controls['category_id'].value).then(returnData => {
          if (returnData && returnData.affectedRows) {
            this.appModal.openSnackBar(DialogParams.newInstance({
              msg: 'Create Success!!!',
            }));
            history.back();
          } else {
            this.appModal.openSnackBar(DialogParams.newInstance({
              msg: 'Create Fail!!!',
            }));
            this.isSubmitting = false;
          }
        }).catch(errorData => {
          this.appModal.openSnackBar(DialogParams.newInstance({
            msg: 'Create Error!!!',
          }));
          this.isSubmitting = false;
        });
      }
    }
  }

  queryById(id) {
    this.blogService.queryAll({id: id}).then(returnData => {
      const blogInfo = returnData[0];
      this.formBlog.controls['id'].patchValue(blogInfo['id']);
      this.formBlog.controls['title'].patchValue(blogInfo['title']);
      this.formBlog.controls['category_id'].patchValue(blogInfo['category_id']);
      this.formBlog.controls['content'].patchValue(blogInfo['content']);
      this.updateDate = blogInfo['update_date'];
      this.mdValue = marked(blogInfo['content']);
    }).catch(errorData => {
      throw errorData;
    });
  }

  fileOnCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
    const jsonResp = JSON.parse(response || '{}');
    if (1 === jsonResp.code) {
      const _id = jsonResp['data'].id;
      const _mdImg = ` ![img](${Utils.getImageUrl(_id)}) `;
      this.formBlog.controls['content'].patchValue(this.formBlog.controls['content'].value + _mdImg);
    }
  }

}
