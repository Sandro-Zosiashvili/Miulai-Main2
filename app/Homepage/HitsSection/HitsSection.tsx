import Card from '@/app/components/Card/Card';
import styles from './HitsSection.module.scss';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useRecoilState} from 'recoil';
import {
    clickFetchState,
    globalMusicState,
    formusicFetchState,
    albumidState,
    albumIdState,
    mudicIDState,
    oneArrayMusicState,
    albumRouterState
} from '@/app/state';
import {useRouter} from "next/navigation";


const HitsSection = () => {
    const [musics, setMusics] = useState<any>([])
    const token = Cookies.get('token')
    const router = useRouter();
    const [albumRouter, setAlbumRouter] = useRecoilState<any>(albumRouterState)

    const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);
    const [viewArtist, setViewArtist] = useRecoilState(formusicFetchState)
    const [albumIDData, setAlbumIDData] = useRecoilState(albumIdState)
    const [albumId, setAlbumId] = useRecoilState(albumidState);
    const [musicID, setMusicId] = useRecoilState(mudicIDState)
    const [musicArrayTwo, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState);


    const [globalMusic, setGlobalMusic] = useRecoilState(globalMusicState)


    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((r) => {
                setMusics(r.data)
            })
    }, [clickFetch])

    const forAlbumId = (id: Number) => {
        setAlbumRouter(id)
        console.log(albumRouter, 'esari')
    }

    return (
        <div className={styles.container}>
            <div className={styles.hits}>
                {
                    musics.slice(0, 5).map((item: any) => (
                        <div className={styles.box} key={item.id} onClick={() => {
                            setAlbumIDData(item.albumId)
                            setAlbumId(item.authorId)
                            setMusicId(item.id)
                            setGlobalMusic(item.id)
                            forAlbumId(item.albumId)
                            setMusicArrayTwo(musics)
                        }}
                        >
                            <Card image={item?.album.albumImage} subtitle={item.artistName} title={item.name}
                                  imageStyle={'normal'}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default HitsSection;