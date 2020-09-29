import AppTracker from "./apps";

describe("Apps tracker", () => {
  it("AppTracker should be defined", () => {
    expect(AppTracker).toBeDefined();
  });

  it("should have a start() method", () => {
    expect(AppTracker.start).toBeInstanceOf(Function);
  });

  it("should have stop() method", () => {
    expect(AppTracker.stop).toBeInstanceOf(Function);
  });

  it("it should have getData() method", () => {
    expect(AppTracker.getData).toBeInstanceOf(Function);
  });
});
