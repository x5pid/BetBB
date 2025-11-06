import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, PointElement, LineElement, TimeScale, ScatterDataPoint } from 'chart.js'; // Importer les modules nécessaires
import 'chartjs-adapter-date-fns'; // Importer l'adaptateur de date
import { BetService } from '../../../core/services/bet.service';
import { BetDistribution } from '../../../core/models/bet.model';

@Component({
  selector: 'app-bet-stat',
  imports: [],
  templateUrl: './bet-stat.html',
  styleUrl: './bet-stat.scss'
})
export class BetStat implements AfterViewInit {

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
  lastBet = computed(() => 
    `${this._betStats()?.last_bet?.gender} (${this._betStats()?.last_bet?.amount})`
  );

  // Odds
  oddsBoy = computed(() => this._betStats()?.boy_odds ?? 1.00);
  oddsGirl = computed(() => this._betStats()?.girl_odds ?? 1.00);
  //Potential
  potencial = computed(() => {
    const stats = this._userBetStats();
    if (!stats) return 0;
    const amount = Number(stats.amount) || 0;
    const odds = stats.gender === 'Fille' ? this.oddsGirl() : this.oddsBoy();
    return amount * odds;
  });

  constructor() {}

  ngOnInit(): void {}

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
                x: d.date,
                y: d.boy_odds
              } as unknown as ScatterDataPoint)) ?? [],
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3,
            },
            {
              label: 'Fille',
              data: this.dataSignal()?.map(d => ({
                x: d.date,
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
          scales: {
            x: {
              type: 'time', // 📅 Type d’échelle temporelle
              time: {
                unit: 'minute', // ou 'second', 'hour', etc. → Chart.js choisira automatiquement si tu ne précises pas
                displayFormats: {
                  minute: 'HH:mm:ss',
                },
              },
              title: {
                display: true,
                text: 'Date / Heure',
              },
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Odds',
              },
            },
          },
        },
      });
    }
  }

  updateChartData(data: { datetime: string; boy_odds: number; girl_odds: number }[]): void {
    // Mise à jour des datasets avec les nouvelles données
    this.chart.data.datasets[0].data = data.map(d => ({ x: d.datetime, y: d.boy_odds } as unknown as ScatterDataPoint));
    this.chart.data.datasets[1].data = data.map(d => ({ x: d.datetime, y: d.girl_odds } as unknown as ScatterDataPoint));
    this.chart.update();
  }

}
