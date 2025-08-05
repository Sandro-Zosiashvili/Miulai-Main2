"use client"; // Mark the component as a Client Component
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useParams} from 'next/navigation'; // For Next.js 13 (App Router)
import Header from "@/app/components/Header/Header";
import News from "@/app/components/News/News";
import TabbedNav from "@/app/components/TabbedNav/TabbedNav";
import styles from "./page.module.scss";
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {albumidState, formusicFetchState} from '@/app/state';

const Artist = () => {
    const router = useRouter();
    // const param = useParams(); 
    const {id} = useParams();

    const [albumId, setAlbumId] = useRecoilState(albumidState);
    const [viewArtist, setViewArtist] = useRecoilState(formusicFetchState)

    const [artistPhoto, setArtistPhoto] = useState('');
    const [artistName, setArtistName] = useState('');

    useEffect(() => {

        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/author/${id}`)
            .then((response) => {
                const artistData = response.data;
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