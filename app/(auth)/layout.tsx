'use client'
import Menu from "../components/Menu/Menu";
import IndexPage from "../components/MusicPlayer/IndexPage";
import styles from "./layout.module.scss";
import MobileMenu from "../components/Mobilemenu/mobilemenu";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import Mobilemenu from "../components/Mobilemenu/mobilemenu";
import RecoilWrapper from "../components/RecoilWrapper/RecoilWrapper";
import PlayerHide from "@app/components/MusicPlayer/playerHide";
import {Toaster} from "react-hot-toast";

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {


    return (
        <RecoilWrapper>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2600,
                    style: {
                        background: "rgba(20, 20, 24, 0.92)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "12px",
                        backdropFilter: "blur(14px)",
                        fontSize: "14px",
                        fontWeight: 500,
                    },
                    success: {iconTheme: {primary: "#f903d0", secondary: "#fff"}},
                }}
            />
            <div className={styles.container}>
                <div className={styles.container}>
                    <div className={styles.ordynaryMenu}>
                        <Menu/>
                    </div>
                    <div className={styles.burgerMenu}>
                        <BurgerMenu/>
                    </div>
                    {children}
                    <div className={styles.container2}>
                        <PlayerHide/>
                    </div>
                    <MobileMenu/>
                </div>
            </div>
        </RecoilWrapper>
    );
}
