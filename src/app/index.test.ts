import { EventEmitter } from "events";
import { ITracker } from "../types";

const appUsageTracker: ITracker<void> = {
  getData: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
};

const keyboardMouseTracker: ITracker<void> = {
  getData: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
};

const internetUsageTracker: ITracker<void> = {
  getData: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
};

class App extends EventEmitter {
  private trackers: ITracker<unknown>[] = [];

  constructor(trackers: ITracker<unknown>[]) {
    super();

    this.trackers = trackers;

    this.on(App.events.START_TRACKING, () => {
      this.startTracking();
    });
  }

  static events = {
    START_TRACKING: "start-tracking",
    STARTED_TRACKING: "started-tracking",
  };

  startTracking() {
    this.trackers.forEach((tracker) => {
      tracker.start();
    });
    this.emit(App.events.STARTED_TRACKING);
  }

  appendTrackers(trackers: ITracker<unknown>[] | ITracker<unknown>) {
    if (trackers instanceof Array) {
      this.trackers.push(...trackers);
    } else {
      this.trackers.push(trackers);
    }

    this.startTracking();
  }
}

describe("App", () => {
  let app: App;
  let startTrackingSpy: jest.SpyInstance<void>;

  beforeEach(() => {
    app = new App([appUsageTracker, keyboardMouseTracker]);
    startTrackingSpy = jest.spyOn(app, "startTracking");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("when start event is emitted, app should start tracking", () => {
    app.emit(App.events.START_TRACKING);

    expect(startTrackingSpy).toHaveBeenCalled();
    expect(appUsageTracker.start).toHaveBeenCalled();
    expect(keyboardMouseTracker.start).toHaveBeenCalled();
  });

  it("should be able to add new trackers( during run-time)", () => {
    app.emit(App.events.START_TRACKING);

    expect(appUsageTracker.start).toHaveBeenCalledTimes(1);
    expect(keyboardMouseTracker.start).toHaveBeenCalledTimes(1);

    expect(internetUsageTracker.start).not.toHaveBeenCalled();

    app.appendTrackers(internetUsageTracker);

    expect(internetUsageTracker.start).toHaveBeenCalledTimes(1);
  });

  it("started tracking event should be emitted", (done) => {
    app.on(App.events.STARTED_TRACKING, () => {
      expect(true).toBeTruthy();
      done();
    });

    app.emit(App.events.START_TRACKING);
  });
});
