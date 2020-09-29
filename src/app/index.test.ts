import { ITracker } from "../types";
import App from "./app";

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

  it("emitting stop event should stop all the trackers", () => {
    const stopTrackingSpy = jest.spyOn(app, "stopTracking");

    app.emit(App.events.STOP_TRACKING);

    expect(stopTrackingSpy).toHaveBeenCalled();
  });

  it("should emit stopped tracking event after all trackers are stopped", (done) => {
    app.on(App.events.STOPPED_TRACKING, () => {
      expect(true).toBeTruthy();
      done();
    });

    app.emit(App.events.STOP_TRACKING);
  });
});
