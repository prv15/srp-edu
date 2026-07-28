export type GlobalSearchItem = {
    id: string;
    title: string;
    subtitle: string | null;
    meta: string | null;
    url: string;
};

export type GlobalSearchSection = {
    key: string;
    label: string;
    count: number;
    has_more: boolean;
    items: GlobalSearchItem[];
};

export type GlobalSearchResponse = {
    query: string;
    sections: Record<string, GlobalSearchSection>;
    total: number;
};

export type PinnedSearchItem = GlobalSearchItem & {
    sectionKey: string;
    sectionLabel: string;
};
