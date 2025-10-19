import type { Route } from "./+types/enroll";
import { z } from "zod";
import type { TossPaymentResponse } from "~/api/enrollments/TossReturnType";
import {
    enrollPayedTextbook,
    getTextbookPrice, incrementEnrolledStudents,
    insertPaymentData,
    saveTossPaymentLog,
} from "~/api/enrollments/mutation";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { ArrowRight, BookOpen, CheckCircle, Clock, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#app/common/components/ui/card.js";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "#app/common/components/ui/button.js";
import { Badge } from "@/components/ui/badge";


const paramsSchema = z.object({
    paymentType: z.string(),
    orderId: z.uuid(),
    paymentKey: z.string(),
    amount: z.coerce.number(),
})

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

export const loader = async ({ request }: Route.ActionArgs) => {
    const url = new URL(request.url);
    const { success, data } = paramsSchema.safeParse(Object.fromEntries(url.searchParams));
    if (!success) return new Response(null, { status: 400 })

    const encryptedSecretKey = `Basic ${Buffer.from(TOSS_SECRET_KEY + ":").toString("base64")}`;

    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
            "Authorization": encryptedSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            paymentKey: data.paymentKey,
            orderId: data.orderId,
            amount: data.amount,
        })
    })

    const responseData: TossPaymentResponse = await response.json();
    console.log(responseData)

    // 1. 먼저 토스 로그 저장
    const tossLog = await saveTossPaymentLog(responseData);

    const sessionUserId = await getUserIdForServer(request);
    if (!sessionUserId) console.log("sessionUserId is null");

    const textbookId = Number(responseData.metadata.textbook_id);
    const userId = (responseData.metadata.user_id === sessionUserId) ? sessionUserId : null;

    if (!userId) console.log("userId is Different");
    if (!textbookId) console.log("textbookId is null");

    const { price: DBPrice }: any = await getTextbookPrice(textbookId);

    // DB와 가격일치 여부 체크.
    const requestPrice = responseData.totalAmount;
    if (Number(requestPrice) === Number(DBPrice) && userId !== null)
        console.log("결제 정보 이상없음")

    try {

        // 2. 별도로 enrollment 상태 업데이트 (실패해도 결제 데이터는 보존됨)
        const enrollTextbook = await enrollPayedTextbook(
            userId!,
            textbookId,
            responseData.status
        );

        if (enrollTextbook) {
            console.log('✅ 수강 상태 업데이트 완료:', enrollTextbook.payment_status);
        } else {
            console.warn('⚠️ 수강 상태 업데이트 실패 (결제는 정상 저장됨)');
        }

        const savedPayment = await insertPaymentData(responseData, userId!, textbookId, tossLog?.id || null);
        console.log('✅ 결제 데이터 저장 완료:', savedPayment.payment_key);

        await incrementEnrolledStudents(textbookId)
        return { success: true, payment: savedPayment, enrollment: enrollTextbook, metadata: responseData.metadata };

    } catch (error) {
        console.error('❌ 결제 처리 중 오류:', error);
        throw error;
    }
};

export default function Enroll({ loaderData }: Route.ComponentProps) {

    const data = loaderData;
    const [countdown, setCountdown] = useState(15);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    // 3초 후 리다이렉트
                    window.location.href = data.metadata.redirect_url;
                    return 0;
                }
                return prev - 1;
            });

            setProgress((prev) => prev - (100 / 15));
        }, 1000);

        return () => clearInterval(timer);
    }, [data.metadata.redirect_url]);

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-6">
                {/* 성공 헤더 */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            결제가 완료되었습니다! 🎉
                        </h1>
                        <p className="text-lg text-gray-600">
                            이제 수강을 시작할 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 결제 정보 카드 */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <CardTitle>결제 정보</CardTitle>
                        </div>
                        <CardDescription>
                            결제가 성공적으로 처리되었습니다
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">강의명</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {data.payment.order_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">결제 금액</p>
                                    <p className="text-xl font-bold text-green-600">
                                        {formatAmount(data.payment.total_amount)}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">결제 방법</p>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            {data.payment.method}
                                        </Badge>
                                        {data.payment.easy_pay_provider && (
                                            <Badge variant="outline">
                                                {data.payment.easy_pay_provider}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">결제 완료 시간</p>
                                    <p className="text-sm text-gray-700">
                                        {formatDate(`${data.payment.approved_at}`)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">주문번호</span>
                                <span className="font-mono text-gray-700 text-xs">
                  {data.payment.order_id}
                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-gray-500">결제번호</span>
                                <span className="font-mono text-gray-700 text-xs">
                  {data.payment.payment_key}
                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 수강 정보 카드 */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-green-600" />
                            <CardTitle>수강 정보</CardTitle>
                        </div>
                        <CardDescription>
                            수강 등록이 완료되었습니다
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div>
                                    <p className="font-semibold text-green-800">수강 활성화됨</p>
                                    <p className="text-sm text-green-600">
                                        지금 바로 학습을 시작할 수 있습니다
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-green-600 text-white">
                                {data.enrollment!.enrollment_type === 'PAID' ? '유료 수강' : '무료 수강'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* 자동 리다이렉트 카드 */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-2 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm">
                              {countdown}초 후 강의 페이지로 자동 이동합니다
                            </span>
                            </div>

                            <div className="space-y-2">
                                <Progress value={progress} className="w-full h-2" />
                                <div className="flex space-x-3 justify-center">
                                    <Button
                                        onClick={() => window.location.href = data.metadata.redirect_url}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        지금 바로 학습 시작
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        이전 페이지로
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 추가 안내 */}
                <div className="text-center text-sm text-gray-500 space-y-2">
                    <p>결제 영수증은 이메일로 발송됩니다.</p>
                    <p>문의사항이 있으시면 고객센터로 연락해주세요.</p>
                </div>
            </div>
        </div>
    );

}
