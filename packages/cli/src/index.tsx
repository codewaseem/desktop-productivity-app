import { app } from "@dp-app/core";
import { Box, render, Text } from "ink";
import React, { useEffect, useState } from "react";

() => {
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
};

const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1);
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
        {counter} tests passed
      </Text>
    </Box>
  );
};

render(<Counter />);
