import { AfterViewInit, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, PointElement, LineElement, TimeScale, ScatterDataPoint } from 'chart.js'; // Importer les modules nécessaires
import 'chartjs-adapter-date-fns'; // Importer l'adaptateur de date
import { BetService } from '../../../../core/services/bet.service';
import { BetDistribution, OddsSnapshot } from '../../../../core/models/bet.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-bet-stat',
  imports: [
    DecimalPipe
  ],
  templateUrl: './bet-stat.html',
  styleUrl: './bet-stat.scss'
})
export class BetStat implements AfterViewInit {
  @ViewChild('progressBarBoy') progressBarBoy: any;
  @ViewChild('progressBarGirl') progressBarGirl: any;

  private _serviceBet = inject(BetService);
  // Bet Stats
  private _betStats = this._serviceBet.betStats?.data;
  betStatsSuccess = this._serviceBet.betStats?.success;
  betStatsLoading = this._serviceBet.betStats?.loading;
  // User Bet Stats
  private _userBetStats = this._serviceBet.userBetStats?.data;
  userBetStatsSuccess = this._serviceBet.userBetStats?.success;
  userBetStatsLoading = this._serviceBet.userBetStats?.loading;

  //Distribution
  distributionBoy = computed(() =>
    this._betStats()?.distribution?.find((item: BetDistribution) => item.gender === 'Garçon')?.percentage ?? 0
  );
  distributionGirl = computed(() =>
    this._betStats()?.distribution?.find((item: BetDistribution) => item.gender === 'Fille')?.percentage ?? 0
  );
  // Total
  total = computed(() => this._betStats()?.total_bets);
  //Last Bet
  lastBet = computed(() =>{
    const gender = this._betStats()?.last_bet?.gender;
    const amount = this._betStats()?.last_bet?.amount;
    return gender && amount ? `${gender} (${amount})` : '';
  });

  // Odds
  oddsBoy = computed(() => this._betStats()?.boy_odds ?? 1.00);
  oddsGirl = computed(() => this._betStats()?.girl_odds ?? 1.00);
  // Total
  totalBoy = computed(() => this._betStats()?.boy_total ?? 0);
  totalGirl = computed(() => this._betStats()?.girl_total ?? 0);

  //Potential
  potencial = computed(() => {
    const stats = this._userBetStats();
    if (!stats) return 0;
    const amount = Number(stats.amount) || 0;
    const odds = stats.gender === 'Fille' ? this.oddsGirl() : this.oddsBoy();
    return amount * odds;
  });

  constructor() {
    effect(() => {
      const val = this.dataSignal();
      if(this.chart && val){
        this.updateChartData(val);
      }
    });

    effect(() => this.updateProgressBar(this.progressBarBoy, this.distributionBoy() ?? 0));
    effect(() => this.updateProgressBar(this.progressBarGirl, this.distributionGirl() ?? 0));
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  dataSignal = computed(() => this._betStats()?.odds_history );

  private chart!: Chart<'line', ScatterDataPoint[], unknown>;

  createChart(): void {
    Chart.register(
      CategoryScale,
      LinearScale,
      TimeScale, // ⏱️ Échelle temporelle
      Title,
      Tooltip,
      Legend,
      LineController,
      PointElement,
      LineElement
    );

    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Garçon',
              data: this.dataSignal()?.map(d => ({
                x: d.datetime,
                y: d.boy_odds
              } as unknown as ScatterDataPoint)) ?? [],
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3,
            },
            {
              label: 'Fille',
              data: this.dataSignal()?.map(d => ({
                x: d.datetime,
                y: d.girl_odds
              } as unknown as ScatterDataPoint)) ?? [],
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          // maintainAspectRatio: false,  // Permet de maintenir l'aspect ratio selon la largeur et la hauteur du conteneur
          scales: {
            x: {
              type: 'time', // 📅 Type d’échelle temporelle
              time: {
                unit: 'minute', // Unité de temps (minute, heure, jour, etc.)
                displayFormats: {
                  minute: 'yyyy-MM-dd HH:mm', // Format complet avec date et heure
                  hour: 'yyyy-MM-dd HH:mm',   // Si tu choisis 'hour', montre aussi l'heure complète
                },
              },
              title: {
                display: true,
                text: 'Date / Heure',
              },
              ticks: {
                //source: 'data',  // Les ticks seront basés sur les données, pas sur l'échelle
                autoSkip: true,   // Évite les labels trop serrés
                // maxRotation: 0,   // Garder les labels à plat (sans rotation)
                // minRotation: 0,   // Pareil ici, pour une lecture plus claire
                maxTicksLimit: 10,  // Limite le nombre de ticks affichés à 10
                major: {
                  enabled: true,  // Afficher les ticks majeurs
                },
              },
              grid: {
                display: true,  // Affiche la grille
                drawOnChartArea: true,  // La grille sera dessinée uniquement là où il y a des données
              },
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Odds',
              },
              grid: {
                display: true,  // Afficher la grille des ordonnées
              },
            },
          },
        },
      });
    }
  }

  updateChartData(data: OddsSnapshot[]): void {
    // Mise à jour des datasets avec les nouvelles données
    this.chart.data.datasets[0].data = data.map(d => ({ x: d.datetime, y: d.boy_odds } as unknown as ScatterDataPoint));
    this.chart.data.datasets[1].data = data.map(d => ({ x: d.datetime, y: d.girl_odds } as unknown as ScatterDataPoint));
    this.chart.update();
  }

  updateProgressBar(progressBar:any, width : number) {
    if (progressBar) {
      progressBar.nativeElement.style.width = `${width}%`; // Modifie le style width
    }
  }
}
