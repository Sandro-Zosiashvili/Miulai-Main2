'use client';
import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import style from './modalPlayer.module.scss';
import Controls from './Contorls';
import TrackDisplay from './TrackDisplay';
import Icon from '../Icon/Icon';
import Fullscreen from './fullScreen';
import FullControls from './fullControls';

interface ModalPlayerProps {
  currentTrack: {
    title: string;
    artist: string;
    albumArt: string;
  };
  isPlaying: boolean;
  onPlayPause: (e: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: (e: any) => void;
  currentTime: number;
  duration: number;
  volume: number;
}

const ModalPlayer: React.FC<ModalPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onClose,
  currentTime,
  duration,
  volume,
}) => {
  // Render into document.body so the full-screen modal escapes any parent
  // stacking context and reliably covers the header / hero sections.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className={style.modalContainer}>
      <button className={style.closeButton} onClick={onClose}>
        <Icon name="close" alt="Close" width={24} height={24} />
      </button>

      <Fullscreen/>

      <FullControls
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onNext={onNext}
              onPrevious={onPrevious}
              currentTime={currentTime}
              duration={duration}
              onTimeChange={() => { } }
              volume={volume}
              onVolumeChange={() => { } }
              isLooping={false}
              onToggleLoop={() => { } }
              isShuffling={false}
              onToggleShuffle={() => { } }
              backgroundImage={''} name={undefined} isActive={undefined}      />
    </div>,
    document.body
  );
};

export default ModalPlayer;
