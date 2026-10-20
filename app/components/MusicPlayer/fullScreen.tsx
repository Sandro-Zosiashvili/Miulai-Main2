import React from 'react';
import Image from 'next/image'
import Button from '../Button/Button';
import style from './fullscreen.module.scss';
import HeartShapeBtn from '../heatShapeIcon/HeartShapeIcn';
import {useRecoilState} from 'recoil';
import {musicState, playerDisplayState} from '@/app/state';

const Fullscreen = () => {
    const [music, setMusic] = useRecoilState<any>(musicState)
    const [playerDisplay, setPlayerDisplay] = useRecoilState<any>(playerDisplayState)

    // Shimmer skeleton while the track metadata is still loading.
    const loading = !playerDisplay || !playerDisplay.name;

    if (loading) {
        return (
            <div className={style.container}>
                <div className={`${style.skelImg} ${style.shimmer}`}/>
                <div className={style.like}>
                    <div className={style.text}>
                        <div className={style.flexing}>
                            <div className={`${style.skelTitle} ${style.shimmer}`}/>
                            <div className={`${style.skelArtist} ${style.shimmer}`}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={style.container}>
            <Image src={playerDisplay?.album?.albumImage || '/defaultAlbumArt.jpg'} alt="Album Art" width={80} height={80}
                 className={`${style.img} ${style.fadeIn}`}/>
            <div className={style.like}>
                <div className={style.text}>
                    <div className={style.flexing}>
                        <span className={style.title}>{playerDisplay?.name || 'Unknown Title'}</span>
                        <span className={style.artist}>{playerDisplay?.artistName || 'Unknown Artist'}</span>
                        <div className={style.likebtn}>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Fullscreen;
