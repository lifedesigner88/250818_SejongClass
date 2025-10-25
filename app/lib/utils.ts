import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update 시점 계산
export const isNewInOneMonth = (updatedAt: Date): boolean => {
    const updateDate = DateTime.fromJSDate(updatedAt);
    const oneMonthAgo = DateTime.now().minus({ week: 1 });
    // const oneMonthAgo = DateTime.now().minus({ month: 1 });
    return updateDate > oneMonthAgo;
};



import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}
