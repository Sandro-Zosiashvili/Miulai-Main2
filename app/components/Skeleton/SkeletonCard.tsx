import styles from "./Skeleton.module.scss";

interface Props {
    round?: boolean;
}

/**
 * Placeholder card shown while a section's data is loading.
 * Matches the real Card layout (image + subtitle + title) with a shimmer.
 */
const SkeletonCard = ({round = false}: Props) => {
    return (
        <div className={styles.card}>
            <div
                className={`${styles.image} ${round ? styles.round : ""} ${styles.shimmer}`}
            />
            <div className={`${styles.lineSub} ${styles.shimmer}`}/>
            <div className={`${styles.lineTitle} ${styles.shimmer}`}/>
        </div>
    );
};

export default SkeletonCard;
