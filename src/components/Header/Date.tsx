import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from '../../styles/App.module.css';

const Date = () => {

  const [date, setDate] = useState(dayjs().format('MMMM, ddd DD, YY'));

  useEffect(() => {
    const intervalController = setInterval(() => {
      setDate(dayjs().format('MMMM, ddd DD, YY'));
    }, 3600000)

    return () => clearInterval(intervalController);

  })

  return (
    <p className={styles.dateText}>
      {date}
    </p>
  )
};

export default Date;