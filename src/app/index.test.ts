import { EventEmitter } from "events";

class App extends EventEmitter {
  constructor() {
    super();
    this.on(App.events.START_TRACKING, () => {
      this.startTracking();
    });
  }

  static events = {
    START_TRACKING: "start-tracking",
  };

  startTracking() {
    console.log("Tracking started");
  }
}

const app = new App();

describe("App", () => {
  const startTrackingSpy = jest.spyOn(app, "startTracking");

  it("when start event is emitted, app should start tracking", () => {
    app.emit(App.events.START_TRACKING);

    expect(startTrackingSpy).toHaveBeenCalled();
  });
});
