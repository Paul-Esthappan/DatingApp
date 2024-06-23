import React from 'react';
import styles from './sidebar.module.css';
import { 
  BsCart3, 
  BsGrid1X2Fill, 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill, 
  BsPeopleFill, 
  BsListCheck, 
  BsMenuButtonWideFill, 
  BsFillGearFill 
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? styles.sidebarResponsive : ''}>
        <div className={styles.sidebarTitle}>
            <div className={styles.sidebarBrand}>
                <BsCart3 className={styles.iconHeader}/> SHOP
            </div>
            <span className={`${styles.icon} ${styles.closeIcon}`} onClick={OpenSidebar}>X</span>
        </div>

        <ul className={styles.sidebarList}>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsGrid1X2Fill className={styles.icon}/> Dashboard
                </a>
            </li>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsFillArchiveFill className={styles.icon}/> Products
                </a>
            </li>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsFillGrid3X3GapFill className={styles.icon}/> Categories
                </a>
            </li>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsPeopleFill className={styles.icon}/> Customers
                </a>
            </li>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsListCheck className={styles.icon}/> Inventory
                </a>
            </li>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsMenuButtonWideFill className={styles.icon}/> Reports
                </a>
            </li>
            <li className={styles.sidebarListItem}>
                <a href="">
                    <BsFillGearFill className={styles.icon}/> Setting
                </a>
            </li>
        </ul>
    </aside>
  );
}

export default Sidebar;
