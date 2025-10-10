import { Component, computed, Input, signal } from '@angular/core';

@Component({
  selector: 'ui-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.scss'
})
export class MessageComponent {
  @Input() set infoMessage(value: string) {
    this.infoMsg.set(value);
  }
  infoMsg = signal('');
  isInfoMsg = computed(() => !!this.infoMsg());
}
