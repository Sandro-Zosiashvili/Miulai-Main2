import React, {useEffect, useState, useRef} from "react";
import Image from "next/image";
import axios from "axios";
import {useRecoilState} from "recoil";
import {
    albumIdState,
    albumidState,
    clickFetchState,
    mudicIDState,
    oneArrayMusicState,
} from "@/app/state";
import {useRouter} from "next/navigation";
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
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?search=${inputValue}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then((r) => {
                    const data = r.data;
                    setSearchItems(data.authors || []);
                    setSearchAlbum(data.albums || []);
                    setMusicData(data.music || []);

                    // Show dropdown only if there are results
                    if (isFocused) {
                        setShowDropdown(true);
                    }
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
        router.push(`/artistlist/${author}`);
        setAlbumId(author); // Assuming you use the same state for albums and authors
        setClickFetch(!clickFetch);
        setInputValue(""); // Reset input field after selection
    };

    const handleAlbumClick = (album: any) => {
        router.push(`/album/${album.id}`);
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
                                    onClick={() => handleAuthorClick(author.id)}
                                >
                                    {author.artistPhoto ? (
                                        <Image
                                            className={styles.img}
                                            src={author.artistPhoto}
                                            width={72}
                                            height={72}
                                            alt={author.artistName || "Author Image"}
                                        />
                                    ) : null}
                                    <div className={styles.white}>{author.artistName}</div>
                                    <div className={styles.musicSelection}>Artist</div>
                                </div>
                            ))}

                            {albumSearch.map((album: any, index) => (
                                <div
                                    key={`album-${index}`}
                                    className={styles.searchItem}
                                    onClick={() => handleAlbumClick(album)}
                                >
                                    {album.albumImage ? (
                                        <Image
                                            className={styles.albuImage}
                                            src={album.albumImage}
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
                                        src={item.album.albumImage}
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
                        <UserPopup/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
