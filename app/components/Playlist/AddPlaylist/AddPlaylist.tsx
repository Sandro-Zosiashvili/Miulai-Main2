import { useEffect, useState } from "react";
import PlaylistBox from "../../PlaylistBox/PlaylistBox";
import NewPlaylist from "../NewPlaylist/NewPlaylist";
import PlaylistInput from "../PlaylistInput/PlaylistInput";
import styles from "./AddPlaylist.module.scss";
import Image from "next/image";
import Button from "../../Button/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import Icon from "../../Icon/Icon";
import axios from "axios";
import { useRecoilState } from "recoil";
import { globalMusicState } from "@/app/state";
import Cookies from "js-cookie";

type Props = {
  onForward: () => void;
  onBackward?: () => void;
};

const AddPlaylist = ({ onForward, onBackward }: Props) => {

  const { register, handleSubmit, watch } = useForm();
  const checkboxValues = watch();
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playlsID, setPlaylstId] = useState();
  const [globalMusic, setGlobalMusic] = useRecoilState<any>(globalMusicState);
  const [isPopupVisible, setIsPopupVisible] = useState(true);


  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPlaylist(r.data.playlists);
      });
  }, []);

  const onSubmit = (value: any) => {
    axios
      .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlist/${playlsID}/${globalMusic}`,{
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setIsPopupVisible(false)
      });
  };

  return (
  //   <PlaylistBox className={styles.container} onClick={(e: any) => {
  //       e.stopPropagation()
  //   }}>
  //     <div className={styles.header}>
  //       <Icon
  //         name={"leftsideArrow"}
  //         alt="image"
  //         width={15}
  //         height={15}
  //         onClick={onBackward}
  //       />
  //       <span className={styles.title}>Add To Playlist</span>
  //     </div>

  //     <div onClick={onForward}>
  //       <NewPlaylist />
  //     </div>
  //     <form onSubmit={handleSubmit(onSubmit)} className={styles.inputWrapper}>
  //       {playlist?.map((item, i) => (
  //         <PlaylistInput
  //           name={item.name}
  //           onClick={() => setPlaylstId(item.id)}
  //           id={item.id}
  //           key={item.id}
  //           register={register}
  //         />
  //       ))}

  //       <button className={styles.button}>save</button>
  //     </form>
  //   </PlaylistBox>
  // );
   isPopupVisible ? (
    <PlaylistBox className={styles.container} onClick={(e: any) => {
        e.stopPropagation()
    }}>
      <div className={styles.header}>
        <Icon
          name={"leftsideArrow"}
          alt="image"
          width={15}
          height={15}
          onClick={onBackward}
        />
        <span className={styles.title}>Add To Playlist</span>
      </div>
  
      <div onClick={onForward}>
        <NewPlaylist />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.inputWrapper}>
        {playlist?.map((item, i) => (
          <PlaylistInput
            name={item.name}
            onClick={() => setPlaylstId(item.id)}
            id={item.id}
            key={item.id}
            register={register}
          />
        ))}
  
        <button className={styles.button}>save</button>
      </form>
    </PlaylistBox>
  ) : null
)
};

export default AddPlaylist;

