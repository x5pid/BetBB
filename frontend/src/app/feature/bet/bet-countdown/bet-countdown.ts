import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bet-countdown',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './bet-countdown.html',
  styleUrl: './bet-countdown.scss'
})
export class BetCountdown implements OnInit, OnDestroy {
  // Date de fin des paris (à configurer ou récupérer depuis le backend)
  // Format: Date ISO string ou timestamp
  private readonly endDate = new Date('2025-12-31T23:59:59').getTime();
  
  private intervalId?: number;
  
  timeRemaining = signal<number>(0);
  
  days = computed(() => Math.floor(this.timeRemaining() / (1000 * 60 * 60 * 24)));
  hours = computed(() => Math.floor((this.timeRemaining() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  minutes = computed(() => Math.floor((this.timeRemaining() % (1000 * 60 * 60)) / (1000 * 60)));
  seconds = computed(() => Math.floor((this.timeRemaining() % (1000 * 60)) / 1000));
  
  isExpired = computed(() => this.timeRemaining() <= 0);
  isUrgent = computed(() => this.timeRemaining() < 24 * 60 * 60 * 1000); // Moins de 24h

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

