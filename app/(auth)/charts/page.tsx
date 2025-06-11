'use client';
import ReusableHeader from '@/app/components/ReusableHeader/ReusableHeader';
import styles from './page.module.scss';
import News from '@/app/components/News/News';
import Input from '@/app/components/Input/Input';
import Tables from '@/app/components/Table/Table';
import Header from '@/app/components/Header/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChartTable from '../../components/ChartTable/ChartTable';


   
const Charts = () => {


    const [topHit, setTopHIt] = useState<any>()
    useEffect(() => {
        axios
            .get(
                `https://backend.miulai.ge/music`
            )
            .then(async (r) => {
                setTopHIt(r.data[0])
            });
    }, []);

    return(
        <div className={styles.container}>
            <ReusableHeader />
            <News title={'Top Hit Of The Week'} image={topHit?.albumCover} plays={topHit?.listenerCount} />
            <ChartTable />

        </div>
    )
}

export default Charts;