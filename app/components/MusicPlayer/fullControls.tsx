'use client';
import React from 'react';
import style from './fullControl.module.scss'
import formatTime from './helperProp/formatTime';
import propsinterFace from './helperProp/prop';
import {Shuffle, SkipBack, SkipForward, Play, Pause, Repeat, Repeat1, Volume2, VolumeX} from 'lucide-react';

const FullControls = (props: propsinterFace) => {
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value, 10);
        props.onVolumeChange(newVolume);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        props.onTimeChange(newTime);
    };

    const currentTimeInPrcnt = (props.currentTime / props.duration) * 100

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
                        <div style={{width: `${currentTimeInPrcnt}%`}} className={style.progressDiv}/>
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
                        <SkipBack size={24} fill="currentColor"/>
                    </button>
                    <div className={style.likeplaybtn}>
                        <button
                            onClick={props.onPlayPause}
                            className={`${style.btn} ${style.circle}`}
                            aria-label={props.isPlaying ? 'Pause' : 'Play'}
                        >
                            {props.isPlaying
                                ? <Pause size={28} fill="currentColor"/>
                                : <Play size={28} fill="currentColor"/>}
                        </button>
                    </div>
                    <button onClick={props.onNext} className={style.btn} aria-label="Next">
                        <SkipForward size={24} fill="currentColor"/>
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

                <div className={style.volume}>
                    <button
                        className={style.volBtn}
                        onClick={() => props.onVolumeChange(props.volume > 0 ? 0 : 50)}
                        aria-label={props.volume > 0 ? 'Mute' : 'Unmute'}
                    >
                        {props.volume > 0 ? <Volume2 size={20}/> : <VolumeX size={20}/>}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={props.volume}
                        onChange={handleVolumeChange}
                        aria-label="Volume"
                        className={style.volSetting}
                    />
                </div>
            </div>
        </>
    );
};

export default FullControls;
