import { NgClass } from '@angular/common';
import { Component, computed, Input, signal} from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() set disabled(value: boolean) {
    this._disabledBtn.set(value);
  }
  private _disabledBtn = signal(false);
  readonly disabledBtn = this._disabledBtn.asReadonly();

  @Input() set variant(value: 'primary' | 'secondary' | 'danger' | 'warning' | 'success') {
    this._variant.set(value);
  }
  private _variant = signal<'primary' | 'secondary' | 'danger' | 'warning' | 'success'>('primary');

  @Input() set size(value: 'sm' | 'md' | 'lg') {
    this._size.set(value);
  }
  private _size = signal<'sm' | 'md' | 'lg'>('md');


  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  // Attention eClass marchera uniquement sur des classes déclarées en globale
  @Input() eClass: string | string[] = [];

  private readonly baseClass = 'btn';

  readonly classes = computed(() => {
    const result: Record<string, boolean> = {
      [this.baseClass]: true,
      [`${this.baseClass}--${this._variant()}`]: true,
      [`${this.baseClass}--${this._size()}`]: true,
      [`${this.baseClass}--disabled`]: this.disabledBtn(),
    };

    // 👇 Ajouter les classes externes si présentes
    if (typeof this.eClass === 'string') {
      for (const c of this.eClass.split(' ')) {
        if (c.trim()) result[c.trim()] = true;
      }
    } else if (Array.isArray(this.eClass)) {
      for (const c of this.eClass) {
        if (c.trim()) result[c.trim()] = true;
      }
    }

    return result;
  });
}
