import { useEffect, useMemo, useState } from "react";
import { searchEntireErp } from "./search.service";
import type { GlobalSearchResponse } from "./types";

const EMPTY_RESULTS: GlobalSearchResponse = {
    query: "",
    sections: {},
    total: 0,
};

export function useGlobalSearch(instituteId: number, query: string) {
    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    const [results, setResults] = useState<GlobalSearchResponse>(EMPTY_RESULTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (normalizedQuery.length < 2 || instituteId <= 0) {
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            setLoading(true);
            setError("");
            searchEntireErp(instituteId, normalizedQuery, controller.signal)
                .then(setResults)
                .catch(requestError => {
                    if (requestError instanceof DOMException && requestError.name === "AbortError") {
                        return;
                    }
                    setResults(EMPTY_RESULTS);
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : "Search is temporarily unavailable.",
                    );
                })
                .finally(() => {
                    if (!controller.signal.aborted) setLoading(false);
                });
        }, 300);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [instituteId, normalizedQuery]);

    const activeResults = normalizedQuery.length >= 2 ? results : EMPTY_RESULTS;
    const sections = useMemo(
        () => Object.values(activeResults.sections),
        [activeResults.sections],
    );
    const items = useMemo(
        () => sections.flatMap(section =>
            section.items.map(item => ({ item, section })),
        ),
        [sections],
    );

    return {
        results: activeResults,
        sections,
        items,
        loading: normalizedQuery.length >= 2
            && (loading || activeResults.query !== normalizedQuery),
        error: normalizedQuery.length >= 2 ? error : "",
        normalizedQuery,
    };
}
