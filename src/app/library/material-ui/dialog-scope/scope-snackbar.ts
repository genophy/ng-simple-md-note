import {LiveAnnouncer}                                       from '@angular/cdk/a11y';
import {BreakpointObserver}                                  from '@angular/cdk/layout';
import {Injectable, Injector, Optional, Renderer2, SkipSelf} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig}                      from '@angular/material';
import {ScopeOverlay}                                        from './scope-overlay';

@Injectable()
export class ScopeSnackbar extends MatSnackBar {
	/**
	 * 自定义overlay
	 */
	private _customOverlay: ScopeOverlay;

	constructor(
		_overlay: ScopeOverlay,
		_live: LiveAnnouncer,
		_injector: Injector,
		_breakpointObserver: BreakpointObserver,
		@Optional() @SkipSelf() _parentSnackBar: MatSnackBar,
		@Optional() @SkipSelf()  _defaultConfig: MatSnackBarConfig
	) {
		super(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig);
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
