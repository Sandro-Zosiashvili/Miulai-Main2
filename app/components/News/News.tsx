import styles from "./News.module.scss";
import Button from "../Button/Button";
import {useRecoilState} from "recoil";
import {mudicIDState} from "@/app/state";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import ColorThief from "colorthief";

interface Props {
    title: string;
    image: string;
    plays?: string;
    album?: boolean;
}

const News = (props: Props) => {
    const [musicID, setMusicId] = useRecoilState<any>(mudicIDState);
    const [forMusic, setForMusic] = useState();
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [bgStyle, setBgStyle] = useState({});

    // ამოიღე ფერი როცა props.image იცვლება
    useEffect(() => {
        const image = imgRef.current;
        if (!image) return;

        const handleLoad = () => {
            try {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(image, 2); // ამოღე 2 ფერი

                const color1 = palette[0].map(c => Math.min(c + 30, 255)); // ფერი #1 გაბრწყინებული
                const color2 = palette[1].map(c => Math.min(c + 30, 255)); // ფერი #2 გაბრწყინებული

                const rgb1 = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`;
                const rgb2 = `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`;

                // რბილი შერწყმა ორი ფერით
                const gradient = `linear-gradient(to bottom, ${rgb1} 0%, ${rgb2} 100%)`;

                setBgStyle({
                    background: gradient,
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    opacity: 0.96
                });

                console.log("ფერები ამოღებულია:", rgb1, rgb2);
            } catch (err) {
                console.error("ფერის ამოღების შეცდომა:", err);
            }
        };

        if (image.complete) {
            handleLoad();
        } else {
            image.addEventListener("load", handleLoad);
        }

        return () => {
            image.removeEventListener("load", handleLoad);
        };
    }, [props.image]);


    useEffect(() => {
        axios.get("http://localhost:3004/music").then((r) => {
            setForMusic(r.data[0]?.id);
        });
    }, []);

    const backImage = {
        backgroundImage: `url(${props.image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    if (props.album) {
        return (
            <div className={styles.albumNews} style={bgStyle}>
                <img
                    ref={imgRef}
                    src={props.image}
                    crossOrigin="anonymous"
                    style={{display: "none"}}
                    alt="color source"
                />

                <div className={styles.albumNewsContent}>
                    <div className={styles.albumImage}>
                        <img
                            className={styles.imageBorder}
                            src={props.image}
                            width={200}
                            height={200}
                            alt={props.title}
                        />
                    </div>
                    <div className={styles.flexColumn}>
                        <div>Album</div>
                        <div className={styles.fontForTitle}>{props.title}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} style={backImage}>
            <div className={styles.container_news}>
                <div className={styles.container_title}>
                    <div className={styles.font_style_news}>{props.title}</div>
                    <div className={styles.font_style_plays}><div>Plays</div> <div>{props.plays}</div></div>
                </div>

                <div className={styles.mainButton}>
                    <Button
                        title={"Listen Now"}
                        mode={"reusable button"}
                        padding="12px 24px 12px 20px"
                        borderRadius="8px"
                        gap="4px"
                        width="153px"
                        fontSize="16px"
                        fontWeight="500"
                        imageSrc="clip.svg"
                        imageWidth={20}
                        imageHeight={20}
                        onClick={() => setMusicId(forMusic)}
                    />
                </div>

                <div className={styles.mobileButton}>
                    <Button
                        title={"Listen Now"}
                        mode={"reusable button"}
                        padding="8px 12px 8px 8px"
                        borderRadius="4px"
                        gap="4px"
                        width="114px"
                        fontSize="14px"
                        fontWeight="500"
                        imageSrc="clip.svg"
                        imageWidth={16}
                        imageHeight={16}
                        onClick={() => setMusicId(forMusic)}
                    />
                </div>
            </div>
        </div>
    );
};

export default News;
