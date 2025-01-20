export type WithId<T> = T & {
  _id: string;
};

export type Task = {
  userId?: string;
  name: string;
  description: string;
  done: boolean;
  tagIds: string[];
};

export type Tag = {
  name: string;
  /**
   * RGB color encoded in 24 bits, where each of the three channels takes 1 byte.
   */
  color: number;
};

export type User = {
  username: string;
  hashedPassword: string;
};
