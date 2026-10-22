'use client';
import styles from "./News.module.scss";
import Button from "../Button/Button";
import {motion} from "framer-motion";
import toast from "react-hot-toast";
import {useRecoilState} from "recoil";
import {mudicIDState} from "@/app/state";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import ColorThief from "colorthief";
import Cookies from "js-cookie";
import Head from "next/head";
import skeleton from "../Skeleton/Skeleton.module.scss";
import {cachedGet} from "@/app/lib/apiCache";


interface Props {
    title: string;
    image: string;
    plays?: string;
    album?: boolean;
    artistPage?: boolean | false;
    loading?: boolean;
}

const News = (props: Props) => {
    const [musicID, setMusicId] = useRecoilState<any>(mudicIDState);
    const [forMusic, setForMusic] = useState();
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [bgStyle, setBgStyle] = useState({});
    // Accent colors sampled from the featured art -> dynamic mesh glow + CTA.
    const [accent, setAccent] = useState<{ c1: string; c2: string }>({
        c1: "#7a1fd0",
        c2: "#f903d0",
    });
    const [saved, setSaved] = useState(false);
    const token = Cookies.get("token");


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
                const gradient = `linear-gradient(to bottom, ${rgb1} 0%, ${rgb2} 100%)`;

                setAccent({c1: rgb1, c2: rgb2});

                setBgStyle({
                    background: gradient,
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    opacity: 0.96
                });

            } catch (err) {
                console.error(err.message);
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
        cachedGet(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music`, {
            headers: {Authorization: `Bearer ${token}`},
        }).then((r) => {
            // Listen Now plays the Top Hit = the track with the highest play count.
            const list = Array.isArray(r.data) ? r.data : [];
            const top = list.reduce(
                (max: any, m: any) =>
                    (m?.playCount ?? 0) > (max?.playCount ?? 0) ? m : max,
                list[0]
            );
            setForMusic(top?.id);
        });
    }, []);

    const backImage = {
        backgroundImage: `url(${props.image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    if (props.loading && !props.album) {
        return (
            <div className={`${styles.container} ${styles.skeletonHero}`}>
                <div className={styles.container_news}>
                    <div className={styles.container_title}>
                        <div className={`${styles.skelTitle} ${skeleton.shimmer}`}/>
                        <div className={`${styles.skelTitleSmall} ${skeleton.shimmer}`}/>
                        <div className={`${styles.skelPlays} ${skeleton.shimmer}`}/>
                    </div>
                    <div className={`${styles.skelButton} ${skeleton.shimmer}`}/>
                </div>
            </div>
        );
    }

    if (props.loading && props.album) {
        return (
            <div className={`${styles.albumNews} ${styles.albumSkeleton}`}>
                <div className={styles.albumNewsContent}>
                    <div className={`${skeleton.albumCover} ${skeleton.shimmer}`}/>
                    <div className={styles.flexColumn}>
                        <div className={`${skeleton.albumLabel} ${skeleton.shimmer}`}/>
                        <div className={`${skeleton.albumTitle} ${skeleton.shimmer}`}/>
                    </div>
                </div>
            </div>
        );
    }

    if (props.album) {
        return (
            <div className={styles.albumNews} style={bgStyle}>
                <Head>
                    <link rel="preload" as="image" href={props.image} crossOrigin="anonymous"/>
                </Head>
                <img
                    ref={imgRef}
                    src={props.image}
                    crossOrigin="anonymous"
                    style={{display: "none"}}
                    alt="color source"
                />

                <div className={styles.albumNewsContent}>
                    <div className={styles.albumImage}>
                        <Head>
                            <link rel="preload" as="image" href={props.image} crossOrigin="anonymous"/>
                        </Head>
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
        <div
            className={styles.container}
            style={{...backImage, ["--accent1" as any]: accent.c1, ["--accent2" as any]: accent.c2}}
        >
            <Head>
                <link rel="preload" as="image" href={props.image} crossOrigin="anonymous"/>
            </Head>

            {/* Hidden source image so ColorThief can sample the accent colors. */}
            {!props.artistPage && (
                <img
                    ref={imgRef}
                    src={props.image}
                    crossOrigin="anonymous"
                    style={{display: "none"}}
                    alt=""
                    aria-hidden="true"
                />
            )}

            {/* Animated colored mesh glow that adapts to the featured art. */}
            <div className={styles.mesh} aria-hidden="true"/>

            <div className={!props.artistPage ? styles.container_news : styles.artistNews}>
                {!props.artistPage && (
                    <div className={styles.badges}>
                        <span className={`${styles.badge} ${styles.badgeHot}`}>
                            <span className={styles.eq} aria-hidden="true">
                                <i/><i/><i/>
                            </span>
                            Trending #1
                        </span>
                        {props.plays && (
                            <span className={styles.badge}>{props.plays} Plays</span>
                        )}
                        <span className={styles.badge}>Hit Of The Week</span>
                    </div>
                )}

                <div className={styles.container_title}>
                    <div className={styles.font_style_news}>{props.title}</div>
                </div>

                {!props.artistPage && (
                    <div className={styles.actions}>
                        <motion.button
                            type="button"
                            className={styles.ctaPrimary}
                            onClick={() => {
                                setMusicId(forMusic);
                                toast.success("Playing Top Hit Of The Week");
                            }}
                            whileHover={{scale: 1.03, y: -2}}
                            whileTap={{scale: 0.97}}
                            transition={{type: "spring", stiffness: 400, damping: 20}}
                        >
                            <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
                                <path d="M8 5v14l11-7z" fill="currentColor"/>
                            </svg>
                            Listen Now
                        </motion.button>

                        <motion.button
                            type="button"
                            className={`${styles.ctaSecondary} ${saved ? styles.saved : ""}`}
                            onClick={() => {
                                const next = !saved;
                                setSaved(next);
                                if (next) toast.success("Added to Your Library");
                                else toast("Removed from Your Library");
                            }}
                            aria-pressed={saved}
                            aria-label={saved ? "Saved to library" : "Save to library"}
                            whileHover={{scale: 1.08, y: -2}}
                            whileTap={{scale: 0.9}}
                            transition={{type: "spring", stiffness: 400, damping: 18}}
                        >
                            {/* Lucide "Heart" — clean, symmetric vector. */}
                            <svg
                                viewBox="0 0 24 24"
                                width={22}
                                height={22}
                                fill={saved ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                            </svg>
                            <span className={styles.tooltip}>{saved ? "Saved" : "Save to Library"}</span>
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
