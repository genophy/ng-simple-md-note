import {Component, OnInit}      from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService}        from '../../../../api/category.service';
import {AppModalLib}            from '../../../../library/app-modal.lib';
import {DialogParams}           from '../../../../library/material-ui/dialog-scope/dialog-params';

@Component({
  selector   : 'app-set-category',
  templateUrl: './set-category.component.html',
  styleUrls  : ['./set-category.component.scss'],
})
export class SetCategoryComponent implements OnInit {

  dataLoaded = false;
  categoryList = [];

  formPage = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private appModal: AppModalLib, private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.queryAllCategory();
  }

  btnRemove(category) {
    this.categoryService.del(category.id).then(returnData => {
      if (1 === returnData.affectedRows) {
        const index = this.categoryList.indexOf(category);
        if (index >= 0) {
          this.categoryList.splice(index, 1);
        }
      } else {
        this.appModal.openSnackBar(DialogParams.newInstance({
          msg: 'Del Category Fail!!!',
        }));
      }

    }).catch(errorData => {
      this.appModal.openSnackBar(DialogParams.newInstance({
        msg: 'Del Category Error!!!',
      }));
    });

  }

  queryAllCategory() {
    this.dataLoaded = false;
    this.categoryService.queryAll().then(returnData => {
      this.categoryList = returnData;
      this.formPage.controls['name'].patchValue('');
      this.dataLoaded = true;
    }).catch(errorData => {
      this.dataLoaded = true;
    });
  }

  btnAddCategory() {
    const categoryName = this.formPage.controls['name'].value;
    if (categoryName) {
      this.categoryService.insert(categoryName).then(returnData => {
        if (1 === returnData.affectedRows) {
          this.appModal.openSnackBar(DialogParams.newInstance({
            msg: 'Add Category Success!!!',
          }));
          this.queryAllCategory();

        } else {
          this.appModal.openSnackBar(DialogParams.newInstance({
            msg: 'Add Category Fail!!!',
          }));
        }

      }).catch((errorData) => {
        this.appModal.openSnackBar(DialogParams.newInstance({
          msg: errorData['data'],
        }));
      });
    }
  }
}
