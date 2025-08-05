'use client'
import {RecoilRoot, useRecoilState} from "recoil";


interface Props {
    children: React.ReactNode
}


const RecoilWrapper = (props: Props) => {
    return (
        <RecoilRoot>
            {props.children}
        </RecoilRoot>
    )

}

export default RecoilWrapper;