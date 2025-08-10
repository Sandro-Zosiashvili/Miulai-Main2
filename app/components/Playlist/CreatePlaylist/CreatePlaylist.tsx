import Button from '../../Button/Button';
import Icon from '../../Icon/Icon';
import PlaylistBox from '../../PlaylistBox/PlaylistBox';
import styles from './CreatePlaylist.module.scss';
import {useForm, SubmitHandler} from "react-hook-form"
import {useEffect, useState} from 'react'
import axios from 'axios';
import Cookies from 'js-cookie'
import {useRecoilState} from 'recoil';
import {clickFetchState} from '@/app/state';


type Props = {
    onClick?: () => void;
    setRoute?: any
}


const CreatePlaylist = ({onClick, setRoute}: Props) => {
    const {register, handleSubmit, watch, formState: {errors},} = useForm<any>()
    const [userId, setUserId] = useState()
    const token = Cookies.get('token');
    const [clickFetch, setClickFetch] = useRecoilState(clickFetchState);


    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((r) => {
            setUserId(r.data.id)
        })
    }, [])

    const onSubmit = async (values: any) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/playlist`, {
                'name': String(values.name),
                'userId': String(userId)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                setRoute(null)
            });
            setClickFetch(!clickFetch)

        } catch (error) {

            return error.response.data.message;
        }
    };


    return (
        <PlaylistBox className={styles.container} onClick={(e: any) => {
            e.stopPropagation()
        }}>
            <div className={styles.header}>
                <Icon
                    name={"leftsideArrow"}
                    alt="image"
                    width={20}
                    height={20}
                    onClick={onClick}
                />
                <span className={styles.title}>Create New Playlist</span>
            </div>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder="Playlist name"
                    className={styles.inp}
                    {...register("name")}
                />
                <Button
                    title={"Save"}
                    mode={"reusable button"}
                    padding='10px'
                    borderRadius='8px'
                    width={"290px"}
                    height="100px"
                    onClick={() => console.log('')}
                />
            </form>
        </PlaylistBox>
    );
}

export default CreatePlaylist;
