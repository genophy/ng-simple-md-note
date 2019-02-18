import {Component, OnInit}                             from '@angular/core';
import {FormControl, FormGroup, Validators}            from '@angular/forms';
import {Router}                                        from '@angular/router';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {AccountService}                                from '../../../../api/account.service';
import {AppModalLib}                                   from '../../../../library/app-modal.lib';
import {DialogParams}                                  from '../../../../library/material-ui/dialog-scope/dialog-params';
import {Constants}                                     from '../../../../util/constants';
import {CookieUtil}                                    from '../../../../util/cookie-util';
import {Utils}                                         from '../../../../util/utils';

@Component({
  selector   : 'app-set-account',
  templateUrl: './set-account.component.html',
  styleUrls  : ['./set-account.component.scss'],
})
export class SetAccountComponent implements OnInit {
  userName = '';
  cookieUserInfo;
  imageUrl = '';

  uploader: FileUploader = new FileUploader({
    url              : '/api/img/upload', // '/file/upload',
    // authTokenHeader        : CookieUtil.cookie('token'),
    headers          : [{name: Constants.COOKIE_USER_TOKEN, value: CookieUtil.cookie('token')}],
    autoUpload       : true,
    removeAfterUpload: true,
    isHTML5          : true,
    // disableMultipart : true,
  });

  formPage = new FormGroup({
    gender    : new FormControl('', [Validators.required]),
    'image_id': new FormControl(''),
  });

  constructor(private accountService: AccountService, private appModalLib: AppModalLib, private router: Router) {
  }

  ngOnInit() {
    this.cookieUserInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO) || '{}');
    this.formPage.controls['image_id'].patchValue(this.cookieUserInfo['image_id']);
    this.imageUrl = Utils.getImageUrl(this.formPage.controls['image_id'].value);
    this.userName = this.cookieUserInfo['name'];
    this.formPage.controls['gender'].patchValue(this.cookieUserInfo['gender']);

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.fileOnCompleteItem(item, response, status, headers);
    };
  }

  fileOnCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
    const jsonResp = JSON.parse(response || '{}');
    if (1 === jsonResp.code) {
      const id = jsonResp['data'].id;
      this.formPage.controls['image_id'].patchValue(id);
      this.imageUrl = Utils.getImageUrl(id);
    } else {
      this.imageUrl = '';
    }
  }

  btnOnUpdate() {
    this.formPage.controls['gender'].markAsTouched({onlySelf: true});
    if (this.formPage.valid) {
      this.accountService.update(CookieUtil.cookie(Constants.COOKIE_USER_TOKEN),
        Utils.objCut({gender: this.formPage.controls['gender'].value, 'image_id': this.formPage.controls['image_id'].value}))
      .then(returnData => {
        if (1 === returnData.affectedRows) {
          this.appModalLib.openSnackBar(DialogParams.newInstance({
            msg: 'Setting Changed Success!!!',
          })).then(() => {
            this.cookieUserInfo['gender'] = this.formPage.controls['gender'].value;
            this.cookieUserInfo['image_id'] = this.formPage.controls['image_id'].value;
            CookieUtil.cookie(Constants.COOKIE_USER_INFO, JSON.stringify(this.cookieUserInfo));
          });

        } else {
          this.appModalLib.openSnackBar(DialogParams.newInstance({
            msg: 'Setting Changed Fail!!!',
          }));
        }

      })
      .catch(errorData => {
        this.appModalLib.openSnackBar(DialogParams.newInstance({
          msg: 'Setting Changed Error!!!',
        }));
      });
    }
  }
}
