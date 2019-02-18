import {Component, ComponentFactoryResolver, Input, OnChanges, ViewContainerRef} from '@angular/core';
import {DialogInter}                                                             from '../dialog-inter';

/**
 *
 */
@Component({
  selector   : 'app-dialog-encapsulation',
  templateUrl: './dialog-encapsulation.component.html',
  styleUrls  : ['./dialog-encapsulation.component.scss'],
})
export class DialogEncapsulationComponent extends DialogInter implements OnChanges {

  /**
   */
  @Input() component;

  /**
   */
  @Input() recordStateItem;

  /**
   * @param {ViewContainerRef} viewContainerRef
   * @param {ComponentFactoryResolver} componentFactoryResolver
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super();
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes) {
    if (changes && changes['dialogParams'] && changes['dialogParams']['currentValue']) {

      if (this.component) {
        this.viewContainerRef.clear();
        const detailChild = this.viewContainerRef.createComponent(this.componentFactoryResolver.resolveComponentFactory(
          this.component));

        detailChild.instance['recordStateItem'] = this.recordStateItem;
        if (this.dialogParams) {
          detailChild.instance['dialogParams'] = this.dialogParams;
        }
        if (detailChild.instance['eventHandler']) {
          const t = detailChild.instance['eventHandler'].subscribe(value => {
            this.eventHandler.emit(value);
          });
        }
        if (detailChild.instance['eventClose']) {
          const t = detailChild.instance['eventClose'].subscribe(flag => {
            this.eventClose.emit(flag);
            detailChild.destroy();
            t.unsubscribe();
          });
        }

      }
    }
  }
}
