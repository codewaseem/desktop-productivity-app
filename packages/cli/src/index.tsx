import { app, EventNames, setPomodoroTime } from "@dp-app/core";
import { Box, render, Text } from "ink";
import React, { useEffect, useState } from "react";

const Counter = () => {
  const [countDown, setCountDown] = useState(
    new Date(app.pomodoroCountdown).toUTCString().substr(17, 8)
  );

  useEffect(() => {
    setPomodoroTime(1000 * 60);
    app.emit(EventNames.START_POMODORO);
    const timer = setInterval(() => {
      setCountDown(new Date(app.pomodoroCountdown).toUTCString().substr(17, 8));
    }, 100);

    return () => {
      clearInterval(timer);
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
        {countDown} time left
      </Text>
    </Box>
  );
};

render(<Counter />);
