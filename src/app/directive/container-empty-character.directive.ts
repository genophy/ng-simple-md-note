import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appContainerEmptyCharacter]',
})
export class ContainerEmptyCharacterDirective implements OnInit {
  // 输入属性，用于设置空字符
  @Input('appContainerEmptyCharacter')
  containerEmptyCharacter: string;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
  }

  /**
   * [ng] init
   */
  ngOnInit(): void {
    if (!this.containerEmptyCharacter) {
      this.containerEmptyCharacter = '-';
    }
    setTimeout(() => {
      if (!this.elementRef.nativeElement.innerText) {
        this.elementRef.nativeElement.innerText = this.containerEmptyCharacter;
      }
    }, 0);

  }
}
