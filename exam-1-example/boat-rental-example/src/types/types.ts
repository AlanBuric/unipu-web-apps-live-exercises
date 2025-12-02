export interface Boat {
  id: number;
  name: string;
  type: string;
  length: number;
  costPerDay: number;
  engineHorsepower: number;
}

export interface Rental {
  id: number;
  boatId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface DatabaseSchema {
  boats: Boat[];
  rentals: Rental[];
}
