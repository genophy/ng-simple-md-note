import {ElementRef, Renderer2} from '@angular/core';

/**
 *
 */
export class DialogParams {

  private readonly params: object;
  private _elementRef: ElementRef;
  private _renderer2: Renderer2;

  /**
   *
   * @param params
   * @param elementRef
   * @param renderer2
   */
  constructor(params: object = {}, elementRef?: ElementRef, renderer2?: Renderer2) {
    this._elementRef = elementRef;
    this._renderer2 = renderer2;
    this.params = params;
  }

  /**
   *
   * @param params
   * @param elementRef
   * @param renderer2
   */
  public static newInstance(params: object = {}, elementRef?: ElementRef, renderer2?: Renderer2) {
    return new this(params, elementRef, renderer2);
  }

  /**
   *
   */
  public getElementRef() {
    return this._elementRef;
  }

  /**
   *
   * @param elementRef
   */
  public setElementRef(elementRef: ElementRef) {
    this._elementRef = elementRef;
  }

  /**
   *
   */
  public getRenderer2() {
    return this._renderer2;
  }

  /**
   *
   * @param renderer2
   */
  public setRenderer2(renderer2) {
    this._renderer2 = renderer2;
  }

  /**
   *
   */
  public getParams() {
    return this.params;
  }

  /**
   *
   * @param key
   * @param val
   */
  public setParams(key: string, val: any) {
    this.params[key] = val;
  }

  /**
   *
   * @param key
   * @param newal
   * @param force
   */
  public mergeParams(key: string, newal: any, force: boolean = true) {
    if (undefined !== newal || null !== newal) {
      if (force) {
        this.setParams(key, newal);
      } else {
        if (!this.params[key]) {
          this.setParams(key, newal);
        }
      }
    }
  }
}
