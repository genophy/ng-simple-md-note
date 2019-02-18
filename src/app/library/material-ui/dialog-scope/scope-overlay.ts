import {Directionality}        from '@angular/cdk/bidi';
import {ScopeOverlayContainer} from './scope-overlay-container';
import {DOCUMENT}              from '@angular/common';

import {Overlay, OverlayKeyboardDispatcher, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {ComponentFactoryResolver, Inject, Injectable, Injector, NgZone}                    from '@angular/core';

@Injectable()
export class ScopeOverlay extends Overlay {
	/**
	 * 自定义overlay容器
	 */
	_customOverlayContainer: ScopeOverlayContainer;

	constructor(
		scrollStrategies: ScrollStrategyOptions,
		_overlayContainer: ScopeOverlayContainer,
		_componentFactoryResolver: ComponentFactoryResolver,
		_positionBuilder: OverlayPositionBuilder,
		_keyboardDispatcher: OverlayKeyboardDispatcher,
		_injector: Injector,
		_ngZone: NgZone,
		@Inject(DOCUMENT)_document: any,
		_directionality: Directionality
	) {

		super(
			scrollStrategies,
			_overlayContainer,
			_componentFactoryResolver,
			_positionBuilder,
			_keyboardDispatcher,
			_injector,
			_ngZone,
			_document,
			_directionality
		);

		this._customOverlayContainer = _overlayContainer;
	}

	/**
	 * 设置容器元素
	 * @param {HTMLElement} containerElement
	 */
	public setContainerElement(containerElement: HTMLElement): void {

		this._customOverlayContainer.setContainerElement(containerElement);
	}

}
