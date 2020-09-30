import { promisify } from "util";
import { ITracker } from "../types";
import App from "./app";

const delay = promisify(setTimeout);

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

describe("App: startTracking", () => {
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

  it("already started tracker should not start tracking again", () => {
    app.emit(App.events.START_TRACKING);
    app.emit(App.events.START_TRACKING);

    expect(startTrackingSpy).toHaveBeenCalledTimes(1);
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

describe("App: stopTracking", () => {
  let app: App;
  let stopTrackingSpy: jest.SpyInstance<void>;

  beforeEach(() => {
    app = new App([appUsageTracker, keyboardMouseTracker]);
    stopTrackingSpy = jest.spyOn(app, "stopTracking");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("emitting stop event should stop all the trackers", () => {
    app.emit(App.events.START_TRACKING);

    app.appendTrackers(internetUsageTracker);

    app.emit(App.events.STOP_TRACKING);

    expect(stopTrackingSpy).toHaveBeenCalled();
    expect(appUsageTracker.stop).toHaveBeenCalled();
    expect(keyboardMouseTracker.stop).toHaveBeenCalled();

    expect(internetUsageTracker.stop).toHaveBeenCalled();
  });

  it("emitting stop event twice should only call stopTracking once", () => {
    app.emit(App.events.START_TRACKING);

    app.emit(App.events.STOP_TRACKING);
    app.emit(App.events.STOP_TRACKING);

    expect(stopTrackingSpy).toHaveBeenCalledTimes(1);
  });

  it("should emit stopped tracking event after all trackers are stopped", (done) => {
    app.emit(App.events.START_TRACKING);

    app.on(App.events.STOPPED_TRACKING, () => {
      expect(true).toBeTruthy();
      done();
    });

    app.emit(App.events.STOP_TRACKING);
  });
});

describe("App: pomodoroTimer", () => {
  let app: App;
  let startPomodoroSpy: jest.SpyInstance;
  let stopPomodoroSpy: jest.SpyInstance<void>;

  beforeEach(() => {
    app = new App([appUsageTracker, keyboardMouseTracker]);
    startPomodoroSpy = jest.spyOn(app, "startPomodoro");
    stopPomodoroSpy = jest.spyOn(app, "stopPomodoro");
  });

  it("should be able to start a pomodoro session", () => {
    app.emit(App.events.START_POMODORO);

    expect(startPomodoroSpy).toHaveBeenCalled();
  });

  it("should automatically stop the pomodoro session once the session time is completed", (done) => {
    jest.useFakeTimers();

    app.emit(App.events.START_POMODORO);

    jest.advanceTimersByTime(App.constants.POMODORO_TIME);

    app.on(App.events.STOPPED_POMODORO, () => {
      done();
    });
  });

  it("should be able to track the current pomodoro session time", async (done) => {
    App.constants.POMODORO_TIME = 1000 * 5; // run for 5 secs total

    jest.useRealTimers();

    expect(app.currentPomodoroTime).toBe(0);
    app.emit(App.events.START_POMODORO);

    // check status after some time
    await delay(3);
    expect(app.currentPomodoroTime).toBeGreaterThan(2);

    app.on(App.events.STOPPED_POMODORO, () => {
      expect(app.currentPomodoroTime).toBe(0);
      done();
    });
  });

  it("already started pomodoro timer should do nothing", () => {
    app.emit(App.events.START_POMODORO);
    app.emit(App.events.START_POMODORO);

    expect(startPomodoroSpy).toBeCalledTimes(1);
  });

  it("can manually stop pomodoro timer", (done) => {
    app.emit(App.events.START_POMODORO);

    app.on(App.events.STOPPED_POMODORO, () => {
      expect(app.currentPomodoroTime).toBe(0);
      done();
    });

    app.emit(App.events.STOP_POMODORO);

    expect(stopPomodoroSpy).toHaveBeenCalled();
  });

  it("already stopped pomodoro timer should do nothing", () => {
    app.emit(App.events.START_POMODORO);

    app.emit(App.events.STOP_POMODORO);
    app.emit(App.events.STOP_POMODORO);

    expect(stopPomodoroSpy).toHaveBeenCalledTimes(1);
  });
});
