export type Task = {
  name: string;
  description: string;
  done: boolean;
  tagIds: string[];
}

export type Tag = {
  name: string;
  /**
   * RGB color encoded in 24 bits, where each of the three channels takes 1 byte.
   */
  color: number;
}