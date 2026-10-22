"use client";
import styles from "./ReusableHeader.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserPopup from "../UserPopup/UserPopup";

const ReusableHeader = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imagesec}></div>
      <div onClick={() => router.back()} className={styles.img}>
        <Image
          src={"/icon/arrow-left.svg"}
          alt={"image"}
          width={22}
          height={22}
        />
      </div>

    </div>
  );
};

export default ReusableHeader;
