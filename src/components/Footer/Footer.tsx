import styles from '../../styles/App.module.css';

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <p>
        AVID® Agenda, an Open Source Project - &nbsp;
        <a href="https://github.com/Bredue/avid-agenda">Github</a>
      </p>
    </div>
  )
};

export default Footer;