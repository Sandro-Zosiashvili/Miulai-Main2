"use client"; // Mark the component as a Client Component
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useParams} from 'next/navigation'; // For Next.js 13 (App Router)
import Header from "@/app/components/Header/Header";
import News from "@/app/components/News/News";
import TabbedNav from "@/app/components/TabbedNav/TabbedNav";
import styles from "./page.module.scss";
import axios from 'axios';
import Cookies from "js-cookie";

const Artist = () => {
    const router = useRouter();
    const {id} = useParams();
    const [artistPhoto, setArtistPhoto] = useState('');
    const [artistName, setArtistName] = useState('');
    const token = Cookies.get('token');



    useEffect(() => {

        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/author/${id}`, {
            headers: {'Authorization': `Bearer ${token}`},
        })
            .then((r) => {
                const artistData = r.data;
                setArtistPhoto(artistData?.artistCover || '');
                setArtistName(artistData.artistName);

            })
            .catch((error) => {
            });


    }, [id]);

    return (
        <div className={styles.container}>
            <Header/>
            <News artistPage={true} title={artistName} image={`${artistPhoto}`}/>
            <TabbedNav biographyText={""}/>
        </div>
    );
};

export default Artist;