import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  constructor() { }

  // Détecter si l'utilisateur est sur un appareil mobile
  isMobile(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
  }

  // Détecter si l'utilisateur est sur une tablette
  isTablet(): boolean {
    return /Tablet|iPad/i.test(window.navigator.userAgent);
  }

  // Détecter si l'utilisateur est sur un PC de bureau
  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  // Obtenir les dimensions de l'écran
  getScreenWidth(): number {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  // Obtenir la densité des pixels de l'appareil
  getPixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  // Obtenir la taille de l'écran
  getDeviceSize(): string {
    const width = this.getScreenWidth();
    if (width < 600) {
      return 'small';  // Par exemple, pour les petits téléphones comme iPhone SE
    } else if (width >= 600 && width < 1200) {
      return 'medium'; // Par exemple, pour les téléphones comme le Pixel 7
    } else {
      return 'large';  // Par exemple, pour les tablettes ou PC
    }
  }
}
