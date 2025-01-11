export type Actor = {
  id: number;
  name: string;
  birthYear: number;
  movies: number[];
};

export type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  director: string;
};
