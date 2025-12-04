import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss'
})
export class Countdown implements OnInit, OnDestroy {
  private _router = inject(Router);

  // Date de fin des paris (à configurer ou récupérer depuis le backend)
  // Format: Date ISO string ou timestamp
  private readonly endDate = new Date('2025-12-06T15:00:00').getTime();

  private intervalId?: number;
  private hasRedirected = false;

  timeRemaining = signal<number>(0);

  days = computed(() => Math.floor(this.timeRemaining() / (1000 * 60 * 60 * 24)));
  hours = computed(() => Math.floor((this.timeRemaining() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  minutes = computed(() => Math.floor((this.timeRemaining() % (1000 * 60 * 60)) / (1000 * 60)));
  seconds = computed(() => Math.floor((this.timeRemaining() % (1000 * 60)) / 1000));

  isExpired = computed(() => this.timeRemaining() <= 0);
  isUrgent = computed(() => this.timeRemaining() < 24 * 60 * 60 * 1000); // Moins de 24h

  constructor() {
    // Rediriger vers la page de résultats quand le countdown expire
    effect(() => {
      if (this.isExpired() && !this.hasRedirected) {
        this.hasRedirected = true;
        setTimeout(() => {
          this._router.navigate(['/results']);
        }, 2000); // Attendre 2 secondes avant de rediriger
      }
    });
  }

  ngOnInit(): void {
    this.updateCountdown();
    // Mettre à jour toutes les secondes
    this.intervalId = window.setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const now = Date.now();
    const remaining = this.endDate - now;
    this.timeRemaining.set(Math.max(0, remaining));
  }
}

