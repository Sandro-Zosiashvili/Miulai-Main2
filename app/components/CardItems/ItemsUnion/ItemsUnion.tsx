import styles from './ItemsUnion.module.scss';
import Dots from "../CardDots/Dots";
import Heart from "../CardHeart/Heart";
import {useState} from 'react';
import Playlist from '../../Playlist/Playlist';

const ItemsUnion = () => {
    const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);


    const changeOnDotsClick = (e) => {
        e.stopPropagation();
        setIsPlaylistVisible(prev => !prev);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Dots onClick={changeOnDotsClick}/>
            </div>
            <div className={isPlaylistVisible ? styles.playlistVisible : styles.playlistHidden}>
                <Playlist/>
            </div>
        </div>
    );
};

export default ItemsUnion;
