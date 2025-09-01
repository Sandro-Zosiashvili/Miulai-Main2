export async function generateStaticParams() {
    return [{ id: '29' }, { id: '31' }, { id: '33' },{ id: '34'}];
}

export default function Layout({ children }) {
    return <>{children}</>;
}