import Card from "@/app/components/Card/Card";
import styles from "./AlbumSection.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRecoilState} from "recoil";
import {albumIdState, clickFetchState} from "@/app/state";
import {useRouter} from "next/navigation";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SkeletonCard from "@/app/components/Skeleton/SkeletonCard";
import skeleton from "@/app/components/Skeleton/Skeleton.module.scss";
import {cachedGet} from "@/app/lib/apiCache";
import Cookies from "js-cookie";


const AlbumSection = () => {
    const [cardData, setCardData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);
    // const [albumIDData, setAlbumIDData] = useRecoilState(albumIdState)
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        cachedGet(`${process.env.NEXT_PUBLIC_BACKEND_URL}/album`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((r) => {
            setCardData(r.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [clickFetch]);

    return (
        <div className={styles.container}>

            <div className={styles.album}>
                {loading
                    ? [...Array(5)].map((_, i) => (
                        <div className={styles.box} key={`sk-${i}`}>
                            <SkeletonCard/>
                        </div>
                    ))
                    : cardData.map((item: any) => (
                    <div className={`${styles.box} ${skeleton.fadeIn}`} key={item.id} onClick={() => {
                        router.push(`/album/${item.id}`);

                    }}>
                        <ArtistCard
                            header={""}
                            key={item.id}
                            image={item.albumImage}
                            title={item.albumName}
                            subtitle={item.artistName}
                            imageStyle={"normal"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumSection;

