import {useEffect, useState} from 'react';
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
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music`, {
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
                <div
                    className={styles.container}
                    key={item.id}
                    onClick={() => {
                        setMusicArrayTwo(cardData)
                        setMusicId(item.id)
                        setGlobalMusic(item.id)
                        setAlbumId(item.author.id)
                        setAlbumRouter(item.album.id)

                    }}


                >
                    <div className={styles.container_author}>
                        <div>
                            <Image
                                className={styles.img}
                                src={item.album.albumImage}
                                alt={"album cover"}
                                width={72}
                                height={72}
                            />
                        </div>
                        <div className={styles.container_name}>
                            <div className={styles.music_name_font_style}>{item.name}</div>
                            <div className={styles.music_author_font_style}>
                                {item.artistName}
                            </div>
                        </div>
                    </div>
                    <div className={styles.container_detals}>
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
                                    width={24}
                                    height={24}
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
                </div>
            ))}
        </div>
    );
};

export default MusicCard;
