import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router}             from '@angular/router';
import {BlogService}                        from '../../../api/blog.service';
import {CategoryService}                    from '../../../api/category.service';
import {AppModalLib}                        from '../../../library/app-modal.lib';
import {HttpHelperLib}                      from '../../../library/http-helper.lib';
import {DialogParams}                       from '../../../library/material-ui/dialog-scope/dialog-params';
import {Utils}                              from '../../../util/utils';

interface UploadResult {
  isImg: boolean;
  name: string;
  url: string;
}

@Component({
  selector   : 'app-blog-md-editor',
  templateUrl: './blog-md-editor.component.html',
  styleUrls  : ['./blog-md-editor.component.scss'],
})
export class BlogMdEditorComponent implements OnInit {
  updateDate = '';
  categoryList = [];
  blogId;
  isSubmitting = false;

  mdEditorOptions = {
    showBorder               : true,       // Show editor component's border. Default is true
    hideIcons                : ['TogglePreview', 'FullScreen'], // 'Bold', 'Italic', 'Heading', 'Refrence',
    // 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen', Default is empty
    scrollPastEnd            : 0,     // The option for ace editor. Default is 0
    enablePreviewContentClick: false,  // Allow user fire the click event on the preview panel, like href etc. Default is false
    resizable                : false,           // Allow resize the editor
    // markedjsOpt?: MarkedjsOption  // The markedjs option, see https://marked.js.org/#/USING_ADVANCED.md#options
  };

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
    private blogService: BlogService,
    private httpHelper: HttpHelperLib) {
  }

  ngOnInit() {

    const routeParams = this.activatedRoute.params;
    this.blogId = routeParams['value']['id'];
    this.blogId = '0' === this.blogId ? null : this.blogId;
    // query
    if (this.blogId) {
      this.queryById(this.blogId);
    }
    this.queryAllCategory();

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
    }).catch(errorData => {
      throw errorData;
    });
  }

  doUpload = (files: Array<File>): Promise<Array<UploadResult>> => {

    return new Promise(resolve => {
      const result: Array<UploadResult> = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.httpHelper.post('/api/img/upload', formData).then(value => {
          result.push({
            name : file.name,
            url  : Utils.getImageUrl(value.id),
            isImg: file.type.indexOf('image') !== -1,
          });
          resolve(result);
        });

      }
    });
  };
}
