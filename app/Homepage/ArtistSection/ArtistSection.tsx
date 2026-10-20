import Card from "@/app/components/Card/Card";
import styles from "./ArtistSection.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRecoilState} from "recoil";
import {albumidState, clickFetchState} from "@/app/state";
import Cookies from 'js-cookie';
import {useRouter} from "next/navigation";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SkeletonCard from "@/app/components/Skeleton/SkeletonCard";
import skeleton from "@/app/components/Skeleton/Skeleton.module.scss";


const ArtistSection = () => {
    const [atrist, setArtist] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/author`, {
            headers: {Authorization: `Bearer ${token}`}
        }).then((r) => {
            setArtist(r.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [clickFetch]);

    return (
        <div className={styles.container}>
            <div className={styles.art}>
                {loading
                    ? [...Array(5)].map((_, i) => (
                        <div className={styles.box} key={`sk-${i}`}>
                            <SkeletonCard round/>
                        </div>
                    ))
                    : atrist.slice(0, 5).map((item: any) => (
                    <div className={`${styles.box} ${skeleton.fadeIn}`} key={item.id} onClick={() => router.push(`/artistlist/${item.id}`)}>
                        <ArtistCard
                            header={""}
                            key={item.id}
                            image={item.artistPhoto}
                            title={item.artistName}
                            imageStyle={"round"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistSection;
