import { Component, computed, effect, inject, signal } from '@angular/core';
import { BetForm } from './bet-form/bet-form';
import { BetStat } from './bet-stat/bet-stat';
import { BetSvgBebe } from './bet-svg-bebe/bet-svg-bebe';
import { BetSvgPig } from './bet-svg-pig/bet-svg-pig';
import { BetService } from '../../core/services/bet.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { BetRulesDialog } from './bet-rules-dialog/bet-rules-dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bet',
  imports: [
    BetForm,
    BetStat,
    BetSvgBebe,
    BetSvgPig,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './bet.html',
  styleUrl: './bet.scss'
})
export class Bet {
  private _serviceBet = inject(BetService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _rulesDialogOpened = false;

  betMe = this._serviceBet.bet;
  betMeData = this.betMe.data;
  betMeLoading = this.betMe.loading;
  betMeSuccess = this.betMe.success;

  bets = this._serviceBet.bets;
  betStats = this._serviceBet.betStats;
  userBetStats = this._serviceBet.userBetStats;

  // Computed pour vérifier si l'utilisateur a déjà joué
  hasPlayed = computed(() => {
    const data = this.betMeData();
    return data && Array.isArray(data) && data.length > 0;
  });

  constructor(){
    this._serviceBet.getBetMe();
    this._serviceBet.getBetAll();
    this._serviceBet.getBetStats();
    this._serviceBet.getUserBetStats();

    // Ouvrir automatiquement la modale si l'utilisateur n'a pas encore joué
    effect(() => {
      const loading = this.betMeLoading();
      const data = this.betMeData();
      
      // Attendre que le chargement soit terminé et vérifier si l'utilisateur n'a pas joué
      if (!loading && data !== undefined && !this._rulesDialogOpened) {
        const hasPlayed = data && Array.isArray(data) && data.length > 0;
        if (!hasPlayed) {
          this._rulesDialogOpened = true;
          // Petit délai pour éviter l'ouverture immédiate au chargement
          setTimeout(() => {
            this.openRulesDialog();
          }, 500);
        }
      }
    });
  }

  openRulesDialog(): void {
    this._dialog.open(BetRulesDialog, {
      width: '500px',
      disableClose: false,
    });
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
