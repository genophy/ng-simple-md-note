import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService}                     from '../../../api/account.service';
import {DialogInter}                        from '../../../component/modal/dialog-container/dialog-inter';
import {AppModalLib}                        from '../../../library/app-modal.lib';
import {DialogParams}                       from '../../../library/material-ui/dialog-scope/dialog-params';
import {ValidatorsUtil}                     from '../../../util/validators-util';

@Component({
  selector   : 'app-register',
  templateUrl: './register.component.html',
  styleUrls  : ['./register.component.scss'],
})
export class RegisterComponent extends DialogInter implements OnInit {
  formRegister = new FormGroup({
    name      : new FormControl('', [Validators.required, Validators.minLength(2)]),
    password  : new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [ValidatorsUtil.equal('password')]),

  });

  constructor(private accountService: AccountService, private appModal: AppModalLib) {
    super();
  }

  ngOnInit() {
  }

  btnOnSubmit() {
    if (this.formRegister.valid) {
      const params = this.formRegister.value;
      this.accountService.accountInsert(params.name, params.password).then(value => {
        if (value && value.affectedRows) {
          this.appModal.openAlert(DialogParams.newInstance({
            msg: 'regiester success',
          })).then(() => {
            this.eventClose.emit(true);
          });
        }
      });

    }
  }

}
