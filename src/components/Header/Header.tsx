import { FC, useEffect, useState } from "react";
import HeaderDate from "./Date";
import Time from "./Time";
import SidebarButton from "./SidebarButton";
import styles from '../../styles/App.module.css';
import Settings from "../../models/settings";

interface HeaderProps {
  sidebarStatus: boolean,
  changeSidebarStatus: () => void,
  headerRefresh: boolean,
}

const Header: FC<HeaderProps> = (props) => {

  const { 
    sidebarStatus, 
    changeSidebarStatus,
    headerRefresh,
  } = props;

  const [dayProgress, setDayProgress] = useState(0);
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
      const raw = localStorage.getItem("settings");

      if (!raw) return;

      try {
          setSettings(Settings.fromPlainObject(JSON.parse(raw)));
      } catch (err) {
          console.error("Failed to load settings", err);
      }

  }, [headerRefresh]);

  useEffect(() => {

    const updateProgress = () => {
      const { schoolStart, schoolEnd } = settings.schoolTimeSettings;

      const now = new Date();

      const [sh, sm] = schoolStart.split(":").map(Number);
      const [eh, em] = schoolEnd.split(":").map(Number);

      const start = new Date(now);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(now);
      end.setHours(eh, em, 0, 0);

      if (now <= start) {
          setDayProgress(0);
          return;
      }

      if (now >= end) {
          setDayProgress(100);
          return;
      }

      setDayProgress(
          ((now.getTime() - start.getTime()) /
              (end.getTime() - start.getTime())) *
              100
      );
    };

      updateProgress();

      const interval = setInterval(updateProgress, 30000);

      return () => clearInterval(interval);

  }, [settings]);

  return (
    <div className={styles.headerContainer}>
      <SidebarButton
        sidebarStatus={sidebarStatus}
        changeSidebarStatus={changeSidebarStatus}
      />
      <div className={styles.dateAndTimeContainer}>
        <HeaderDate />
        <Time />
      </div>
      {settings.progressBars.showDayProgress && (
        <div
            className={styles.dayProgress}
            style={{ width: `${dayProgress}%` }}
        />
      )}
    </div>
  )
};

export default Header;