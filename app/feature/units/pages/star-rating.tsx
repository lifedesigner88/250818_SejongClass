import { Star } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { Textarea } from "#app/common/components/ui/textarea.js";

type StarRatingProps = {
    value: number;
    onChange: (v: number) => void;
    review: string
    setReview: (s: string) => void
};

export const StarRating = ({
    value,
    onChange,
    review,
    setReview
}: StarRatingProps) => {
    const [hover, setHover] = useState<number>(value);
    const max = 5
    const size = 20
    const MAX_LENGTH = 800
    return (
        <div className="flex flex-col">
            <Textarea
                value={review}
                onChange={(e) => {
                    if (e.target.value.length <= MAX_LENGTH)
                        setReview(e.target.value)
                }}
                maxLength={MAX_LENGTH}
                placeholder="수강평을 남겨주세요"
                className="max-h-120 resize-y"
            />
            <div className="text-xs text-muted-foreground text-right mr-2 mt-1">
                {review.length} / {MAX_LENGTH}
            </div>

            <div className="inline-flex items-center gap-2 justify-center mt-5">
                <ToggleGroup
                    type="single"
                    value={String(value || "0")}
                    onValueChange={() => onChange(hover)}
                >
                    {Array.from({ length: max }, (_, i) => {
                        const score = i + 1;
                        const filled = score <= hover;

                        return (
                            <ToggleGroupItem
                                key={score}
                                value={String(score)}
                                aria-label={`${score}점`}
                                className="h-9 w-9 p-0 data-[state=on]:bg-transparent"
                                onMouseEnter={() => setHover(score)}
                                onMouseLeave={() => setHover(value)}
                            >
                                <Star
                                    style={{ width: size, height: size }}
                                    className={cn(
                                        "transition-colors",
                                        filled ? "fill-current text-yellow-500" : "text-muted-foreground"
                                    )}
                                />
                            </ToggleGroupItem>
                        );
                    })}
                </ToggleGroup>

                <span className="text-sm text-muted-foreground w-10 tabular-nums">
                    {value ? `${value}/${max}` : `0/${max}`}
                </span>
            </div>
        </div>

    );
}


