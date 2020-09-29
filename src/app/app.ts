import { EventEmitter } from "events";
import { ITracker } from "../types";

class App extends EventEmitter {
  private trackers: ITracker<unknown>[] = [];

  constructor(trackers: ITracker<unknown>[]) {
    super();

    this.trackers = trackers;

    this.on(App.events.START_TRACKING, () => {
      this.startTracking();
    });

    this.on(App.events.STOP_TRACKING, () => {
      this.stopTracking();
    });
  }

  static events = {
    START_TRACKING: "start-tracking",
    STARTED_TRACKING: "started-tracking",
    STOP_TRACKING: "stop-tracking",
    STOPPED_TRACKING: "stopped-tracking",
  };

  startTracking(): void {
    this.trackers.forEach((tracker) => {
      tracker.start();
    });
    this.emit(App.events.STARTED_TRACKING);
  }

  stopTracking(): void {
    this.trackers.forEach((tracker) => {
      tracker.stop();
    });
    this.emit(App.events.STOPPED_TRACKING);
  }

  appendTrackers(trackers: ITracker<unknown>[] | ITracker<unknown>): void {
    if (trackers instanceof Array) {
      this.trackers.push(...trackers);
    } else {
      this.trackers.push(trackers);
    }

    this.startTracking();
  }
}

export default App;
