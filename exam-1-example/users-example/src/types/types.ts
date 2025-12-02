export type User = {
  id: number;
  ime: string;
  prezime: string;
};

export type DatabaseSchema = {
  korisnici: User[];
};
