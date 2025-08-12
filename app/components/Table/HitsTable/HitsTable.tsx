"use client";
import {Table} from "antd";
import HeartShapeBtn from "../../heatShapeIcon/HeartShapeIcn";
import type {DividerClassKey} from "@mui/material";
import styles from "./HitsTable.module.scss";
import {render} from "sass";
import {text} from "stream/consumers";
import Image from "next/image";
import {useWindowSize} from "react-use";
import {useRecoilState} from "recoil";
import {globalAlbumDataState, mudicIDState, musicState, oneArrayMusicState} from "@/app/state";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";

const HitsTable = () => {
    const [musicID, setMusicId] = useRecoilState(mudicIDState)
    const [musicArrayTwo, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState);
    const [musicCover, setMusicCover] = useState<any>()
    const token = Cookies.get("token");

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/top-songs?limit=${5}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((r) => {
                setMusicCover(r.data)

            });
    }, []);
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    const {width, height} = useWindowSize();
    const isMobile = width > 767;

    //

    const columns = [
        {
            title: isMobile ? "#" : "",
            dataIndex: "id",
            key: "id",
            width: "1%",
            render: (text: any, item: any, index: any) => (
                <div className={styles.cellId}>{index + 1}</div>
            ),
        },

        {
            title: isMobile ? "Song Name" : "",
            dataIndex: "musicCover",
            key: "title",
            width: "30%",
            render: (text: any, item: any, record: any) => (
                <div className={styles.cellSongname}>
                    <Image className={styles.img} src={item.album.albumImage} width={48} height={48} alt={`${text}`}/>
                    <div className={styles.fontGap}>
                        <div className={styles.songTitle}>{item.name}</div>
                        <div className={styles.songArtist}>{item.artistName}</div>
                    </div>
                </div>
            ),
        },
        width > 725
            ? {
                title: "Album",
                dataIndex: "album",
                key: "album",
                width: "25%",
                render: (text: any, item: any) => (
                    <div className={styles.cellAlbumName}>{item.album.albumName}</div>
                ),
            }
            : {
                width: "0.5%",
                render: () => <div></div>,
            },
        isMobile
            ? {
                title: "Time",
                dataIndex: "time",
                key: "time",
                width: "15%",
                render: (text: any, item: any) => (
                    <div className={styles.cellTimeName}>{formatDuration(item.duration)}</div>
                    // there is duration
                ),
            }
            : {
                width: "0.5%",
                render: () => <div></div>,
            },
        // {
        //   title: "",
        //   key: "like",
        //   width: "10%",
        //   render: () => (
        //     <HeartShapeBtn
        //       isActive={true}
        //       isDisabled={false}
        //       onClick={() => console.log("button clicked")}
        //     />
        //   ),
        // },
    ];

    return (
        <div className={styles.wrapper}>
            <Table
                className={styles.container}
                dataSource={musicCover}
                onRow={(record: any) => ({
                    onClick: () => {
                        setMusicId(record.id);
                        setMusicArrayTwo(musicCover)
                    },
                })}
                columns={columns}
                pagination={false}
                rowClassName={styles.row111111}
            />
        </div>
    );
};

export default HitsTable;
