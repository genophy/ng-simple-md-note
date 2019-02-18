import {Component, OnInit}      from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BlogService}            from '../../../api/blog.service';
import {CategoryService}        from '../../../api/category.service';
import {BlogListChangeHelper}   from '../../../reducers/blog-list-change/blog-list-change-helper.service';
import {Constants}              from '../../../util/constants';
import {CookieUtil}             from '../../../util/cookie-util';
import {Utils}                  from '../../../util/utils';

@Component({
  selector   : 'app-my-blog-list',
  templateUrl: './my-blog-list.component.html',
  styleUrls  : ['./my-blog-list.component.scss'],
})
export class MyBlogListComponent implements OnInit {

  blogList = [];
  categoryList = [];
  currentCategoryIdSelected = '';
  blogTotalByCategory = 0;
  dataLoaded = false;

  formSearch = new FormGroup({
    user_name  : new FormControl(''),
    category_id: new FormControl(''),
    content    : new FormControl(''),
  });

  constructor(
    private categoryService: CategoryService,
    private blogListChangeHelper: BlogListChangeHelper,
    private blogService: BlogService) {
  }

  ngOnInit() {
    this.queryAllCategoryWithBlogCount();
    this.queryAllByUserId();

    this.blogListChangeHelper.select().subscribe(value => {
      if (value) {
        this.queryAllCategoryWithBlogCount();
        this.queryAllByUserId();
      }
    });
  }

  btnSearchByCategoryId(categoryId = '') {
    this.currentCategoryIdSelected = categoryId;
    this.queryAllByUserId();
  }

  queryAllCategoryWithBlogCount() {
    this.blogTotalByCategory = 0;
    this.categoryService.queryAllWithBlogCount().then(returnData => {
      this.categoryList = returnData;
      (returnData || []).forEach(item => {
        this.blogTotalByCategory += item['blog_count'];
      });
    }).catch(errorData => {
    });
  }

  queryAllByUserId() {
    this.dataLoaded = false;
    const userInfo = JSON.parse(CookieUtil.cookie(Constants.COOKIE_USER_INFO) || '{}');
    this.blogService.queryAll(
      Utils.objCut(Utils.objConcat({category_id: this.currentCategoryIdSelected}, this.formSearch.value,
        {create_user_id: userInfo['id'], pageNum: 1, pageSize: 10})))
    .then(returnData => {
      this.blogList = returnData;
      this.dataLoaded = true;
    })
    .catch(errorData => {
      throw errorData;
      this.dataLoaded = true;
    });

  }
}
