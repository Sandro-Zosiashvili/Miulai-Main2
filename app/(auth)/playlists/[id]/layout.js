// app/album/[id]/layout.js
export async function generateStaticParams() {
    // 1-დან 100-მდე ყველა ID-ის გენერირება
    return Array.from({ length: 100 }, (_, i) => ({
        id: (i + 1).toString()
    }));
}

export default function Layout({ children }) {
    return <>{children}</>;
}