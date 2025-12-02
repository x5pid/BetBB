import { Directive, ElementRef, Input, Renderer2, HostListener, OnInit, AfterViewInit, OnChanges, SimpleChanges, Signal, effect } from '@angular/core';

@Directive({
  selector: '[appCoinDrop]'
})
export class CoinDropDirective implements OnInit, AfterViewInit  {
  @Input() count = 0;  // Nombre de pièces
  @Input() launch = false;  // Lancer l'animation (à activer depuis le parent)
  @Input() jarId!: string;  // ID du jar pour la destination

  @Input() actif?: Signal<boolean>;
  
  private nextId = 0;
  private coins: { id: number, delay: string, translateX: string, translateY: string, endx :string,endy:string }[] = [];

  private jarElement: HTMLElement | null = null;  // Élément du jar (destinataire)

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      if (this.actif && this.actif()) {
        this.onLaunch();
      }
    });
  }

  ngOnInit() {
    if (!this.jarId) {
      console.error('L\'id du "jar" doit être spécifié.');
      return;
    }
  }

  ngAfterViewInit() {
    // Recherche de l'élément du "jar" après l'initialisation du DOM
    this.jarElement = document.getElementById(this.jarId);
    if (!this.jarElement) {
      console.error(`Le jar avec l'ID "${this.jarId}" n'a pas été trouvé.`);
    }
  }


  @HostListener('click')
  onClick() {
    if (this.launch && this.jarElement) {
      this.onLaunch();
    }
  }

  private onLaunch() {
    if(this.jarElement){
      this.coins = [];
      const { endx, endy,width,height } = this.calculateAnimationPath(this.el.nativeElement, this.jarElement);
      for (let i = 0; i < this.count; i++) {
        this.coins.push({
          id: this.nextId++,
          delay: `${Math.random() * 0.5}s`, // Délai aléatoire pour l'animation
          translateX: `${endx + (Math.floor(Math.random() * width * 2) + 1)-width}px`,
          translateY: `${endy + (Math.floor(Math.random() * height * 2) + 1)-height}px`,
          endx:`${endx}px`,
          endy:`${endy}px`,
        });
      }
      this.updateCoins();
    }
  }

  private updateCoins() {
    const container = this.el.nativeElement; // Le bouton lui-même est le conteneur
    if (container) {
      this.coins.forEach(coin => {
        const coinElement = this.renderer.createElement('span');
        this.renderer.addClass(coinElement, 'coin');
        this.renderer.setStyle(coinElement, 'animation-delay', coin.delay);
        coinElement.setAttribute('style', `--translateX: ${coin.translateX}; --translateY: ${coin.translateY};--endx: ${coin.endx};--endy: ${coin.endy};`);

        // Créer l'élément SVG
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <circle cx="10" cy="10" r="9" fill="gold" stroke="black" stroke-width="2"/>
            <text x="10" y="14" font-size="10" text-anchor="middle" fill="black">Coin</text>
          </svg>
        `;
        coinElement.innerHTML = svgContent;
        this.renderer.appendChild(container, coinElement);

        // Ajouter un listener pour supprimer la pièce à la fin de l'animation
        this.renderer.listen(coinElement, 'animationend', () => {
          this.removeCoin(coin.id);
          this.renderer.removeChild(container, coinElement);
        });
      });
    }
  }


  private removeCoin(id: number) {
    this.coins = this.coins.filter(c => c.id !== id);
  }

  private calculateAnimationPath(button: HTMLElement, jar: HTMLElement) {
    const buttonPos = this.getElementPosition(button);
    const jarPos = this.getElementPosition(jar);
    // Calculer la position du centre de chaque élément
    const buttonCenterX = buttonPos.left + button.clientWidth / 2;
    const buttonCenterY = buttonPos.top + button.clientHeight / 2;
    const jarCenterX = jarPos.left + jar.clientWidth / 2;
    const jarCenterY = jarPos.top + jar.clientHeight / 2;

    // Calculer le déplacement en X et Y par rapport au centre
    const endx = jarCenterX - buttonCenterX;
    const endy = jarCenterY - buttonCenterY;

    const width = button.clientWidth;
    const height = button.clientHeight;

    return { endx, endy, width, height };
  }

  private getElementPosition(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }
}
