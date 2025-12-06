import { Component, computed, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BetService } from '../../../core/services/bet.service';

@Component({
  selector: 'app-bet-rules-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './bet-result.html',
  styleUrl: './bet-result.scss'
})
export class BetResult {
  constructor(public dialogRef: MatDialogRef<BetResult>) {}
  private _serviceBet = inject(BetService);

  // User Bet Stats
  private _userBetStats = this._serviceBet.userBetStats?.data;
  userBetStatsSuccess = this._serviceBet.userBetStats?.success;
  userBetStatsLoading = this._serviceBet.userBetStats?.loading;

  userGenderGirl = computed(() => {
    const stats = this._userBetStats();
    if (!stats) return false;
    return stats.gender == "Fille";
  });

  close(): void {
    this.dialogRef.close();
  }
}

