import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bet-rules-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './bet-result.html',
  styleUrl: './bet-result.scss'
})
export class BetResult {
  constructor(public dialogRef: MatDialogRef<BetResult>) {}

  close(): void {
    this.dialogRef.close();
  }
}

