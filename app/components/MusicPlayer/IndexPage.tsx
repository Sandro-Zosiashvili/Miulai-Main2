'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";
import Controls from "./Contorls";
import style from "./IndexPage.module.scss";
import TrackDisplay from "./TrackDisplay";
import SliderMobile from "./Slider/Slider";
import axios from "axios";
import { useRecoilState } from "recoil";
import Cookies from 'js-cookie';
import { albumIdState, mudicIDState, oneArrayMusicState, playerDisplayState } from "@/app/state";
import ModalPlayer from "./modalPlayer";

const IndexPage: React.FC = () => {
  const token = Cookies.get('token');
  const [albumIDData, setAlbumIDData] = useRecoilState(albumIdState);
  const [isPlaying, setIsPlaying] = useState(true); // Set default as true
  const [volume, setVolume] = useState(50);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [musicArrayTwo, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState);
  const [musicID, setMusicId] = useRecoilState(mudicIDState);
  const [fetchMusic, setFetchMusic] = useState<any>(null);
  const [playerDisplay, setPlayerDisplay] = useRecoilState<any>(playerDisplayState);

  // Fetch music data
  useEffect(() => {
    if (musicID) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/${musicID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          setFetchMusic(r.data.music);
          setPlayerDisplay(r.data);
        })
        .catch((error) => {
          console.error("Error fetching music details:", error);
        });
    } else {
      console.warn("MusicID or accessToken is missing");
    }
  }, [musicID, token]);

  // Auto-play when page loads if there is audio
  useEffect(() => {
    if (audioRef.current && fetchMusic) {
      setIsPlaying(true);  // Auto play when page loads
    }
  }, [fetchMusic]);

  // Handle volume and loop changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
      audio.loop = isLooping;
    }
  }, [volume, isLooping]);

  // Shuffle logic
  const shuffleArray = (array: any[]) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const playNextTrack = useCallback(() => {
    const musicList = isShuffling ? shuffleArray(musicArrayTwo) : musicArrayTwo;
    const currentIndex = musicList.findIndex((track: any) => track.id === musicID);
    const nextIndex = (currentIndex + 1) % musicList.length;
    setMusicId(musicList[nextIndex]?.id);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [isShuffling, musicArrayTwo, musicID, setMusicId, setCurrentTime, setIsPlaying]);

  const playPreviousTrack = useCallback(() => {
    const musicList = isShuffling ? shuffleArray(musicArrayTwo) : musicArrayTwo;
    const currentIndex = musicList.findIndex((track: any) => track.id === musicID);
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    setMusicId(musicList[prevIndex]?.id);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [isShuffling, musicArrayTwo, musicID, setMusicId, setCurrentTime, setIsPlaying]);

  // Audio event listeners for updating current time, track ending, and metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleTrackEnded = () => {
      playNextTrack();
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleTrackEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleTrackEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [playNextTrack]);

  // Play or pause the audio
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error: unknown) => console.error("Playback failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, fetchMusic]);

  // Toggle play/pause
  const playPause = useCallback(() => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, []);

  // Handle volume changes
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  // Toggle loop playback
  const toggleLoop = useCallback(() => {
    setIsLooping((prevIsLooping) => !prevIsLooping);
  }, []);

  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffling((prevIsShuffling) => !prevIsShuffling);
  }, []);

  // Handle time changes for the track
  const handleTimeChange = useCallback((newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  // Format time display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle album art click to open the modal
  const handleAlbumArtClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={style.main} onClick={() => setIsModalOpen(!isModalOpen)} >
      <SliderMobile
        isPlaying={isPlaying}
        onPlayPause={playPause}
        onNext={playNextTrack}
        onPrevious={playPreviousTrack}
        onVolumeChange={handleVolumeChange}
        volume={volume}
        isLooping={isLooping}
        onToggleLoop={toggleLoop}
        isShuffling={isShuffling}
        onToggleShuffle={toggleShuffle}
        currentTime={currentTime}
        duration={duration}
        onTimeChange={handleTimeChange}
        backgroundImage={""}
        name={playerDisplay?.title}
        isActive={isPlaying}
      />
      <div className={style.container}>
        <TrackDisplay currentTrack={playerDisplay} onAlbumArtClick={handleAlbumArtClick} />

        <Controls
          isPlaying={isPlaying}
          onPlayPause={playPause}
          onNext={playNextTrack}
          onPrevious={playPreviousTrack}
          onVolumeChange={handleVolumeChange}
          volume={volume}
          isLooping={isLooping}
          onToggleLoop={toggleLoop}
          isShuffling={isShuffling}
          onToggleShuffle={toggleShuffle}
          currentTime={currentTime}
          duration={duration}
          onTimeChange={handleTimeChange}
          backgroundImage={playerDisplay?.albumArt}
          name={playerDisplay?.title}
          isActive={isPlaying}
        />

        <audio
          ref={audioRef}
          src={fetchMusic}
          onError={() => console.error("Audio failed to load")}
        />
      </div>

      {/* Modal player for larger view */}
      {isModalOpen && (
        <ModalPlayer
          currentTrack={playerDisplay}
          isPlaying={isPlaying}
          onClose={handleCloseModal}
          onPlayPause={playPause}
          onNext={playNextTrack}
          onPrevious={playPreviousTrack}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
        />
      )}
    </div>
  );
};

export default IndexPage;
