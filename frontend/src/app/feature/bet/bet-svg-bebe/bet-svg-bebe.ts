import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bet-svg-bebe',
  imports: [],
  templateUrl: './bet-svg-bebe.html',
  styleUrl: './bet-svg-bebe.scss'
})
export class BetSvgBebe {
  @Input() offsetStart: string = '0%';
  @Input() offsetMidStart: string = '30%';
  @Input() offsetMidEnd: string = '70%';
  @Input() offsetEnd: string = '100%';

  @Input() startColor: string = 'blue';
  @Input() midStartColor: string = 'blue';
  @Input() midEndColor: string = 'pink';
  @Input() endColor: string = 'pink';
}
