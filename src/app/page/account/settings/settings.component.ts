import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Constants}         from '../../../util/constants';
import {CookieUtil}        from '../../../util/cookie-util';

@Component({
  selector   : 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls  : ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  isSetCategoryVisible = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const cookieUserInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO));
    this.isSetCategoryVisible = cookieUserInfo['is_admin'];
  }

  btnGotoSetAccount() {
    this.router.navigateByUrl('/main/settings/set-account');
  }

  btnGotoSetCategory() {
    this.router.navigateByUrl('/main/settings/set-category');
  }

  btnGotoSetPwd() {
    this.router.navigateByUrl('/main/settings/set-pwd');
  }
}
