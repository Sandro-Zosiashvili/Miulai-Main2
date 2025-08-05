"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
    axios.get(`https://backend.miulai.ge/user/me`, {
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
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/music`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (r) => {
        // setSearchItems(r.data.authors);
        setTopHIt(r.data[0])
        // setMusicId(r.data[0].id)
      });
  }, []);


  return (
    <main className={styles.main}>
      <Header />
       <News title={'Top Hit Of The Week'} image={topHit?.author?.artistCover} plays={topHit?.playCount} />
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
