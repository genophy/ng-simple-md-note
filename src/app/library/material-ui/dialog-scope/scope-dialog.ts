import {OverlayContainer}                                            from '@angular/cdk/overlay';
import {Location}                                                    from '@angular/common';
import {Inject, Injectable, Injector, Optional, Renderer2, SkipSelf} from '@angular/core';

import {MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialog} from '@angular/material';
import {ScopeOverlay}                                                      from './scope-overlay';

@Injectable()
export class ScopeDialog extends MatDialog {
  /**
   * 自定义的overlay
   */
  private _customOverlay: ScopeOverlay;

  constructor(
    _overlay: ScopeOverlay,
    _injector: Injector,
    _location: Location,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) _defaultOptions: any,
    @Inject(MAT_DIALOG_SCROLL_STRATEGY)  _scrollStrategy: any,
    @Optional() @SkipSelf() _parentDialog: MatDialog,
    _overlayContainer: OverlayContainer,
  ) {
    super(_overlay, _injector, _location, _defaultOptions, _scrollStrategy, _parentDialog, _overlayContainer);
    this._customOverlay = _overlay;
  }

  /**
   * 设置容器元素
   * @param {HTMLElement} containerElement
   * @param {Renderer2} renderer
   */
  public setContainerElement(containerElement: HTMLElement, renderer?: Renderer2): void {

    // need to apply this styling to make the backdrop with position: fixed styling cover only the containerElement
    renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
    this._customOverlay.setContainerElement(containerElement);
  }

}
