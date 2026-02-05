import { Button } from "#app/common/components/ui/button.js"
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose } from "#app/common/components/ui/dialog.js"
import { Plus, Save, Trash2 } from "lucide-react"
import type { CurriculumListType } from "./unit-page"
import { Input } from "#app/common/components/ui/input.js"
import { useEffect, useState } from "react"



type EditCurriculumDialogProps = {
    unit_id: number,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    curriculumList: CurriculumListType
}

export const EditCurriculumDialog = ({
    open,
    onOpenChange,
    curriculumList
}: EditCurriculumDialogProps) => {


    const [localList, setLocalList] = useState<CurriculumListType>(curriculumList)
    useEffect(() => {
        setLocalList(curriculumList);
    }, [curriculumList]);

    const handleAddRow = () => {

    }

    console.log(curriculumList)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[60vw] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>커리큘럼 관리</DialogTitle>
                    <DialogDescription className="hidden">.</DialogDescription>
                </DialogHeader>

                <div className="flex justify-end mb-2">
                    <Button onClick={handleAddRow} size="sm" className="gap-2">
                        <Plus size={16} /> 행 추가
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

                            {/* 순서 Input */}
                            <Input
                                type="number"
                                className="text-center h-9"
                                value={item.sort_order}
                            // onChange={(e) => handleChange(index, 'sort_order', Number(e.target.value))}
                            />

                            {/* 코드 Input */}
                            <Input
                                className="h-9"
                                placeholder="예: 12국01-01"
                                value={item.code}
                            // onChange={(e) => handleChange(index, 'code', e.target.value)}
                            />

                            {/* 내용 Input */}
                            <Input
                                className="h-9"
                                placeholder="성취기준 내용을 입력하세요"
                                value={item.achievement_text}
                            // onChange={(e) => handleChange(index, 'achievement_text', e.target.value)}
                            />

                            {/* 버튼 그룹 */}
                            <div className="flex items-center gap-1 justify-center">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 text-green-600 hover:text-green-700"
                                    title="저장"
                                // onClick={() => handleSaveRow(item)}
                                >
                                    <Save size={14} />
                                </Button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    title="삭제"
                                // onClick={() => handleDeleteRow(index, item.curriculum_id)}
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