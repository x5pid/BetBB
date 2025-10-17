import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[ui-tooltip]'
})
export class TooltipDirective implements AfterViewInit, OnDestroy, OnChanges  {
  @Input('ui-tooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipVisible?:boolean;

  private tooltip: HTMLElement | null = null;
  private tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tooltipVisible']) {
      if (changes['tooltipVisible'].currentValue && this.tooltipText) {
        this.showTooltip();
      }else {
        this.hideTooltip();
      }
    }
  }

  ngAfterViewInit() {
    // Lier aria-describedby à l'élément
    this.renderer.setAttribute(this.el.nativeElement, 'aria-describedby', this.tooltipId);

    // Si affichage forcé activé à l'initialisation
    if (this.tooltipVisible && this.tooltipText) {
      this.showTooltip();
    }
  }

  ngOnDestroy() {
    this.hideTooltip();
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  onActivate() {
    if (this.tooltipVisible == undefined && this.tooltipText) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onDeactivate() {
    if (this.tooltipVisible == undefined) {
      this.hideTooltip();
    }
  }

  private showTooltip() {
    if (this.tooltip) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    this.tooltip = this.renderer.createElement('div');
    if (!this.tooltip) return;
    this.tooltip.innerText = this.tooltipText;

    this.renderer.addClass(this.tooltip, 'tooltip');
    this.renderer.addClass(this.tooltip, `tooltip-${this.tooltipPosition}`);
    this.renderer.setAttribute(this.tooltip, 'id', this.tooltipId);
    this.renderer.setAttribute(this.tooltip, 'role', 'tooltip');

    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'visibility', 'hidden');
    this.renderer.setStyle(this.tooltip, 'top', '0');
    this.renderer.setStyle(this.tooltip, 'left', '0');

    this.renderer.appendChild(document.body, this.tooltip);

    // Une fois le tooltip dans le DOM, on peut lire sa taille
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width;
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + scrollX;
        break;
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'visibility', 'visible');
  }

  private hideTooltip() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }
}
