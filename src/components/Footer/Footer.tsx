import { useEffect, useState } from 'react';
import styles from '../../styles/App.module.css';

const Footer = () => {

  const [footerActive, setFooterActive] = useState(true);

  useEffect(() => {
    mountFooterTimeout();
  }, []);

  const mountFooterTimeout = () => {
    setTimeout(() => {
      setFooterActive(false);
    }, 15000);
  };

  if (footerActive === true) {
    return (
      <div className={styles.footerContainer}>
        <p>
          AVID® Agenda, an Open Source Project - &nbsp;
          <a href="https://github.com/Bredue/avid-agenda">Github</a>
        </p>
      </div>
    )
  } else {
    return <></>
  }
};

export default Footer;