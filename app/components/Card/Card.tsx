import styles from './Card.module.scss';
import Image from 'next/image';
import ItemsUnion from '../CardItems/ItemsUnion/ItemsUnion';
import {useState} from 'react';

interface Props {
    header?: string;
    image: string;
    subtitle?: string;
    title?: string;
    imageStyle?: 'normal' | 'round';
    /** Top Hits cards: show a glowing Play overlay + active equalizer. */
    playable?: boolean;
    /** This card's track is the one currently playing. */
    active?: boolean;
}

const Card = (props: Props) => {
    const radius = [styles.image];
    if (props.imageStyle === 'round') radius.push(styles.imageRounded)
    if (props.imageStyle === 'normal') radius.push(styles.imageNormal)


    return (
        <div className={styles.wrapper}>
            <h3 className={styles.heading}>{props.header}</h3>
            <div className={`${styles.container} ${props.active ? styles.containerActive : ''}`.trim()}>
                <div className={`${styles.media} ${props.imageStyle === 'round' ? styles.mediaRound : ''} ${props.active ? styles.mediaActive : ''}`.trim()}>
                    <Image
                        className={radius.join(' ').trim()}
                        src={props.image}
                        alt='image' width={210}
                        height={195}
                        loading="lazy"
                        sizes="210px"
                    />

                    {props.playable ? (
                        <div className={`${styles.playVeil} ${props.active ? styles.playVeilActive : ''}`.trim()}>
                            {props.active ? (
                                <span className={styles.eq} aria-hidden="true">
                                    <i/><i/><i/><i/>
                                </span>
                            ) : (
                                <span className={styles.playBtn} aria-hidden="true">
                                    <svg viewBox="0 0 24 24" width={22} height={22}>
                                        <path d="M8 5v14l11-7z" fill="#fff"/>
                                    </svg>
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className={styles.union}>
                            <ItemsUnion/>
                        </div>
                    )}
                </div>

                <span className={styles.subtitle}>{props.subtitle}</span>
                <h4 className={styles.h4}>{props.title}</h4>
            </div>
        </div>
    )
}

export default Card;