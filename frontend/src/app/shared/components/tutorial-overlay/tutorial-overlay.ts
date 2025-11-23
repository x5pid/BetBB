import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, AfterViewInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialService, TutorialStep } from '../../../core/services/tutorial.service';

@Component({
  selector: 'app-tutorial-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial-overlay.html',
  styleUrl: './tutorial-overlay.scss'
})
export class TutorialOverlay implements OnInit, OnDestroy, AfterViewInit {
  private _tutorialService = inject(TutorialService);
  private _highlightElement: HTMLElement | null = null;
  private _resizeObserver?: ResizeObserver;
  private _scrollListener?: () => void;
  private _updateTimeout?: number;

  @ViewChild('highlightBox', { static: false }) highlightBox?: ElementRef<HTMLDivElement>;
  @ViewChild('tooltip', { static: false }) tooltip?: ElementRef<HTMLDivElement>;

  isActive = this._tutorialService.isActive;
  currentStep = this._tutorialService.currentStep;
  currentStepIndex = this._tutorialService.currentStepIndex;
  totalSteps = computed(() => this._tutorialService.steps().length);
  isFirstStep = this._tutorialService.isFirstStep;
  isLastStep = this._tutorialService.isLastStep;

  highlightPosition = { top: 0, left: 0, width: 0, height: 0 };
  tooltipPosition = { top: 0, left: 0 };

  constructor() {
    effect(() => {
      if (this._tutorialService.isActive()) {
        // Utiliser requestAnimationFrame au lieu de setTimeout
        requestAnimationFrame(() => {
          setTimeout(() => this.updateHighlight(), 100);
        });
      }
    });

    effect(() => {
      if (this._tutorialService.currentStep()) {
        // Utiliser requestAnimationFrame au lieu de setTimeout
        requestAnimationFrame(() => {
          setTimeout(() => this.updateHighlight(), 100);
        });
      }
    });
  }

  ngOnInit(): void {
    this._scrollListener = () => this.updateHighlight();
    window.addEventListener('scroll', this._scrollListener, true);
    window.addEventListener('resize', this._scrollListener);
  }

  ngAfterViewInit(): void {
    if (this._tutorialService.isActive()) {
      this.updateHighlight();
    }
  }

  ngOnDestroy(): void {
    if (this._updateTimeout) {
      cancelAnimationFrame(this._updateTimeout);
    }
    if (this._scrollListener) {
      window.removeEventListener('scroll', this._scrollListener, true);
      window.removeEventListener('resize', this._scrollListener);
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this.cleanupHighlight();
  }

  private updateHighlight(): void {
    // Annuler toute mise à jour en attente pour éviter les boucles
    if (this._updateTimeout) {
      cancelAnimationFrame(this._updateTimeout);
    }

    // Utiliser requestAnimationFrame pour éviter les boucles ResizeObserver
    this._updateTimeout = requestAnimationFrame(() => {
      const step = this._tutorialService.currentStep();
      if (!step) return;

      const element = document.querySelector(step.selector) as HTMLElement;
      if (!element) {
        console.warn(`Tutorial: Element not found for selector: ${step.selector}`);
        return;
      }

      this._highlightElement = element;
      this.calculatePosition(element);
      this.updateTooltipPosition(element, step);
      this.observeElement(element);
    });
  }

  private calculatePosition(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    this.highlightPosition = {
      top: rect.top + scrollY - 8,
      left: rect.left + scrollX - 8,
      width: rect.width + 16,
      height: rect.height + 16
    };
  }

  private updateTooltipPosition(element: HTMLElement, step: TutorialStep): void {
    if (!this.tooltip?.nativeElement) return;

    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.nativeElement.getBoundingClientRect();
    const position = step.position || 'bottom';
    const offset = step.offset || { x: 0, y: 0 };

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top + window.scrollY - tooltipRect.height - 20 + offset.y;
        left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2 + offset.x;
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + 20 + offset.y;
        left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2 + offset.x;
        break;
      case 'left':
        top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2 + offset.y;
        left = rect.left + window.scrollX - tooltipRect.width - 20 + offset.x;
        break;
      case 'right':
        top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2 + offset.y;
        left = rect.right + window.scrollX + 20 + offset.x;
        break;
      case 'center':
        top = window.innerHeight / 2 + window.scrollY - tooltipRect.height / 2 + offset.y;
        left = window.innerWidth / 2 + window.scrollX - tooltipRect.width / 2 + offset.x;
        break;
    }

    // Ajuster si le tooltip sort de l'écran
    const padding = 20;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipRect.height > window.innerHeight + window.scrollY - padding) {
      top = window.innerHeight + window.scrollY - tooltipRect.height - padding;
    }

    this.tooltipPosition = { top, left };
  }

  private observeElement(element: HTMLElement): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    // Utiliser requestAnimationFrame dans le ResizeObserver pour éviter les boucles
    this._resizeObserver = new ResizeObserver(() => {
      if (this._updateTimeout) {
        cancelAnimationFrame(this._updateTimeout);
      }
      this._updateTimeout = requestAnimationFrame(() => {
        const step = this._tutorialService.currentStep();
        if (step && this._highlightElement) {
          this.calculatePosition(this._highlightElement);
          if (this.tooltip?.nativeElement) {
            this.updateTooltipPosition(this._highlightElement, step);
          }
        }
      });
    });

    this._resizeObserver.observe(element);
  }

  private cleanupHighlight(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this._highlightElement = null;
  }

  next(): void {
    this._tutorialService.next();
  }

  previous(): void {
    this._tutorialService.previous();
  }

  stop(): void {
    this._tutorialService.stop();
  }
}

