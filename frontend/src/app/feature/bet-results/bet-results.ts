import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BetService } from '../../core/services/bet.service';
import { AuthService } from '../../core/services/auth.service';

interface WinnerResult {
  gender: 'Garçon' | 'Fille';
  totalBets: number;
  totalAmount: number;
  winnerCount: number;
}

@Component({
  selector: 'app-bet-results',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './bet-results.html',
  styleUrl: './bet-results.scss'
})
export class BetResults implements OnInit {
  private _betService = inject(BetService);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  betStats = this._betService.betStats;
  betStatsData = computed(() => this.betStats?.data());
  userBet = computed(() => this._betService.bet?.data());
  
  winner = signal<WinnerResult | null>(null);
  userWon = signal<boolean>(false);
  userGain = signal<number>(0);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    this._betService.getBetStats();
    
    // Simuler un délai de chargement (à remplacer par un vrai appel API)
    setTimeout(() => {
      this.calculateWinner();
      this.loading.set(false);
    }, 1000);
  }

  private calculateWinner(): void {
    const stats = this.betStatsData();
    if (!stats) {
      // En cas d'absence de stats, on peut définir un gagnant par défaut
      // Ici, on suppose que "Fille" a gagné (à remplacer par la vraie logique)
      this.winner.set({
        gender: 'Fille',
        totalBets: 0,
        totalAmount: 0,
        winnerCount: 0
      });
      return;
    }

    // Déterminer le gagnant basé sur les stats
    // Ici, on suppose que le gagnant est déterminé par le backend
    // Pour l'instant, on prend celui qui a le plus de mises
    const boyTotal = stats.boy_total || 0;
    const girlTotal = stats.girl_total || 0;
    
    // En production, le gagnant devrait venir du backend
    // Pour l'instant, on simule avec "Fille" comme gagnant
    const winnerGender: 'Garçon' | 'Fille' = girlTotal >= boyTotal ? 'Fille' : 'Garçon';
    
    this.winner.set({
      gender: winnerGender,
      totalBets: stats.total_bets || 0,
      totalAmount: (stats.boy_total || 0) + (stats.girl_total || 0),
      winnerCount: winnerGender === 'Garçon' ? (stats.boy_total || 0) : (stats.girl_total || 0)
    });

    // Vérifier si l'utilisateur a gagné
    const userBets = this.userBet();
    if (userBets && Array.isArray(userBets) && userBets.length > 0) {
      const userBet = userBets[0];
      const userWon = userBet.gender === winnerGender;
      this.userWon.set(userWon);
      
      if (userWon) {
        // Calculer le gain (simplifié - à adapter selon la vraie logique)
        const odds = winnerGender === 'Garçon' ? stats.boy_odds : stats.girl_odds;
        this.userGain.set(userBet.amount * odds);
      }
    }
  }

  goToBet(): void {
    this._router.navigate(['/bet']);
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}


