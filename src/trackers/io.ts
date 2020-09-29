import type { ITracker } from "../types";

class IoTracker implements ITracker<void> {
  start(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  getData(): void {
    throw new Error("Method not implemented.");
  }
}

export default new IoTracker();
