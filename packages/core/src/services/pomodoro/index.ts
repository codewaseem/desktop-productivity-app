enum PomodoroState {
  Started = "Started",
  Stopped = "Stopped",
  Paused = "Paused",
}

export default class Pomodoro {
  private state: PomodoroState = PomodoroState.Stopped;
  private _startedAt = 0;
  private _pausedAt = 0;
  static DEFAULT_COUNTDOWN_TIME = 1000 * 60 * 25;

  get countdown(): number {
    return Pomodoro.DEFAULT_COUNTDOWN_TIME - this.elapsedTime;
  }

  get elapsedTime(): number {
    if (this.isStarted) return Date.now() - this._startedAt;
    else if (this.isPaused) return this._pausedAt - this._startedAt;

    return 0;
  }

  get isStarted(): boolean {
    return this.state == PomodoroState.Started;
  }

  get isPaused(): boolean {
    return this.state == PomodoroState.Paused;
  }

  get isStopped(): boolean {
    return this.state == PomodoroState.Stopped;
  }

  private get startedAt(): number {
    return this._startedAt;
  }

  private set startedAt(value: number) {
    this._startedAt = value;
  }

  private get pausedAt(): number {
    return this._pausedAt;
  }

  private set pausedAt(value) {
    this._pausedAt = value;
  }

  start(): void {
    if (this.isStarted) return;
    else if (this.isPaused) {
      this._startedAt += Date.now() - this._pausedAt;
      this.state = PomodoroState.Started;
      this._pausedAt = 0;
    } else {
      this.state = PomodoroState.Started;
      this._startedAt = Date.now();

      const timerId = setInterval(() => {
        if (this.countdown <= 0) {
          this.stop();
          clearInterval(timerId);
        }
      }, 100);
    }
  }

  stop(): void {
    if (this.isStopped) return;

    this.state = PomodoroState.Stopped;
    this.startedAt = 0;
  }

  pause(): void {
    if (!this.isStarted) return;
    this.state = PomodoroState.Paused;
    this.pausedAt = Date.now();
  }
}
