import App from "./app/app";
import Pomodoro from "./services/pomodoro";

export const app = new App([]);

export const EventNames = App.events;

export const setPomodoroTime = (time: number) =>
  (App.constants.POMODORO_TIME = time);

export { Pomodoro };
