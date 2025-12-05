export interface Bet {
  datetime: string;            // Format ISO, ex: "2025-11-03"
  amount: number;          // Montant du pari
  gender: string;          // Exemple: "Fille"
  symbolic_object: string; // Exemple: "Couche"
}

export interface BetAll {
  id:number;
  user_id:number;
  datetime: string;            // Format ISO, ex: "2025-11-03"
  amount: number;          // Montant du pari
  gender: string;          // Exemple: "Fille"
  symbolic_object: string; // Exemple: "Couche"
}

export interface CreateBetRequest {
  amount: number;           // Montant du pari
  gender: string;           // Exemple: "Fille"
  symbolic_object: string;  // Exemple: "Couche"
}

export interface BetStatResponse {
  boy_odds: number;
  girl_odds: number;
  total_bets: number;
  boy_total: number;
  girl_total: number;
  distribution: BetDistribution[];
  last_bet: BetUserResponse;
  odds_history: OddsSnapshot[];
}

export interface BetDistribution {
  percentage: number;
  gender: string;
}

export interface BetUserResponse {
  amount: number;
  gender: string;
}

export interface OddsSnapshot {
  datetime: string;
  boy_odds: number;
  girl_odds: number;
}
