import App from "./app/app";

export const app = new App([]);

export const EventNames = App.events;

export const setPomodoroTime = (time: number) =>
  (App.constants.POMODORO_TIME = time);
