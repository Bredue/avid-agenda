import React, { useState } from "react";
import styles from '../../styles/App.module.css';

const SidebarMenu = () => {

    const [activeTab, setActiveTab] = useState('classes');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.sidebarMenuContainer}>
            <div className={styles.sidebarMenu}>
                <button
                    className={`${styles.sideBarMenuButton} ${activeTab === 'classes' ? styles.active : ''}`}
                    onClick={() => handleTabClick('classes')}
                >
                    Classes
                </button>
                <button
                    className={`${styles.sideBarMenuButton} ${activeTab === 'tasks' ? styles.active : ''}`}
                    onClick={() => handleTabClick('tasks')}
                >
                    Tasks
                </button>
                <button
                    className={`${styles.sideBarMenuButton} ${activeTab === 'events' ? styles.active : ''}`}
                    onClick={() => handleTabClick('events')}
                >
                    Events
                </button>
            </div>
        </div>
    );
};

export default SidebarMenu;