import styles from './Dots.module.scss';
import Image from 'next/image';

interface Props {
    onClick?: (e: any) => void;
}

const Dots = (props: Props) => {
    return (
        <div className={styles.dots} onClick={props.onClick}>
            <Image src={'/icon/card-dots.svg'} alt="dots icon" width={32} height={32}/>
        </div>
    );
};

export default Dots;
