import { Component, computed, EventEmitter, forwardRef, input, Input, Output, Signal, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-input',
  imports: [
    MatIcon
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';

  @Input() set disabled(value: boolean) {
    this._disabledInput.set(value);
  }
  private _disabledInput = signal(false);
  readonly disabledInput = this._disabledInput.asReadonly();

  @Input() set variant(value: 'primary' | 'secondary' | 'danger' | 'warning' | 'success') {
    this._variant.set(value);
  }
  private _variant = signal<'primary' | 'secondary' | 'danger' | 'warning' | 'success'>('primary');

  @Input() set size(value: 'sm' | 'md' | 'lg') {
    this._size.set(value);
  }
  private _size = signal<'sm' | 'md' | 'lg'>('md');

  @Input() set error(value: boolean) {
    this.err.set(value);
  }
  err = signal(false);

  @Input() set errorMessage(value: string) {
    this.errorMsg.set(value);
  }
  errorMsg = signal<string>('');
  isErroMsg = computed(() => !!this.errorMsg());

  @Input() set infoMessage(value: string) {
    this.infoMsg.set(value);
  }
  infoMsg = signal('');
  isInfoMsg = computed(() => !!this.infoMsg());

  @Output() valueChanged = new EventEmitter<any>();

  private readonly baseClass = 'input';
  readonly classes = computed(() => ({
    [this.baseClass]: true,
    [`${this.baseClass}--${this._variant()}`]: true,
    [`${this.baseClass}--disabled`]: this._disabledInput(),
    [`${this.baseClass}--error`]: this.err() || this.isErroMsg(),
  }));

  // Valeur interne
  private _value = signal('');
  get value() {
    return this._value();
  }
  set value(val: string) {
    if (val !== this._value()) {
      this._value.set(val);
      this.onChange(val);
    }
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);           // pour Angular
    this.valueChanged.emit(value); // pour le parent
  }

  // ControlValueAccessor callbacks
  onChange = (_: any) => {};
  onTouched = () => {};

  // Appelé par Angular pour écrire la valeur dans le composant
  writeValue(value: any): void {
    this._value.set(value ?? '');
  }
  // Appelé quand la valeur change
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  // Appelé quand le champ est touché (focus perdu)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabledInput.set(isDisabled);
  }

}
