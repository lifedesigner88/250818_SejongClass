import { Link, useFetcher } from "react-router";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EnrolledTextbooksType } from "~/feature/textbooks/pages/my-textbooks";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet.js";
import { StarRating } from "#app/feature/units/pages/star-rating.js";

type EnrolledCourse = NonNullable<EnrolledTextbooksType>['enrollments'][number];

interface PaymentInfoDialogProps {
    payment: EnrolledCourse['payment'];
    textbookTitle: string;
}

function PaymentInfoDialog({ payment, textbookTitle }: PaymentInfoDialogProps) {
    if (!payment) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatAmount = (amount: number) => {
        return amount.toLocaleString() + '원';
    };

    return (
        <DialogContent className="max-w-md max-h-screen overflow-y-auto">
            <DialogHeader>
                <DialogTitle>결제 정보</DialogTitle>
                <DialogDescription className="hidden">.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">강의명</h4>
                    <p className="font-semibold">{textbookTitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">결제 상태</h4>
                        <Badge variant={payment.status === 'DONE' ? 'default' : 'secondary'}>
                            {payment.status === 'DONE' ? '완료' : payment.status}
                        </Badge>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">결제 방법</h4>
                        <p className="text-sm">{payment.method}</p>
                    </div>
                </div>

                {payment.easy_pay_provider && (
                    <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">간편결제</h4>
                        <p className="text-sm">{payment.easy_pay_provider}</p>
                    </div>
                )}

                <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">결제 금액</h4>
                    <p className="text-lg font-bold">{formatAmount(payment.total_amount)}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                        <p>공급가액: {formatAmount(payment.supplied_amount)}</p>
                        <p>부가세: {formatAmount(payment.vat)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">결제 요청</h4>
                        <p className="text-xs">{formatDate(payment.requested_at.toISOString())}</p>
                    </div>
                    {payment.approved_at && (
                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">결제 승인</h4>
                            <p className="text-xs">{formatDate(payment.approved_at.toISOString())}</p>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">주문 ID</h4>
                    <p className="text-xs font-mono bg-muted p-2 rounded text-center">
                        {payment.order_id}
                    </p>
                </div>
            </div>
        </DialogContent>
    );
}

interface EnrolledCourseCardProps {
    course: EnrolledCourse;
    setIsSheetOpen: (bool: boolean) => void
    setStars: (n: number) => void
    setReview: (s: string) => void
    setTextbookTitle: (s: string) => void
    setTextBookId: (n: number) => void

}

function EnrolledCourseCard({ course, setIsSheetOpen, setStars, setReview, setTextbookTitle, setTextBookId }: EnrolledCourseCardProps) {
    const { textbook, payment, progress_rate } = course;
    const navigationPath = `/${textbook.subject.theme.slug}/${textbook.subject.slug}/${textbook.textbook_id}`;

    const getProgressStatus = () => {
        if (progress_rate === 100) return { label: '완료', color: 'text-green-600', icon: CheckCircle2 };
        if (progress_rate > 0) return { label: '진행중', color: 'text-blue-600', icon: Clock };
        return { label: '시작 전', color: 'text-gray-600', icon: Clock };
    };

    const status = getProgressStatus();
    const StatusIcon = status.icon;
    const isEvaluated = course.rating !== 0

    const openEvaluateSheet = () => {
        setStars(course.rating)
        setReview(course.review)
        setTextbookTitle(course.textbook.title)
        setTextBookId(course.textbook.textbook_id)
        setIsSheetOpen(true)
    }

    return (
        <AspectRatio ratio={16 / 9}>
            <Card
                className={`w-full h-full hover:shadow-lg transition-shadow duration-200 ${progress_rate === 100 ? "bg-emerald-50" : progress_rate > 0 ? "bg-blue-50" : ""} `}>
                <CardContent className="px-5 h-full flex flex-col justify-between">
                    {/* 상단: 진행상태와 테마 정보 */}
                    <div className="flex items-start justify-between">
                        <div className={`flex items-center gap-2 ${status.color}`}>
                            <StatusIcon size={18} />
                            <span className="text-sm font-medium">{status.label}</span>
                        </div>
                        <div>
                            <p className="text-sm  text-orange-600">{progress_rate}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">{textbook.subject.theme.name}.{textbook.subject.name}</p>
                        </div>
                    </div>

                    {/* 중앙: 교재 제목과 과목 정보 */}
                    <div className="flex-1 flex flex-col justify-center text-center">
                        <Link to={navigationPath} className="block">
                            <h3 className="font-semibold text-lg hover:text-red-500 transition-colors">
                                {textbook.title}
                            </h3>
                        </Link>
                    </div>

                    {/* 하단: 결제 정보 */}
                    <div className="flex items-center justify-center">
                        {payment ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="sm"
                                        className="cursor-pointer hover:bg-orange-500">
                                        <CreditCard className={"size-5"} />
                                    </Button>
                                </DialogTrigger>
                                <PaymentInfoDialog payment={payment} textbookTitle={textbook.title} />
                            </Dialog>
                        ) : (
                            <Button variant="outline" size="sm"
                                className="cursor-pointer bg-blue-400 text-white disabled:opacity-100"
                                disabled>
                                무료
                            </Button>
                        )}
                        <Button variant="outline" size="sm"
                            onClick={openEvaluateSheet}
                            className={`cursor-pointer  ml-2 ${isEvaluated ? "" :  "bg-red-300" }`}>
                            {isEvaluated ?  `${"⭐".repeat(course.rating)} ${course.rating}` :  "후기작성" }
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AspectRatio>
    );
}

export function EnrolledCoursesGrid({ courses }: { courses: NonNullable<EnrolledTextbooksType>['enrollments'] }) {

    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
    const [stars, setStars] = useState<number>(0)
    const [review, setReview] = useState<string>("")
    const [textbookTitle, setTextbookTitle] = useState<string>("")
    const [textbookId, setTextBookId] = useState<number>(0)


    const reviewFetcher = useFetcher()
    const saveReview = () => {
        setIsSheetOpen(false)
        void reviewFetcher.submit({
            textbook_id: textbookId,
            rating: stars,
            review: review
        },
            {
                method: "POST",
                action: "/api/enrollments/update-review"
            }
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
                <EnrolledCourseCard
                    key={`${course.textbook.textbook_id}-${course.created_at}`}
                    course={course}
                    setIsSheetOpen={setIsSheetOpen}
                    setStars={setStars}
                    setReview={setReview}
                    setTextBookId={setTextBookId}
                    setTextbookTitle={setTextbookTitle}
                />
            ))}

            {/* 강의평가 시트 Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right"
                    className="max-h-screen overflow-y-auto"
                    onInteractOutside={(e) => e.preventDefault()}>
                    <SheetHeader>
                        <SheetTitle> 강의평가 </SheetTitle>
                        <SheetDescription >{`${textbookTitle}`} 강의 전반의 후기를 적어주세요. 다른 예비수강생들에게 공유 됩니다. </SheetDescription>
                    </SheetHeader>
                    <StarRating
                        value={stars}
                        onChange={setStars}
                        review={review}
                        setReview={setReview}
                    />
                    <SheetFooter>
                        <Button onClick={saveReview} className="cursor-pointer">저장</Button>
                        <SheetClose asChild>
                            <Button variant="outline">취소</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}