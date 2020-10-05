import { app, EventNames, setPomodoroTime } from "@dp-app/core";
import { Box, render, Text } from "ink";
import React, { useEffect, useState } from "react";

const Counter = () => {
  const [countDown, setCountDown] = useState(
    new Date(app.pomodoroCountdown).toUTCString().substr(17, 8)
  );
  const [showDots, setShowDots] = useState(true);

  useEffect(() => {
    setPomodoroTime(1000 * 60);
    app.emit(EventNames.START_POMODORO);
    const timer = setInterval(() => {
      setCountDown(new Date(app.pomodoroCountdown).toUTCString().substr(17, 8));
    }, 100);

    const timer2 = setInterval(() => {
      setShowDots((prevValue) => !prevValue);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(timer2);
    };
  }, []);

  return (
    <Box
      borderStyle="bold"
      borderColor="green"
      margin={2}
      width="50%"
      flexDirection="column"
    >
      <Text color="black" backgroundColor="white">
        App by Waseem Ahmed
      </Text>
      <Text inverse color="green">
        {app.currentPomodoroTime && showDots ? ":: " : "   "}
        {countDown} time left
      </Text>
    </Box>
  );
};

render(<Counter />);
