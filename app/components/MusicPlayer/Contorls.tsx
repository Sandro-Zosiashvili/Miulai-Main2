'use client';
import React, { useState } from 'react';
import style from './Contorls.module.scss';
import formatTime from './helperProp/formatTime';
import propsinterFace from './helperProp/prop';
import HeartShapeBtn from '../heatShapeIcon/HeartShapeIcn';
import {Shuffle, SkipBack, SkipForward, Play, Pause, Repeat, Repeat1, Volume2, VolumeX} from 'lucide-react';




const Controls = (props: propsinterFace) => {
    const [isMuted, setIsMuted] = useState(false);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value, 10);
        props.onVolumeChange(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            props.onVolumeChange(0);
        } else {
            props.onVolumeChange(50); // Default volume when unmuted
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        props.onTimeChange(newTime);
    };
    const favoriteClick = (e) => {
        e.stopPropagation(); // აჩერებს ივენთის bubbling-ს
        console.log('add to favorites')

    }

    const currentTimeInPrcnt = (props.currentTime / props.duration) * 100;

    return (
        <>
            <div className={style.container}>
                <div className={style.time}>
                    <span className={style.timing}>{formatTime(props.currentTime)}</span>
                    <div className={style.progressMain}>
                        <input
                            type="range"
                            min="0"
                            max={props.duration}
                            value={props.currentTime}
                            onChange={handleTimeChange}
                            className={style.load}
                        />
                        <div style={{ width: `${currentTimeInPrcnt}%` }} className={style.progressDiv}></div>
                    </div>
                    <span className={style.timing}>{formatTime(props.duration)}</span>
                </div>

                <div className={style.buttons}>
                    <button
                        onClick={props.onToggleShuffle}
                        className={`${style.btn} ${props.isShuffling ? style.active : ''}`.trim()}
                        aria-label="Shuffle"
                        aria-pressed={props.isShuffling}
                    >
                        <Shuffle size={22}/>
                    </button>
                    <button onClick={props.onPrevious} className={style.btn} aria-label="Previous">
                        <SkipBack size={22} fill="currentColor"/>
                    </button>

                    <div className={style.likeplaybtn}>
                        <div className={style.likeSet} onClick={favoriteClick}>
                            <HeartShapeBtn isActive={true} isDisabled={false} onClick={() => console.log('Button clicked!')} />
                        </div>
                        <button
                            onClick={props.onPlayPause}
                            className={`${style.btn} ${style.circle}`}
                            aria-label={props.isPlaying ? 'Pause' : 'Play'}
                        >
                            {props.isPlaying ? <Pause size={26} fill="currentColor"/> : <Play size={26} fill="currentColor"/>}
                        </button>
                    </div>

                    <button onClick={props.onNext} className={style.btn} aria-label="Next">
                        <SkipForward size={22} fill="currentColor"/>
                    </button>
                    <button
                        onClick={props.onToggleLoop}
                        className={`${style.btn} ${props.isLooping ? style.active : ''}`.trim()}
                        aria-label="Repeat"
                        aria-pressed={props.isLooping}
                    >
                        {props.isLooping ? <Repeat1 size={22}/> : <Repeat size={22}/>}
                    </button>
                </div>
            </div>

            <div className={style.volume}>
                <button onClick={handleMuteToggle} className={style.btn} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : props.volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume"
                    className={style.volSetting}
                />
            </div>
        </>
    );
};

export default Controls;
