import {OverlayContainer} from '@angular/cdk/overlay';
import {Injectable}       from '@angular/core';

@Injectable()
export class ScopeOverlayContainer extends OverlayContainer {
	/**
	 * 设置容器元素
	 * @param {HTMLElement} containerElement
	 */
	public setContainerElement(containerElement: HTMLElement): void {
		this._containerElement = containerElement;
	}
}
