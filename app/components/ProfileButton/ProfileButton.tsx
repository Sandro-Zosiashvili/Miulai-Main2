'use client';
import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './ProfileButton.module.scss';

/**
 * Global, persistent account button. Rendered once in the authenticated
 * layout so it stays fixed in the top-right on every page.
 */
const ProfileButton = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) return;
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((r) => {
                setName(r.data?.name || '');
                setEmail(r.data?.email || '');
            })
            .catch(() => {});
    }, []);

    // Close on outside click / Escape.
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    const logout = () => {
        Cookies.remove('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setOpen(false);
        router.push('/signin');
    };

    const initial = (name || email || 'U').charAt(0).toUpperCase();

    return (
        <div className={styles.root} ref={ref}>
            <button
                className={styles.iconBtn}
                onClick={() => setOpen((o) => !o)}
                aria-label="Account"
                aria-expanded={open}
            >
                <Image src="/icon/userHeaderIcon.svg" alt="" width={22} height={22}/>
            </button>

            {open && (
                <div className={styles.popup} role="menu">
                    <div className={styles.head}>
                        <div className={styles.avatar}>{initial}</div>
                        <div className={styles.info}>
                            <span className={styles.name}>{name || 'User'}</span>
                            <span className={styles.email}>{email}</span>
                        </div>
                    </div>
                    <button className={styles.logout} onClick={logout}>
                        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;
