import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export type EnrollAlertDialogProps = {
    open: boolean;
    tosswindow: boolean;
    onClickStartEnroll: () => void;
    price: number;
    enrollSuccess: boolean;
    enrollFail: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    tossLoading: boolean;
    isSubmitting: boolean;
    isLoading: boolean;
    title: string;
};

export function EnrollAlertDialog({
                                      open,
                                      tosswindow,
                                      onClickStartEnroll,
                                      price,
                                      enrollSuccess,
                                      enrollFail,
                                      onCancel,
                                      onSubmit,
                                      tossLoading,
                                      isSubmitting,
                                      isLoading,
                                      title,
                                  }: EnrollAlertDialogProps) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent className={"max-w-full px-1 sm:px-6 max-h-screen overflow-y-auto"}>
                {/* 강의 등록 의사 물어보기 */}
                <div className={tosswindow ? "hidden" : "block"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>✏️ 강의등록 ✏️</AlertDialogTitle>
                        <AlertDialogDescription className={"pb-3"}>
                            {price === 0 ? "무료" : `${price.toLocaleString()}원`} 입니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancel}>둘러보기</AlertDialogCancel>
                        <AlertDialogAction onClick={onClickStartEnroll}>강의등록</AlertDialogAction>
                    </AlertDialogFooter>
                </div>

                {/* 결제창 띄우기 */}
                <div className={tosswindow ? "block" : "hidden"}>
                    {/* 결제 성공 */}
                    <AlertDialogHeader className={enrollSuccess ? "block" : "hidden"}>
                        <AlertDialogTitle>등록 완료</AlertDialogTitle>
                        <AlertDialogDescription className={"text-center text-9xl pb-15 pt-8 animate-bounce"}>
                            🎉
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* 결제 실패 */}
                    <AlertDialogHeader className={enrollFail ? "block" : "hidden"}>
                        <AlertDialogTitle>등록 오류</AlertDialogTitle>
                        <AlertDialogDescription>
                            새로고침후 다시 시도해 주세요.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogHeader className={enrollSuccess || enrollFail ? "hidden" : "block"}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            <div id={"toss-payment-methods"} className={"w-full"}></div>
                            <div id={"toss-payment-agreement"} className={"w-full"}></div>
                        </AlertDialogHeader>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancel}>
                            {enrollSuccess || enrollFail ? "수강하기" : "돌아가기"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onSubmit}
                            className={enrollSuccess || enrollFail ? "hidden" : "block"}
                            disabled={tossLoading || isSubmitting || isLoading}
                        >
                            {tossLoading ? (
                                <div className={"flex items-center gap-1"}>
                                    <Loader2 className="size-5 mr-3 animate-spin"/>
                                    <div> 로딩중 ...</div>
                                </div>
                            ) : (
                                <>
                                    {isSubmitting || isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            처리중...
                                        </div>
                                    ) : (
                                        price === 0 ? "결제없이 수강신청" : `${price.toLocaleString()}원 결제`
                                    )}
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default EnrollAlertDialog;
