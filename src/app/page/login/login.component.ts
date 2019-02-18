import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog}                          from '@angular/material';
import {Router}                             from '@angular/router';
import {AccountService}                     from '../../api/account.service';
import {AppModalLib}                        from '../../library/app-modal.lib';
import {DialogParams}                       from '../../library/material-ui/dialog-scope/dialog-params';
import {AuthService}                        from '../../service/auth.service';
import {RegisterComponent}                  from './register/register.component';

@Component({
  selector   : 'app-login',
  templateUrl: './login.component.html',
  styleUrls  : ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  accountForm = new FormGroup({
    name    : new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private dialog: MatDialog,
              private router: Router,
              private authService: AuthService,
              private appModalService: AppModalLib, private accountService: AccountService) {
  }

  ngOnInit() {
  }

  btnOnSubmit() {
    if (this.accountForm.valid) {

      this.authService.logIn(this.accountForm.value.name, this.accountForm.value.password).catch(e => {
        this.appModalService.openAlertError(DialogParams.newInstance({
          msg: 'login Fail, name or password is incorrect',
        })).then(() => {
          this.accountForm.controls['password'].patchValue('');
        });
      });
    }
  }

  btnRegister() {
    this.appModalService.openDialog(RegisterComponent, DialogParams.newInstance({}));
  }
}
