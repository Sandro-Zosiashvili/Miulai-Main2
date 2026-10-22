'use client'

import styles from './page.module.scss'
import Image from 'next/image'
import News from '@/app/components/News/News'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import ReusableHeader from '@/app/components/ReusableHeader/ReusableHeader'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRecoilState } from 'recoil'
import { oneArrayMusicState, mudicIDState } from '@/app/state'
import PlaylistTable from '../../../components/Table/PlaylistTable/PlaylistTable'
import Cookies from "js-cookie";

const formatDuration = (seconds: number) => {
    const m = Math.floor((seconds || 0) / 60);
    const s = Math.floor((seconds || 0) % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Id = () => {
    const router = useRouter();
    const [newName, setNewName] = useState<string>();
    const [data, setData] = useState<any[]>([]);
    const [allTracks, setAllTracks] = useState<any[]>([]);
    const [query, setQuery] = useState('');
    const [addingId, setAddingId] = useState<number | null>(null);
    const [, setMusicArrayTwo] = useRecoilState<any>(oneArrayMusicState);
    const [, setMusicId] = useRecoilState(mudicIDState);
    const param = useParams();
    const token = Cookies.get("token");

    const auth = { headers: { Authorization: `Bearer ${token}` } };

    const cover = data[0]?.album?.albumImage || '/icon/albumicon5.svg';
    const totalDuration = data.reduce((sum, m) => sum + (m?.duration || 0), 0);

    const playAll = () => {
        if (!data.length) return;
        setMusicArrayTwo(data);
        setMusicId(data[0].id);
    };
    const shuffleAll = () => {
        if (!data.length) return;
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setMusicArrayTwo(shuffled);
        setMusicId(shuffled[0].id);
    };
    const deletePlaylist = async () => {
        if (!confirm('Delete this playlist? This cannot be undone.')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/playlists/${param.id}`, auth);
            toast.success('Playlist deleted');
            router.push('/playlists');
        } catch {
            toast.error('Could not delete the playlist');
        }
    };

    const loadPlaylist = () => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/playlists/${param.id}`, auth)
            .then((r) => {
                const musics = r.data?.musics || [];
                setData(musics);
                setNewName(r.data?.name);
                setMusicArrayTwo(musics);
            })
            .catch(() => { });
    };

    useEffect(() => {
        loadPlaylist();
        // Pool of tracks to search/add from.
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music`, auth)
            .then((r) => setAllTracks(Array.isArray(r.data) ? r.data : []))
            .catch(() => { });
    }, [param.id]);

    // Track-only search: filter the music pool by name / artist, excluding
    // tracks already in this playlist.
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        const inPlaylist = new Set(data.map((d) => d.id));
        return allTracks
            .filter((t) =>
                !inPlaylist.has(t.id) &&
                ((t.name || '').toLowerCase().includes(q) ||
                    (t.artistName || '').toLowerCase().includes(q)))
            .slice(0, 8);
    }, [query, allTracks, data]);

    const addTrack = async (track: any) => {
        setAddingId(track.id);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlists/${param.id}/music/${track.id}`,
                {},
                auth
            );
            // Optimistically append, then refetch to stay in sync.
            setData((prev) => [...prev, track]);
            toast.success(`Added "${track.name}"`);
            loadPlaylist();
        } catch {
            toast.error('Could not add the track');
        } finally {
            setAddingId(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cellheader}>
                <ReusableHeader />
            </div>
            <div>
                <Image onClick={() => router.back()} className={styles.tabletCursor} src={'../icon/isari.svg'} width={32} height={32} alt='image' />
                <News
                    album={true}
                    badge="Playlist"
                    title={newName || "Loading..."}
                    image={cover}
                    trackCount={data.length}
                    totalDuration={totalDuration}
                    onPlayAll={playAll}
                    onShuffle={shuffleAll}
                    onEdit={() => toast('Edit details — coming soon')}
                    onDelete={deletePlaylist}
                />
            </div>

            {/* ---- Search & quick-add tracks to this playlist ---- */}
            <section className={styles.addSection}>
                <h3 className={styles.addTitle}>Add tracks to this playlist</h3>
                <div className={styles.searchWrap}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                        <path d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        className={styles.searchInput}
                        placeholder="Search tracks by title or artist…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear">✕</button>
                    )}
                </div>

                {query.trim() && (
                    <div className={styles.results}>
                        {results.length === 0 ? (
                            <div className={styles.empty}>No tracks found</div>
                        ) : (
                            results.map((t) => (
                                <div key={t.id} className={styles.resultRow}>
                                    <img
                                        className={styles.resultThumb}
                                        src={t?.album?.albumImage || '/icon/albumicon5.svg'}
                                        alt=""
                                    />
                                    <div className={styles.resultText}>
                                        <span className={styles.resultName}>{t.name}</span>
                                        <span className={styles.resultArtist}>{t.artistName}</span>
                                    </div>
                                    <span className={styles.resultTime}>{formatDuration(t.duration)}</span>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => addTrack(t)}
                                        disabled={addingId === t.id}
                                        aria-label={`Add ${t.name}`}
                                    >
                                        {addingId === t.id ? '…' : '+'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            <PlaylistTable data={data} />
        </div>
    )
}

Id.displayName = 'Id';

export default Id;
