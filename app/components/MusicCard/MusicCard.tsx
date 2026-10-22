'use client';
import {useEffect, useState} from 'react';
import {motion} from "framer-motion";
import toast from "react-hot-toast";
import { cachedGet } from "@/app/lib/apiCache";
import HeartShapeBtn from '../heatShapeIcon/HeartShapeIcn';
import Icon from '../Icon/Icon';
import Image from 'next/image';
import styles from './MusicCard.module.scss'
import Playlist from '../Playlist/Playlist';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {
    albumidState,
    albumRouterState,
    clickFetchState,
    globalMusicState,
    mudicIDState,
    oneArrayMusicState
} from '@/app/state';
import Cookies from 'js-cookie';

const MusicCard = () => {
    const [active, setActive] = useState<number>();
    const [musicID, setMusicId] = useRecoilState(mudicIDState);
    const token = Cookies.get("token");
    const [cardData, setCardData] = useState<any>([]);
    const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);
    const [musicArrayTwo, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState);
    const [globalMusic, setGlobalMusic] = useRecoilState<any>(globalMusicState)
    const [albumId, setAlbumId] = useRecoilState(albumidState);
    const [albumRouter, setAlbumRouter] = useRecoilState<any>(albumRouterState)


    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    const [fetchMusic, setfetchMusic] = useState()

    // Fetching all music data
    useEffect(() => {
        cachedGet(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((r) => {
                setCardData(r.data);

            })
            .catch((error) => {
                console.error("Error fetching music list:", error);
            });
    }, [clickFetch]);


    return (
        <div className={styles.mainContainer}>
            {cardData.slice(0, 6).map((item: any, index: any) => (
                <motion.div
                    className={`${styles.container} ${item.id === musicID ? styles.playing : ""}`.trim()}
                    key={item.id}
                    initial={{opacity: 0, y: 14}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
                    whileHover={{y: -3}}
                    onClick={() => {
                        setMusicArrayTwo(cardData)
                        setMusicId(item.id)
                        setGlobalMusic(item.id)
                        setAlbumId(item.author.id)
                        setAlbumRouter(item.album.id)
                        toast.success(`Playing ${item.name}`)
                    }}


                >
                    <div className={styles.container_author}>
                        <div className={styles.thumb}>
                            <Image
                                className={styles.img}
                                src={item.album.albumImage}
                                alt={"album cover"}
                                width={56}
                                height={56}
                            />
                            <div className={styles.playOverlay}>
                                <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
                                    <path d="M8 5v14l11-7z" fill="#fff"/>
                                </svg>
                            </div>
                        </div>
                        <div className={styles.container_name}>
                            <div className={styles.music_name_font_style}>{item.name}</div>
                            <div className={styles.music_author_font_style}>
                                {item.artistName}
                            </div>
                        </div>
                    </div>
                    <div className={styles.container_detals}>
                        {item.id === musicID && (
                            <span className={styles.eqMini} aria-hidden="true">
                                <i/><i/><i/><i/>
                            </span>
                        )}
                        <div className={styles.time_font_style}>{formatDuration(item.duration)}</div>
                        <div className={styles.container_like_point}>
                            <HeartShapeBtn
                                isDisabled={false}
                                isActive={true}
                                onClick={() => console.log("button clicked")}
                            />
                            <div
                                className={styles.cursor}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActive(active === item.id ? undefined : item.id);
                                    setAlbumId(item.author.id)
                                    setAlbumRouter(item.album.id)
                                }}
                            >
                                <Image
                                    src={"./Dots.svg"}
                                    alt="Dots button"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <div className={styles.cellPlaylist}>
                                {active === item.id && (
                                    <div className={styles.playlist}>
                                        <Playlist/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default MusicCard;
