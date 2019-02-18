import {Injectable}                          from '@angular/core';
import {ActivatedRoute, CanActivate, Router} from '@angular/router';
import {AccountService}                      from '../api/account.service';
import {Constants}                           from '../util/constants';
import {CookieUtil}                          from '../util/cookie-util';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private accountService: AccountService) {
  }

  canActivate() {
    return this.isAuthed();
  }

  isAuthed() {
    const flag = !!CookieUtil.cookie(Constants.COOKIE_USER_TOKEN);
    if (!flag) {
      this.router.navigateByUrl('/login');

    }

    return flag;
  }

  logIn(username, password) {
    return this.accountService.login(username, password).then(data => {
      if (data && data['token']) {
        this.router.navigateByUrl('/', {replaceUrl: true});

        CookieUtil.cookie(Constants.COOKIE_USER_TOKEN, data['token']);
        CookieUtil.cookie(Constants.COOKIE_USER_INFO,
          JSON.stringify({
            id      : data['id'],
            name    : data['name'],
            gender  : data['gender'],
            image_id: data['image_id'],
            is_admin: 1 === data['is_admin'],
          }));

      } else {
        throw new Error('login error');
      }
      return data;
    });
  }

  logOut() {
    this.accountService.logout(CookieUtil.cookie(Constants.COOKIE_USER_TOKEN)).then(() => {
      CookieUtil.cookie(Constants.COOKIE_USER_INFO, '');
      CookieUtil.cookie(Constants.COOKIE_USER_TOKEN, '');
      this.router.navigateByUrl('/login');
    });
  }
}


