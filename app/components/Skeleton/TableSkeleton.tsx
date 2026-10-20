import styles from "./Skeleton.module.scss";

interface Props {
    rows?: number;
}

/**
 * Shimmer placeholder for a tracklist table while data loads.
 * Row height matches a real track row (48px cover + padding) to avoid layout
 * shift (CLS) when the real rows replace it.
 */
const TableSkeleton = ({rows = 6}: Props) => {
    return (
        <div className={styles.table}>
            {[...Array(rows)].map((_, i) => (
                <div className={styles.tableRow} key={i}>
                    <div className={`${styles.rowNum} ${styles.shimmer}`}/>
                    <div className={`${styles.rowThumb} ${styles.shimmer}`}/>
                    <div className={styles.rowText}>
                        <div className={`${styles.rowLineTitle} ${styles.shimmer}`}/>
                        <div className={`${styles.rowLineSub} ${styles.shimmer}`}/>
                    </div>
                    <div className={`${styles.rowAlbum} ${styles.shimmer}`}/>
                    <div className={`${styles.rowTime} ${styles.shimmer}`}/>
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;
