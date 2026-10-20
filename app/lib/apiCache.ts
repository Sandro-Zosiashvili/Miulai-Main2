import axios, {AxiosRequestConfig} from "axios";

/**
 * Lightweight in-memory GET cache + in-flight de-duplication.
 *
 * - De-duplicates concurrent identical GETs (e.g. the home page asked for
 *   /music from three different components at once -> now a single request).
 * - Reuses the result for a short TTL so navigating back to a page you just
 *   visited is instant instead of refetching everything.
 *
 * Only use this for READ-ONLY list endpoints (/music, /album, /author, ...).
 * Those are never mutated from the public app, so cached data can't go stale
 * for the user. Do NOT use it for anything the user can change (playlists,
 * /user/me), so behaviour stays exactly the same — just faster.
 */
const store = new Map<string, { ts: number; promise: Promise<any> }>();

const DEFAULT_TTL = 60_000; // 1 minute

export function cachedGet(
    url: string,
    config?: AxiosRequestConfig,
    ttl: number = DEFAULT_TTL,
) {
    const now = Date.now();
    const hit = store.get(url);
    if (hit && now - hit.ts < ttl) {
        return hit.promise;
    }

    const promise = axios.get(url, config).catch((err) => {
        // Never cache failures — allow the next call to retry.
        store.delete(url);
        throw err;
    });

    store.set(url, {ts: now, promise});
    return promise;
}

/** Drop a cached entry (optional helper for callers that need fresh data). */
export function invalidateCache(url: string) {
    store.delete(url);
}
