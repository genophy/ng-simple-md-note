import {Component, OnInit}      from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BlogService}            from '../../../api/blog.service';
import {CategoryService}        from '../../../api/category.service';
import {BlogListChangeHelper}   from '../../../reducers/blog-list-change/blog-list-change-helper.service';
import {Utils}                  from '../../../util/utils';

@Component({
  selector   : 'app-blog-rough-list',
  templateUrl: './blog-rough-list.component.html',
  styleUrls  : ['./blog-rough-list.component.scss'],
})
export class BlogRoughListComponent implements OnInit {

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
    this.queryAll();

    this.blogListChangeHelper.select().subscribe(value => {
      if (value) {
        this.queryAllCategoryWithBlogCount();
        this.queryAll();
      }
    });
  }

  btnSearchByCategoryId(categoryId = '') {
    this.currentCategoryIdSelected = categoryId;
    this.queryAll();
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

  queryAll() {
    this.dataLoaded = false;
    this.blogService.queryAll(
      Utils.objCut(Utils.objConcat({category_id: this.currentCategoryIdSelected}, this.formSearch.value, {pageNum: 1, pageSize: 10})))
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
