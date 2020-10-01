import IoTracker from "./io";

describe("IO (Keyboard, Mouse, ScreenCapture) Tracker", () => {
  it("it should have start method", () => {
    expect(IoTracker.start).toBeInstanceOf(Function);
  });

  it("it should have stop method", () => {
    expect(IoTracker.stop).toBeInstanceOf(Function);
  });

  it("it should have getData method", () => {
    expect(IoTracker.getData).toBeInstanceOf(Function);
  });
});
