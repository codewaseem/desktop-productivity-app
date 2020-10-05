import { promisify } from "util";
import Pomodoro from ".";

const defaultPomodoroCountdown = 1000 * 60 * 25;

const delay = promisify(setTimeout);

describe("Pomodoro Countdown", () => {
  let pomodoro: Pomodoro;

  beforeEach(() => {
    pomodoro = new Pomodoro();
  });

  it("should be defined and must have start, stop, pause methods", () => {
    expect(pomodoro).toBeDefined();
    expect(pomodoro.start).toBeInstanceOf(Function);
    expect(pomodoro.stop).toBeInstanceOf(Function);
    expect(pomodoro.pause).toBeInstanceOf(Function);
  });

  it("it should have countdown, isStopped, isRunning, isPaused property", () => {
    expect(pomodoro.countdown).toBe(defaultPomodoroCountdown);
    expect(pomodoro.isStopped).toBe(true);
    expect(pomodoro.isStarted).toBe(false);
    expect(pomodoro.isPaused).toBe(false);
  });

  it("starting the timer should update the state", () => {
    pomodoro.start();

    expect(pomodoro.isStopped).toBe(false);
    expect(pomodoro.isStarted).toBe(true);
    expect(pomodoro.isPaused).toBe(false);
  });

  it("pausing the timer should update the state accordingly", () => {
    pomodoro.start();
    pomodoro.pause();

    expect(pomodoro.isStopped).toBe(false);
    expect(pomodoro.isStarted).toBe(false);
    expect(pomodoro.isPaused).toBe(true);
  });

  it("started timer should properly update the countdown time", async () => {
    jest.useRealTimers();

    pomodoro.start();

    await delay(100);

    expect(pomodoro.countdown / 1000).toBeCloseTo(
      (defaultPomodoroCountdown - 100) / 1000
    );

    await delay(100);
    expect(pomodoro.countdown / 1000).toBeCloseTo(
      (defaultPomodoroCountdown - 200) / 1000
    );

    pomodoro.stop();

    expect(pomodoro.countdown).toBe(defaultPomodoroCountdown);
  });

  it("stopping timer should reset the countdown", async () => {
    jest.useRealTimers();

    pomodoro.start();
    await delay(200);
    expect(pomodoro.countdown).toBeLessThan(defaultPomodoroCountdown);

    pomodoro.stop();
    expect(pomodoro.countdown).toBe(defaultPomodoroCountdown);
  });

  it("stopping already stopped timer should do nothing", () => {
    const stopSpy = jest.spyOn<any, any>(pomodoro, "startedAt", "set");

    pomodoro.start();

    pomodoro.stop();
    pomodoro.stop();

    expect(stopSpy).toHaveBeenCalledTimes(1);
  });

  it("pausing the timer should pause the countdown and resume as expected", async () => {
    jest.useRealTimers();

    const runFor = [10, 20];
    const delayTime = 500;

    pomodoro.start();

    await delay(runFor[0]);

    expect(pomodoro.countdown / 1000).toBeCloseTo(
      (defaultPomodoroCountdown - runFor[0]) / 1000
    );

    pomodoro.pause();
    const pausedCountdown = pomodoro.countdown;
    expect(pomodoro.isPaused).toBe(true);

    await delay(delayTime);
    expect(pomodoro.countdown).toBe(pausedCountdown);

    pomodoro.start();
    await delay(runFor[1]);
    expect(pomodoro.countdown / 1000).toBeCloseTo(
      (defaultPomodoroCountdown - runFor.reduce((a, b) => a + b, 0)) / 1000
    );
  }, 10000);

  it("pausing already paused timer or if timer is not started should do nothing", () => {
    const pauseSpy = jest.spyOn<any, any>(pomodoro, "pausedAt", "set");

    pomodoro.pause();
    expect(pauseSpy).not.toHaveBeenCalled();

    pomodoro.start();
    pomodoro.pause();
    pomodoro.pause();

    expect(pauseSpy).toHaveBeenCalledTimes(1);
  });

  it("should automatically stop the timer after the countdown is finished", async () => {
    jest.useRealTimers();

    Pomodoro.DEFAULT_COUNTDOWN_TIME = 3000;

    const stopSpy = jest.spyOn<Pomodoro, "stop">(pomodoro, "stop");

    pomodoro.start();

    await delay(3200);

    expect(stopSpy).toHaveBeenCalled();
  });
});
