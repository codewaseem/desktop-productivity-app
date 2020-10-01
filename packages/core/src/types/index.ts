export interface ITracker<T> {
  start(): void;
  stop(): void;
  getData(): T;
}
