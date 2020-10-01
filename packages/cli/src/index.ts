import { app } from "@dp-app/core";

(() => {
  app.emit("start-pomodoro");

  setInterval(() => {
    const time = new Date(app.currentPomodoroTime);
    console.log(
      `${time.getUTCMinutes()}:${time.getUTCSeconds()}`,
      time.toTimeString(),
      time.toLocaleTimeString(),
      time.toUTCString().substr(17, 8)
    );
  }, 5000);
})();
