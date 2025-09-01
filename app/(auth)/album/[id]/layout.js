// app/album/[id]/layout.js
export async function generateStaticParams() {
    return [{id: '19'}, {id: '20'}, {id: '21'}];
}

export default function Layout({children}) {
    return <>{children}</>;
}