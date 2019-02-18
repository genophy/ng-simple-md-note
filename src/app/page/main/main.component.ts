import {Component, OnInit}      from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService}            from '../../service/auth.service';
import {Constants}              from '../../util/constants';
import {CookieUtil}             from '../../util/cookie-util';

@Component({
  selector   : 'app-main',
  templateUrl: './main.component.html',
  styleUrls  : ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  isLogin;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLogin = !!CookieUtil.cookie(Constants.COOKIE_USER_TOKEN);
  }

  btnGotoHomePage() {
    this.router.navigateByUrl('/blank', {skipLocationChange: true, relativeTo: this.activatedRoute.root}).then(() => {
      this.router.navigateByUrl('/main/blog-list');
    });
  }

  btnGotoMyBlogList() {
    this.router.navigateByUrl('/blank', {skipLocationChange: true, relativeTo: this.activatedRoute.root}).then(() => {
      this.router.navigateByUrl('/main/my-blog-list');
    });
  }

  btnGotoAbout() {
    this.router.navigateByUrl('/blank', {skipLocationChange: true, relativeTo: this.activatedRoute.root}).then(() => {
      this.router.navigateByUrl('/main/about');
    });
  }

  btnGotoSettings() {
    this.router.navigateByUrl('/blank', {skipLocationChange: true, relativeTo: this.activatedRoute.root}).then(() => {
      this.router.navigateByUrl('/main/settings');
    });
  }

  btnNewBlog() {
    this.router.navigateByUrl('/blank', {skipLocationChange: true, relativeTo: this.activatedRoute.root}).then(() => {
      this.router.navigateByUrl('/main/blog-editor/0');
    });
  }
  btnNewMdBlog() {
    this.router.navigateByUrl('/blank', {skipLocationChange: true, relativeTo: this.activatedRoute.root}).then(() => {
      this.router.navigateByUrl('/main/blog-md-editor/0');
    });
  }

  btnGotoLogin() {
    this.router.navigateByUrl('/login', {relativeTo: this.activatedRoute.root});
  }

  btnLogOut() {
    this.authService.logOut();
  }
}
