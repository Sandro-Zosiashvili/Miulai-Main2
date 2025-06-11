
import styles from './UserPopup.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { clickFetchState } from '@/app/state';

type Props = {
    userName?: string;
    userGmail?: string;
}

const UserPopup = ({ userName,}: Props) => {
    const [email, setEmail] = useState<string>('');
    const [name,setName] =useState<string>('')
    const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token");
                console.log(token , 'token ')

                const response = await axios.get('https://backend.miulai.ge/user/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response.data.email);  // Log the full response to inspect the structure
                console.log(response.data.email && '===============>');
                console.log(response.data.name);  // Log the full response to inspect the structure

                
                setName(response.data.name)
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);
    const getToken = () => {
        const match = Cookies.get('token');
        return match 
    };





    const router = useRouter();
    const handleLogOut = () => {
        setClickFetch(!clickFetch)
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        Cookies.remove('token');
        router.push('/signin')
        // window.location.reload();
    };


    return (
        <div className={styles.container}>
            <div className={styles.userNameWrapper}>
                <Image src={'/icon/userHeaderIcon.svg'} alt='image' width={20} height={20} />
                <span className={styles.userName}>{name}</span>
            </div>
            <span className={styles.gmail}>{email}</span>
            <div className={styles.logoutWrapper} onClick={handleLogOut}>
                <Image src={'/icon/logoutIcon.svg'} alt='image' width={20} height={20} />
                <span className={styles.logout}>Log out</span>
            </div>
        </div>
    );
}

export default UserPopup;
