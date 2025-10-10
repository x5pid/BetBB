import { Component, computed, EventEmitter, Input, input, Output, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Input({required: true}) formGroup! : FormGroup;
  @Input() errorMessage: string | null = null;
  @Output() formSubmit = new EventEmitter<boolean>();

  onSubmit(event: Event) {
    event.preventDefault();  // stop propagation native submit event
    this.formSubmit.emit(true);
  }
}
