import IndexPage from "@app/components/MusicPlayer/IndexPage";
import {useRecoilState} from "recoil";
import {mudicIDState} from "@app/state";


const PlayerHide = () => {
    const [musicID, setMusicId] = useRecoilState(mudicIDState);

    return (
        <>
            {
                musicID &&
                <IndexPage/>
            }
        </>

    )
}

export default PlayerHide;