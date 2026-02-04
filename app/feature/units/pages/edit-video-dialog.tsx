import { Input } from "@/components/ui/input.js"
import { Button } from "@/components/ui/button.js"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.js"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useFetcher } from "react-router"


type EditVideoDialogProps = {
    unit_id: number,
    youtube_video_id: string | null,
    estimated_seconds: number,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

export const EditVideoDialog = ({
    unit_id,
    youtube_video_id,
    estimated_seconds,
    open,
    onOpenChange
}: EditVideoDialogProps) => {

    const [youtubeID, setYoutubeID] = useState<string | null>(youtube_video_id ?? null)

    const [estimatedSecond, setEstimatedSecond] = useState<number>(estimated_seconds)
    const [seoond, setSecond] = useState<number>(estimated_seconds % 60)
    const [minute, setMinute] = useState<number>(Math.floor(estimated_seconds / 60))


    const updateFetcher = useFetcher()

    const updateUnitVideo = () => {

        void updateFetcher.submit(
            {
                unit_id,
                youtube_video_id: youtubeID,
                estimated_seconds: estimatedSecond
            },
            {
                method: "post",
                action: "/api/units/update-video"
            }
        )
        onOpenChange(false)
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>영상 시간, ID 수정</DialogTitle>
                    <DialogDescription className="hidden">.</DialogDescription>
                </DialogHeader>
                소요시간
                <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">분</span>
                        <Input
                            value={minute}
                            required
                            min={0}
                            type="number"
                            inputMode="numeric"
                            step={1}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setMinute(val);
                                setEstimatedSecond(seoond + (val * 60));
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">초</span>
                        <Input
                            value={seoond}
                            required
                            min={0}
                            type="number"
                            inputMode="numeric"
                            step={1}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setSecond(val);
                                setEstimatedSecond(val + (minute * 60));
                            }}
                        />
                    </div>
                </div>
                유튜브ID
                <Input
                    value={youtubeID ?? ""}
                    required
                    onChange={(e) => setYoutubeID(e.target.value)}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>
                            취소
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={() => {
                            setYoutubeID(youtube_video_id ?? "")
                            setEstimatedSecond(estimated_seconds)
                            setSecond(estimated_seconds % 60)
                            setMinute(Math.floor(estimated_seconds / 60))
                        }}
                        variant={"outline"}>
                        🔃
                    </Button>
                    <Button onClick={updateUnitVideo} >
                        수정
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}