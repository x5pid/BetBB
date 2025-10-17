import { Component, computed, Input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-message',
  imports: [MatIcon],
  templateUrl: './message.html',
  styleUrl: './message.scss'
})
export class MessageComponent {
  @Input() set infoMessage(value: string | null) {
    this.infoMsg.set(value);
  }
  infoMsg = signal<string | null>('');
  showMessage = computed(() => !!this.infoMsg() && this.showMsg());
  showMsg = signal(true);

  deleteMessage() {
    this.showMsg.set(false);
  }
}
