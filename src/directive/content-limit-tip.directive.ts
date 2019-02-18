import {Directive, ElementRef, Input, OnChanges} from '@angular/core';
import {MatHint}                                 from '@angular/material';

/**
 *     <mat-form-field>
 *          <input color-black matInput maxlength="128"
 *          formControlName="num">
 *          <mat-hint align="end"
 *            appContentLimitTip
 *            [limitContent]="caseForm.controls['num'].value"
 *            [limitMax]="128">
 *         </mat-hint>
 *     </mat-form-field>
 */
@Directive({
  selector: '[appContentLimitTip]',
})
export class ContentLimitTipDirective implements MatHint, OnChanges {
  @Input()
  limitContent: string;

  @Input()
  limitMax: number;

  @Input()
  limitSizeLeft = 5;

  @Input()
  align: 'start' | 'end';

  @Input()
  id: string;

  /**
   * @param elementRef
   */
  constructor(private elementRef: ElementRef) {
    this._setContent();
  }

  /**
   * @param changes
   */
  ngOnChanges(changes) {
    if (changes && changes['limitContent']) {
      this._setContent();
    }
  }

  /**
   * @private
   */
  private _setContent() {
    if (this.limitContent && this.limitMax && this.limitSizeLeft && this.limitContent.length >= (this.limitMax - this.limitSizeLeft)) {
      this.elementRef.nativeElement.innerHTML = `${this.limitContent.length} / ${this.limitMax}`;
    } else {
      this.elementRef.nativeElement.innerHTML = '';
    }
  }
}
