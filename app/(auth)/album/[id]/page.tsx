'use client'
import {useEffect, useState} from 'react'
import { cachedGet } from "@/app/lib/apiCache";
import Header from '../../../components/Header/Header'
import Input from '../../../components/Input/Input'
import News from '../../../components/News/News'
import Table from '../../../components/Table/Table'
import styles from './page.module.scss'
import Link from 'next/link'
import axios from 'axios'
import {useRecoilState} from 'recoil'
import {albumIdState, albumMusicFromArtistState, oneArrayMusicState, mudicIDState} from '@/app/state'
import Cookies from "js-cookie";
import {useParams} from 'next/navigation'


const AlbumID = () => {
    const [albumCover, setAlbumCover] = useState<string>('')
    const [albumName, setAlbumName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [albumPage, setAlbumPage] = useRecoilState<any>(albumMusicFromArtistState)
    const [musicArrayTwo, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState)
    const [, setMusicId] = useRecoilState(mudicIDState)
    const token = Cookies.get("token");
    const params = useParams();
    const id = params?.id;

    const musics: any[] = Array.isArray(musicArrayTwo) ? musicArrayTwo : [];
    const totalDuration = musics.reduce((sum, m) => sum + (m?.duration || 0), 0);
    const year = albumPage?.releaseDate ? new Date(albumPage.releaseDate).getFullYear() : undefined;

    const playAll = () => {
        if (!musics.length) return;
        setMusicArrayTwo(musics);
        setMusicId(musics[0].id);
    };
    const shuffleAll = () => {
        if (!musics.length) return;
        const shuffled = [...musics].sort(() => Math.random() - 0.5);
        setMusicArrayTwo(shuffled);
        setMusicId(shuffled[0].id);
    };



    useEffect(() => {
        cachedGet(`${process.env.NEXT_PUBLIC_BACKEND_URL}/album/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((r) => {
                setAlbumPage(r.data)
                setAlbumCover(r.data.albumImage)
                setAlbumName(r.data.albumName)
                setMusicArrayTwo(r.data.musics)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
            })
    }, [id, setAlbumPage, setMusicArrayTwo, token])

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <Header/>
                <div className={styles.bodyContainer}>
                    <News
                        album={true}
                        loading={loading}
                        title={albumName || 'Loading...'}
                        image={`${albumCover}`}
                        artist={albumPage?.artistName}
                        artistId={albumPage?.authorId}
                        year={year}
                        trackCount={musics.length}
                        totalDuration={totalDuration}
                        onPlayAll={playAll}
                        onShuffle={shuffleAll}
                    />
                    <Table
                        loading={loading}
                        albumName={albumName || ''}
                        albumImage={albumCover || ''}
                        musics={musicArrayTwo || []}/>
                </div>
            </div>
        </div>
    )
}

export default AlbumID
