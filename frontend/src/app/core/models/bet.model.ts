interface Bet {
  date: string;            // Format ISO, ex: "2025-11-03"
  amount: number;          // Montant du pari
  gender: string;          // Exemple: "Fille"
  symbolic_object: string; // Exemple: "Couche"
}

interface CreateBetRequest {
  amount: number;           // Montant du pari
  gender: string;           // Exemple: "Fille"
  symbolic_object: string;  // Exemple: "Couche"
}
