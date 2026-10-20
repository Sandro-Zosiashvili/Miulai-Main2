"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { cachedGet } from "../lib/apiCache";
import CardsHeader from '../components/CardsHeader/CardsHeader';
import Header from '../components/Header/Header';
import News from '../components/News/News';
import UserPopup from '../components/UserPopup/UserPopup';
import AlbumSection from '../Homepage/AlbumSection/AlbumSection';
import ArtistSection from '../Homepage/ArtistSection/ArtistSection';
import ChartsSection from '../Homepage/ChartsSection/ChartsSection';
import HitsSection from '../Homepage/HitsSection/HitsSection';
import styles from './page.module.scss';
import { useRecoilState } from "recoil";
import { mudicIDState, topHitState, userIDState } from "../state";
import Cookies from "js-cookie";
// import middleware from "@/middleware";


// songs.slice(0, 6).map(() => {})

export default function Home() {

  const [inputValue, setInputValue] = useState();
  const [topHitMusic, setTopHitMusic] = useRecoilState(topHitState)
  const [musicID, setMusicId] = useRecoilState(mudicIDState)
  const [userID, setUserId] = useRecoilState(userIDState)
  const token = Cookies.get("token");

    useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).
      then((r) => {
        setUserId(r.data.id)
      })

  },[])


  const inputChange = (e: any) => {
    // const newValue = e.target.value;
    setInputValue(e.target.value);
  };

  const [topHit, setTopHIt] = useState<any>()
  useEffect(() => {
    cachedGet(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/music`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (r) => {
        // Top Hit Of The Week = the track with the highest play count.
        const list = Array.isArray(r.data) ? r.data : [];
        const top = list.reduce(
          (max: any, m: any) =>
            (m?.playCount ?? 0) > (max?.playCount ?? 0) ? m : max,
          list[0]
        );
        setTopHIt(top)
      });
  }, []);


  return (
    <main className={styles.main}>
      <Header />
       <News title={'Top Hit Of The Week'} image={topHit?.author?.artistCover} plays={topHit ? String(topHit.playCount ?? 0) : "Loading..."} loading={!topHit} />
      <CardsHeader  title={'Top Hits'} subtitle={'See all'} addRoute='hits' />
      <HitsSection />
      <CardsHeader  title={'Top Charts'} subtitle={'See all'} addRoute='charts' />
      <ChartsSection />
      <CardsHeader title={'Popular Artists'} subtitle={'See All'} addRoute='artistlist' />
      <ArtistSection />
      <CardsHeader title='Popular Albums' />
      <AlbumSection /> 
    </main>
  );
}
