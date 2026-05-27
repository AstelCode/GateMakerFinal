/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILoader<T> {
  name: string;
  register(
    name: string,
    data: T,
    onLoaded?: (data: { name: string; data: any }) => void
  ): () => Promise<{ name: string; data: any }>;
}
