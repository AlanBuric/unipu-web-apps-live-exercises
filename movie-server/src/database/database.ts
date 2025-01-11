import { Actor, Movie } from '../types/database-types.js';

type DatabaseSchema = {
  actors: Actor[];
  movies: Movie[];
};

const database: DatabaseSchema = {
  actors: [
    {
      id: 123,
      name: 'Morgan Freeman',
      birthYear: 1937,
      movies: [4222334],
    },
    {
      id: 234,
      name: 'Marlon Brando',
      birthYear: 1924,
      movies: [5211223],
    },
    {
      id: 345,
      name: 'Al Pacino',
      birthYear: 1940,
      movies: [5211223],
    },
  ],
  movies: [
    {
      id: 4222334,
      title: 'The Shawshank Redemption',
      year: 1994,
      genre: 'Drama',
      director: 'Frank Darabont',
    },
    {
      id: 5211223,
      title: 'The Godfather',
      year: 1972,
      genre: 'Crime',
      director: 'Francis Ford Coppola',
    },
    {
      id: 4123123,
      title: 'The Dark Knight',
      year: 2008,
      genre: 'Action',
      director: 'Christopher Nolan',
    },
  ],
};

export function randomId(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

export default database;
