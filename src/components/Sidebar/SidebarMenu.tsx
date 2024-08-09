import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';

interface SidebarMenuProps {
    sidebarMenuStatus: string,
    changeSidebarMenuStatus: (requestedMenu: string) => void,
}

const SidebarMenu:FC<SidebarMenuProps> = (props) => {

    const { sidebarMenuStatus, changeSidebarMenuStatus } = props;

    const handleTabClick = (tab: string) => {
        changeSidebarMenuStatus(tab);
    };

    return (
        <div className={styles.sidebarMenuContainer}>
            <div className={styles.sidebarMenu}>
                <button
                    className={`${styles.sideBarMenuButton} ${sidebarMenuStatus === 'classes' ? styles.active : ''}`}
                    onClick={() => handleTabClick('classes')}
                >
                    Classes
                </button>
                <button
                    className={`${styles.sideBarMenuButton} ${sidebarMenuStatus === 'agendas' ? styles.active : ''}`}
                    onClick={() => handleTabClick('agendas')}
                >
                    Agendas
                </button>
                <button
                    className={`${styles.sideBarMenuButton} ${sidebarMenuStatus === 'events' ? styles.active : ''}`}
                    onClick={() => handleTabClick('events')}
                >
                    Events
                </button>
            </div>
        </div>
    );
};

export default SidebarMenu;