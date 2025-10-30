import { AfterViewInit, Component } from '@angular/core';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, PointElement, LineElement } from 'chart.js'; // Importer les modules nécessaires

@Component({
  selector: 'app-bet-stat',
  imports: [],
  templateUrl: './bet-stat.html',
  styleUrl: './bet-stat.scss'
})
export class BetStat implements AfterViewInit {
constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

createChart(): void {
    // Enregistrer les modules nécessaires pour Chart.js v4
    Chart.register(
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend,
      LineController,
      PointElement,
      LineElement
    );

    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'line', // Type de graphique
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Labels de l'axe X
          datasets: [{
            label: 'Données Bleu',
            data: [10, 20, 30, 40, 50],  // Données du graphique 1
            borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la ligne bleue
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Couleur des points
            pointRadius: 20,
            pointStyle: 'image', // Utiliser une image
            // pointImage: 'assets/images/papier.png', // L'image du point
            fill: false,  // Pas de remplissage sous la courbe
          }, {
            label: 'Données Rose',
            data: [50, 40, 30, 20, 10],  // Données du graphique 2
            borderColor: 'rgba(255, 99, 132, 1)', // Couleur de la ligne rose
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Couleur des points
            pointRadius: 20,
            pointStyle: 'image', // Utiliser une image
            // pointImage: 'assets/images/ours.png', // L'image du point
            fill: false,  // Pas de remplissage sous la courbe
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',  // Type de l'échelle X (catégorie)
              min: 'Jan', // Début de l'échelle X (facultatif)
            },
            y: {
              type: 'linear',  // Type de l'échelle Y (linéaire)
              min: 0,  // Début de l'échelle Y
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                // Ajouter des informations supplémentaires dans le tooltip
                label: (context) => {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += context.raw;  // Afficher la valeur du point
                  // Ajouter une ligne supplémentaire avec l'icône correspondante
                  label += ` 🧸 : valeur spécifique`;  // Ajouter une info sur le changement
                  return label;
                }
              }
            }
          }
        }
      });
    }
  }

}
