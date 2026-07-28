export default function HighlightText({
    text,
    query,
}: {
    text: string;
    query: string;
}) {
    if (!query.trim()) return <>{text}</>;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedQuery})`, "ig"));

    return (
        <>
            {parts.map((part, index) =>
                part.toLocaleLowerCase() === query.toLocaleLowerCase()
                    ? <mark key={`${part}-${index}`}>{part}</mark>
                    : <span key={`${part}-${index}`}>{part}</span>,
            )}
        </>
    );
}
