import { Button } from "#app/common/components/ui/button.js"
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose } from "#app/common/components/ui/dialog.js"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import type { CurriculumListType } from "./unit-page"
import { Input } from "#app/common/components/ui/input.js"
import { useEffect, useState } from "react"
import { useFetcher } from "react-router"



type EditCurriculumDialogProps = {
    unit_id: number,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    curriculumList: CurriculumListType,
    getCurriculumList: () => void
}

export const EditCurriculumDialog = ({
    unit_id,
    open,
    onOpenChange,
    curriculumList,
    getCurriculumList
}: EditCurriculumDialogProps) => {


    const [localList, setLocalList] = useState<CurriculumListType>(curriculumList)

    useEffect(() => {
        setLocalList(curriculumList)
    }, [curriculumList]);


    const fetcher = useFetcher()
    const isLoading = fetcher.state !== "idle";

    const handleAddRow = () => {
        void fetcher.submit(
            {
                type: "newRow",
                unit_id,
            },
            {
                method: "post",
                action: "/api/curriculums/update-curriculum"
            }
        )
    }

    const handleDeleteRow = (curriculum_id: number) => {
        void fetcher.submit(
            {
                type: "deleteRow",
                curriculum_id,
            },
            {
                method: "post",
                action: "/api/curriculums/update-curriculum"
            }
        )
    }

    const handleSaveRow = (index: number) => {
        const item = localList[index]
        void fetcher.submit(
            {
                type: "saveRow",
                curriculum_id: item.curriculum_id,
                sort_order: item.sort_order,
                code: item.code,
                achievement_text: item.achievement_text,
            },
            {
                method: "post",
                action: "/api/curriculums/update-curriculum"
            }
        )
    }

    const handleSaveAll = () => {

        const changedItems = localList.filter((item, index) => {
            return JSON.stringify(curriculumList[index]) !== JSON.stringify(item);
        });

        if (changedItems.length === 0)
            return;

        void fetcher.submit(
            {
                type: "saveAll",
                curriculums: JSON.stringify(changedItems),
            },
            {
                method: "post",
                action: "/api/curriculums/update-curriculum"
            }
        );
    };

    const handleChange = (
        index: number,
        field: keyof CurriculumListType[number],
        value: string | number
    ) => {
        setLocalList((prev) =>
            prev.map((item, i) => {
                if (i === index)
                    return { ...item, [field]: value }
                return item;
            })
        )
    }

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.success) {
            getCurriculumList();
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[60vw] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>커리큘럼 관리</DialogTitle>
                    <DialogDescription className="hidden">.</DialogDescription>
                </DialogHeader>

                <div className="flex justify-between mb-2">
                    <Button onClick={() => setLocalList(curriculumList)} size="sm" className="gap-2 bg-blue-100">
                        🔃
                    </Button>
                    <Button onClick={handleSaveAll} disabled={isLoading} className="bg-green-200 text-black">
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" /> 
                        )}
                    </Button>
                    <Button disabled={isLoading} onClick={handleAddRow} >
                        {isLoading ? (
                            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 처리 중... </>
                        ) : (
                            <> <Plus size={16} /> 행 추가 </>
                        )}
                    </Button>
                </div>

                {/* 헤더 영역 */}
                <div className="grid grid-cols-[80px_120px_1fr_100px] gap-2 px-2 py-2 bg-muted/50 rounded-t-md text-xs font-bold text-center text-muted-foreground">
                    <div>순서</div>
                    <div>코드</div>
                    <div>성취기준 내용</div>
                    <div>관리</div>
                </div>

                {/* 리스트 영역 (스크롤) */}
                <div className="flex-1 overflow-y-auto min-h-0 border rounded-b-md p-2 space-y-2">
                    {localList.map((item, index) => (
                        <div key={item.curriculum_id || index} className="grid grid-cols-[80px_120px_1fr_100px] gap-2 items-center">

                            <Input
                                type="number"
                                className="text-center h-9"
                                value={item.sort_order}
                                onChange={(e) => handleChange(index, 'sort_order', Number(e.target.value))}
                            />

                            <Input
                                className="h-9"
                                placeholder="예: 12국01-01"
                                value={item.code}
                                onChange={(e) => handleChange(index, 'code', e.target.value)}
                            />

                            <Input
                                className="h-9"
                                placeholder="성취기준 내용을 입력하세요"
                                value={item.achievement_text}
                                onChange={(e) => handleChange(index, 'achievement_text', e.target.value)}
                            />

                            <div className="flex items-center gap-1 justify-center">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 text-green-600 hover:text-green-700"
                                    title="저장"
                                    disabled={curriculumList[index] ? JSON.stringify(curriculumList[index]) === JSON.stringify(item) : false}
                                    onClick={() => handleSaveRow(index)}
                                >
                                    <Save size={14} />
                                </Button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    title="삭제"
                                    disabled={localList[index].achievement_text != "Delete"}
                                    onClick={() => handleDeleteRow(item.curriculum_id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {localList.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            등록된 커리큘럼이 없습니다. 행을 추가해주세요.
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">닫기</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}