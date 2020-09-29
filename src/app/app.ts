import { EventEmitter } from "events";
import { ITracker } from "../types";

class App extends EventEmitter {
  private trackers: ITracker<unknown>[] = [];

  private isTracking = false;

  constructor(trackers: ITracker<unknown>[]) {
    super();

    this.trackers = trackers;

    this.on(App.events.START_TRACKING, () => {
      if (!this.isTracking) {
        this.startTracking();
        this.toggleTrackingStatus();
      }
    });

    this.on(App.events.STOP_TRACKING, () => {
      if (this.isTracking) {
        this.stopTracking();
        this.toggleTrackingStatus();
      }
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
    const newTrackers = trackers instanceof Array ? trackers : [trackers];

    if (this.isTracking) newTrackers.forEach((tracker) => tracker.start());

    this.trackers.push(...newTrackers);
  }

  private toggleTrackingStatus() {
    this.isTracking = !this.isTracking;
  }
}

export default App;
