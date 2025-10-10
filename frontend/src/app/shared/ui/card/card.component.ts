import { NgClass } from '@angular/common';
import { Component, computed, input, Input, signal, Signal } from '@angular/core';

@Component({
  selector: 'ui-card',
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() set variant(value: 'elevated' | 'outlined' | 'flat') {
    this._variant.set(value);
  }
  private _variant = signal<'elevated' | 'outlined' | 'flat'>('flat');

  @Input() set size(value: 'sm' | 'md' | 'lg') {
    this._size.set(value);
  }
  private _size = signal<'sm' | 'md' | 'lg'>('md');

  private readonly baseClass = 'card';

  readonly classes = computed(() => ({
    [this.baseClass]: true,
    [`${this.baseClass}--${this._variant()}`]: true,
    [`${this.baseClass}--${this._size()}`]: true,
  }));
}
