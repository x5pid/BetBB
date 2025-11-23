import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bet-rules-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './bet-rules-dialog.html',
  styleUrl: './bet-rules-dialog.scss'
})
export class BetRulesDialog {
  constructor(public dialogRef: MatDialogRef<BetRulesDialog>) {}

  close(): void {
    this.dialogRef.close();
  }
}

