import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  albumIdState,
  albumidState,
  clickFetchState,
  mudicIDState,
  oneArrayMusicState,
} from "@/app/state";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Input from "../Input/Input";
import UserPopup from "../UserPopup/UserPopup";
import Cookies from "js-cookie";

interface InputTpo {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<InputTpo> = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchItems, setSearchItems] = useState([]); // For authors
  const [albumSearch, setSearchAlbum] = useState([]); // For albums
  const [musicData, setMusicData] = useState([]); // For music
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const [albumId, setAlbumId] = useRecoilState(albumidState);
  const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);
  const [albumIDData, setAlbumIDData] = useRecoilState(albumIdState);
  const [musicID, setMusicId] = useRecoilState(mudicIDState);
  const [showPopup, setShowPopup] = useState(false);
  const token = Cookies.get('token')


  const [musicArrayTwo, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState);

  const oneArray = () => {

  }


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const router = useRouter();

  useEffect(() => {
    if (inputValue) {
      axios
        .get(
          `https://backend.miulai.ge/search?search=${inputValue}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((r) => {
          const data = r.data;
          // Set states for authors, albums, and music
          setSearchItems(data.authors || []);
          setSearchAlbum(data.album || []);
          setMusicData(data.music || []);

          // Show dropdown only if there are results
          setShowDropdown(
            (data.authors && data.authors.length > 0) ||
              (data.album && data.album.length > 0) ||
              (data.music && data.music.length > 0)
          );
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      // Clear dropdown if input is empty
      setSearchItems([]);
      setSearchAlbum([]);
      setMusicData([]);
      setShowDropdown(false);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay the blur action to allow clicking on dropdown items
    setTimeout(() => {
      if (!searchWrapperRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowDropdown(false);
      }
    }, 200);
  };


  const handleAuthorClick = (author: any) => {
    router.push(`/artistlist/${albumId}`);
    setAlbumId(author.id); // Assuming you use the same state for albums and authors
    setClickFetch(!clickFetch);
    setInputValue(""); // Reset input field after selection
  };

  const handleAlbumClick = async (album: any) => {
    setMusicArrayTwo([]);
    try {
      const response = await axios.get(`https://backend.miulai.ge/album/${album.id}`);
      setMusicArrayTwo(response.data.musics);


      // Set states
      setAlbumId(album.id);
      setAlbumIDData(album.id);
      setClickFetch(!clickFetch);
      setInputValue(""); // Reset input field after selection

      // Now navigate after data is set
      router.push(`/album/${album.id}`);
    } catch (error) {
      console.error("Error fetching album music:", error);
      // Handle error if needed, e.g., show a notification to the user
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.searchWrapper} ref={searchWrapperRef}>
          <Input
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={inputValue}
            className={styles.input}
          />
          {showDropdown && (
            <div className={styles.searchDropdown}>
              {searchItems.map((author: any, index) => (
                <div
                  // key={`author-${index}`}
                  key={index}
                  className={styles.searchItem}
                  onClick={() => handleAuthorClick(author)}
                >
                  {author.files && author.files[0]?.url ? (
                    <Image
                      className={styles.img}
                      src={author.files[0].url}
                      width={72}
                      height={72}
                      alt={author.firstName || "Author Image"}
                    />
                  ) : null}
                  <div className={styles.white}>{author.firstName}</div>
                  <div className={styles.musicSelection}>Artist</div>
                </div>
              ))}

              {albumSearch.map((album: any, index) => (
                <div
                  key={`album-${index}`}
                  className={styles.searchItem}
                  onClick={() => handleAlbumClick(album)}
                >
                  {album.file && album.file.url ? (
                    <Image
                      className={styles.albuImage}
                      src={album.file.url}
                      width={72}
                      height={72}
                      alt={album.albumName || "Album Image"}
                    />
                  ) : null}
                  <div className={styles.white}>
                    <div>{album.albumName}</div>
                    <div className={styles.grayFont}>{album.artistName}</div>
                  </div>
                  <div className={styles.musicSelection}>Album</div>
                </div>
              ))}
              {musicData.map((item: any, index) => (
                <div
                  key={`music-${index}`}
                  onClick={() => setMusicId(item.id)}
                  className={styles.searchItem}
                >
                  <Image
                    src={item.albumCover}
                    width={72}
                    height={72}
                    alt="musiccover"
                  />
                  <div className={styles.white}>
                    <div>{item.name}</div>
                    <div className={styles.grayFont}>{item.artistName}</div>
                  </div>
                  <div className={styles.musicSelection}>Music</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.userIconWrapper} onClick={togglePopup}>
          <Image
            src={"/icon/userHeaderIcon.svg"}
            alt="User Icon"
            width={32}
            height={32}
            className={styles.image}
          />
        </div>
        {showPopup && (
          <div className={styles.popupWrapper}>
            <UserPopup />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
