import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router}                             from '@angular/router';
import {AccountService}                     from '../../../../api/account.service';
import {AppModalLib}                        from '../../../../library/app-modal.lib';
import {DialogParams}                       from '../../../../library/material-ui/dialog-scope/dialog-params';
import {Constants}                          from '../../../../util/constants';
import {CookieUtil}                         from '../../../../util/cookie-util';
import {ValidatorsUtil}                     from '../../../../util/validators-util';

@Component({
  selector   : 'app-set-pwd',
  templateUrl: './set-pwd.component.html',
  styleUrls  : ['./set-pwd.component.scss'],
})
export class SetPwdComponent implements OnInit {

  userName = '';
  cookieUserInfo;
  formPage = new FormGroup({
    password  : new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [ValidatorsUtil.equal('password')]),
  });

  constructor(private accountService: AccountService, private appModalLib: AppModalLib, private router: Router) {
  }

  ngOnInit() {
    this.cookieUserInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO) || '{}');
    this.userName = this.cookieUserInfo['name'];
  }

  btnOnUpdate() {
    if (this.formPage.valid) {
      this.accountService.update(CookieUtil.cookie(Constants.COOKIE_USER_TOKEN),
        {pwd: this.formPage.controls['password'].value}).then(returnData => {
        if (1 === returnData.affectedRows) {
          this.appModalLib.openSnackBar(DialogParams.newInstance({
            msg: 'Password Changed Success!!!',
          })).then(() => {
            this.router.navigateByUrl('/blank', {skipLocationChange: true}).then(() => {
              this.router.navigateByUrl('/main/settings/set-pwd');
            });
          });
        } else {
          this.appModalLib.openSnackBar(DialogParams.newInstance({
            msg: 'Password Changed Fail!!!',
          }));
        }
      }).catch(errorData => {
        this.appModalLib.openSnackBar(DialogParams.newInstance({
          msg: 'Password Changed Error!!!',
        })).then(() => {
          this.formPage.controls['password'].patchValue('');
          this.formPage.controls['rePassword'].patchValue('');
        });
      });
    }
  }

}
