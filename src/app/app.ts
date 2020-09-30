import { EventEmitter } from "events";
import { ITracker } from "../types";

class App extends EventEmitter {
  private trackers: ITracker<unknown>[] = [];
  private pomodoroStartedAt = 0;
  private isTracking = false;
  private isPomodoroRunning = false;

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

    this.on(App.events.START_POMODORO, () => {
      this.startPomodoro();
    });
  }

  get currentPomodoroTime() {
    if (this.isPomodoroRunning) {
      return Date.now() - this.pomodoroStartedAt;
    }
    return 0;
  }

  static events = {
    START_TRACKING: "start-tracking",
    STARTED_TRACKING: "started-tracking",
    STOP_TRACKING: "stop-tracking",
    STOPPED_TRACKING: "stopped-tracking",
    START_POMODORO: "start-pomodoro",
    STOPPED_POMODORO: "stopped-pomodoro",
  };

  static constants = {
    POMODORO_TIME: 1000 * 60 * 25, // 25 minutes
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

  async startPomodoro() {
    this.pomodoroStartedAt = Date.now();
    this.isPomodoroRunning = true;

    await this.delay(App.constants.POMODORO_TIME);

    this.isPomodoroRunning = false;
    this.pomodoroStartedAt = 0;
    this.emit(App.events.STOPPED_POMODORO);
  }

  private delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  private toggleTrackingStatus() {
    this.isTracking = !this.isTracking;
  }
}

export default App;
