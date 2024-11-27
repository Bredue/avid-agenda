import React, { useEffect } from "react";
import dayjs from "dayjs";

const Time = () => {

  const [currentTime, setCurrentTime] = React.useState(dayjs().format('h:mm:ss A'));
  
  useEffect(() => {
    const intervalController = setInterval(() => {
      setCurrentTime(dayjs().format('h:mm:ss A'));
    }, 1000)

    return () => clearInterval(intervalController);
  }, []);

  return (
    <p>
      {currentTime}
    </p>
  )
};

export default Time;