import { Pomodoro } from "@dp-app/core";
import { Box, render, Text, useApp, useInput } from "ink";
import React, { useEffect, useState } from "react";

Pomodoro.DEFAULT_COUNTDOWN_TIME = 10000;
const pomodoro = new Pomodoro();

const Counter = () => {
  const { exit } = useApp();
  const [keyPressed, setKeyPressed] = useState("");
  const [countdown, setCountdown] = useState(pomodoro.countdown);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCountdown(pomodoro.countdown);
    }, 200);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useInput((input, key) => {
    if (input == "q") {
      exit();
    }

    if (input == "s") {
      setKeyPressed(input);
      pomodoro.start();
    }

    if (input == "x") {
      setKeyPressed(input);
      pomodoro.stop();
    }

    if (input == "p") {
      setKeyPressed(input);
      pomodoro.pause();
    }
  });

  return (
    <Box margin={1} width="50%" flexDirection="column" padding={1}>
      <Text>
        To start the timer press (s), to stop the timer press (x), to pause the
        timer press (p)
      </Text>
      <Text inverse color="green">
        {keyPressed && `You pressed ${keyPressed}`}
      </Text>

      <Text>{new Date(countdown).toUTCString().substr(17, 8)}</Text>
    </Box>
  );
};

render(<Counter />);
