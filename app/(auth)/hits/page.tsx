'use client';

import HitsTable from '../../components/Table/HitsTable/HitsTable'
import Input from '../../components/Input/Input';
import News from '../../components/News/News';
import ReusableHeader from '../../components/ReusableHeader/ReusableHeader';
import Table from '../../components/Table/Table';
import styles from './page.module.scss';
import {useEffect, useState} from 'react';
import axios from 'axios';


const Hits = () => {
    const [topHit, setTopHIt] = useState<any>()

    useEffect(() => {
        axios.get("http://localhost:3004/music"
        )
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