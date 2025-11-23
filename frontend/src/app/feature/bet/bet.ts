import { Component, computed, effect, inject, signal } from '@angular/core';
import { BetForm } from './bet-form/bet-form';
import { BetStat } from './bet-stat/bet-stat';
import { BetSvgBebe } from './bet-svg-bebe/bet-svg-bebe';
import { BetSvgPig } from './bet-svg-pig/bet-svg-pig';
import { BetCountdown } from './bet-countdown/bet-countdown';
import { BetService } from '../../core/services/bet.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { BetRulesDialog } from './bet-rules-dialog/bet-rules-dialog';
import { AuthService } from '../../core/services/auth.service';
import { TutorialService } from '../../core/services/tutorial.service';
import { TutorialOverlay } from '../../shared/components/tutorial-overlay/tutorial-overlay';

@Component({
  selector: 'app-bet',
  imports: [
    BetForm,
    BetStat,
    BetSvgBebe,
    BetSvgPig,
    BetCountdown,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TutorialOverlay,
  ],
  templateUrl: './bet.html',
  styleUrl: './bet.scss'
})
export class Bet {
  private _serviceBet = inject(BetService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _tutorialService = inject(TutorialService);
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

  startTutorial(): void {
    this._tutorialService.start([
      {
        id: 'form-header',
        selector: '.bet-form header',
        title: 'Le formulaire de pari',
        description: 'Voici le formulaire principal où vous allez créer votre pari. Commençons par comprendre les différentes sections.',
        position: 'bottom'
      },
      {
        id: 'symbolic-object',
        selector: '#symbol',
        title: 'Choisir un objet symbolique',
        description: 'Sélectionnez d\'abord un objet symbolique dans ce menu déroulant. Cet objet représente votre choix personnel et symbolique pour le pari.',
        position: 'bottom'
      },
      {
        id: 'gender-choice',
        selector: '#choice',
        title: 'Sélectionner le sexe',
        description: 'Choisissez ensuite entre "Garçon" ou "Fille" pour indiquer votre prédiction sur le sexe du bébé à naître.',
        position: 'bottom'
      },
      {
        id: 'amount',
        selector: '#stake',
        title: 'Définir le montant',
        description: 'Entrez le montant que vous souhaitez parier. Le gain potentiel sera calculé automatiquement en fonction des cotes actuelles affichées ci-dessus.',
        position: 'bottom'
      },
      {
        id: 'potential-gain',
        selector: '#potential',
        title: 'Gain potentiel',
        description: 'Ici vous pouvez voir votre gain potentiel calculé en temps réel. Il correspond à : Montant parié × Cote actuelle.',
        position: 'top'
      },
      {
        id: 'bet-button',
        selector: '.betForm-actions button',
        title: 'Valider votre pari',
        description: 'Une fois tous les champs remplis, cliquez sur ce bouton "Parier" pour confirmer et placer votre pari. Vous verrez une animation de pièces !',
        position: 'top'
      },
      {
        id: 'stats-section',
        selector: '.bet-stat',
        title: 'Les statistiques',
        description: 'Cette section affiche les statistiques en temps réel : la répartition des paris, les mises totales, le dernier pari effectué et vos gains potentiels.',
        position: 'left'
      },
      {
        id: 'chart',
        selector: '#myChart',
        title: 'Le graphique des cotes',
        description: 'Ce graphique montre l\'évolution des cotes pour "Garçon" (ligne bleue) et "Fille" (ligne rose) en temps réel. Les cotes changent automatiquement à chaque nouveau pari.',
        position: 'top'
      },
      {
        id: 'chart-controls',
        selector: '.chart-controls',
        title: 'Contrôles du graphique',
        description: 'Le bouton "Réinitialiser" permet de réinitialiser la vue du graphique. Surveillez l\'évolution pour identifier les meilleurs moments pour parier !',
        position: 'top'
      }
    ]);
  }
}
