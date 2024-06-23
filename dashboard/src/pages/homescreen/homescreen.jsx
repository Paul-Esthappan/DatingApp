import React from 'react';
import styles from './homescreen.module.css';
import Navbar from '../header/navbar';
import Sidebar from '../sideBar/sidebar';

import { 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill, 
  BsPeopleFill, 
  BsFillBellFill 
} from 'react-icons/bs';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';


function Home() {

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
    ];

  return (
    <>
    <Navbar/>
    <Sidebar/>
    <main className={styles.mainContainer}>
    <div className={styles.gridContainer}>
      

        <div className={styles.card}>
            <div className={styles.cardInner}>
                <h3>PRODUCTS</h3>
                <BsFillArchiveFill className={styles.cardIcon}/>
            </div>
            <h1>300</h1>
        </div>
        <div className={styles.card}>
            <div className={styles.cardInner}>
                <h3>CATEGORIES</h3>
                <BsFillGrid3X3GapFill className={styles.cardIcon}/>
            </div>
            <h1>12</h1>
        </div>
        <div className={styles.card}>
            <div className={styles.cardInner}>
                <h3>CUSTOMERS</h3>
                <BsPeopleFill className={styles.cardIcon}/>
            </div>
            <h1>33</h1>
        </div>
        <div className={styles.card}>
            <div className={styles.cardInner}>
                <h3>ALERTS</h3>
                <BsFillBellFill className={styles.cardIcon}/>
            </div>
            <h1>42</h1>
        </div>
        <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
</main>
</>
  )
}

export default Home;
