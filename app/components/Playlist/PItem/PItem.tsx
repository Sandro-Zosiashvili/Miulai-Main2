import { MouseEventHandler } from "react";
import Icon from "../../Icon/Icon";
import styles from "./PItem.module.scss";
import Image from "next/image";

type Props = {
  image: string;
  title: string;
  onClick?: MouseEventHandler;
};

const PItem = ({ image, title, onClick }: Props) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <Icon name={image} alt="image" width={24} height={24} />
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default PItem;
