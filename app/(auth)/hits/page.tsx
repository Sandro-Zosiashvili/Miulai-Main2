'use client';

import HitsTable from '../../components/Table/HitsTable/HitsTable'
import Input from '../../components/Input/Input';
import News from '../../components/News/News';
import ReusableHeader from '../../components/ReusableHeader/ReusableHeader';
import Table from '../../components/Table/Table';
import styles from './page.module.scss';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from "js-cookie";


const Hits = () => {
    const [topHit, setTopHIt] = useState<any>()

    const token = Cookies.get('token');

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music`, {
            headers: {'Authorization': `Bearer ${token}`},
        })
            .then((r) => {
                setTopHIt(r.data[0])
            });
    }, []);


    return (
        <div className={styles.container}>
            <ReusableHeader/>
            <News album={false} title={topHit?.name} image={topHit?.author?.artistCover} plays={topHit?.playCount}/>
            {/* <Input /> */}
            <HitsTable/>
        </div>
    )
}

Hits.displayName = 'Hits'

export default Hits;