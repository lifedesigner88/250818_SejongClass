import db from "~/db";
import { eq, and, sql } from "drizzle-orm";
import { textbooksTable } from "~/feature/textbooks/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import type { TossPaymentResponse } from "~/api/enrollments/TossReturnType";
import { paymentsTable, tossPaymentLogsTable } from "~/feature/payments/schema";


export const getTextbookPrice = async (textbook_id: number) => {
    return await db.query.textbooksTable.findFirst({
        where: eq(textbooksTable.textbook_id, textbook_id),
        columns: {
            price: true,
        },
    });
}

export const enrollFreeTextbook = async (textbook_id: number, user_id: string) => {
    return db.insert(enrollmentsTable).values({
        user_id,
        textbook_id,
    }).returning();
}

export const incrementEnrolledStudents = async (textbook_id: number) => {
    return db.update(textbooksTable)
        .set({
            enrolled_students: sql`${textbooksTable.enrolled_students} + 1`
        })
        .where(eq(textbooksTable.textbook_id, textbook_id)).returning()
}

export const updateEnrolledProgress = async (textbook_id: number, user_id: string, progress_rate: number) => {
    return db.update(enrollmentsTable)
        .set({
            progress_rate: progress_rate,
            last_study_date: new Date(),
        })
        .where(
            and(
                eq(enrollmentsTable.user_id, user_id),
                eq(enrollmentsTable.textbook_id, textbook_id)
            )
        )
}

// 리뷰 업데이트 함수 
export const updateReviewRating = async (textbook_id: number, user_id: string, rating: number, review: string) => {
    return db.update(enrollmentsTable)
        .set({
            rating,
            review
        })
        .where(
            and(
                eq(enrollmentsTable.user_id, user_id),
                eq(enrollmentsTable.textbook_id, textbook_id)
            )
        )

}



// 토스페이먼츠 응답 로그 저장 함수
export async function saveTossPaymentLog(
    responseData: TossPaymentResponse,
) {

    try {
        const logRecord = await db.insert(tossPaymentLogsTable).values({
            response_data: responseData,
        }).returning();

        return logRecord[0];
    } catch (error) {
        console.error('토스페이먼츠 로그 저장 실패:', error);
        // 로그 저장 실패는 중요하지 않으므로 에러를 던지지 않음
        return null;
    }
}


export const insertPaymentData = async (
    responseData: TossPaymentResponse,
    userId: string,
    textbookId: number,
    tossLog: number | null,
) => {
    try {
        const paymentRecord = await db.insert(paymentsTable).values({
            payment_key: responseData.paymentKey,
            toss_log_id: tossLog, // 로그 저장이 실패해도 결제는 저장
            user_id: userId,
            textbook_id: textbookId,
            order_id: responseData.orderId,
            order_name: responseData.orderName,
            status: responseData.status,
            method: responseData.method,
            total_amount: responseData.totalAmount,
            balance_amount: responseData.balanceAmount,
            supplied_amount: responseData.suppliedAmount,
            vat: responseData.vat,
            tax_free_amount: responseData.taxFreeAmount || 0,
            easy_pay_provider: responseData.easyPay?.provider || null,
            requested_at: new Date(responseData.requestedAt),
            approved_at: responseData.approvedAt ? new Date(responseData.approvedAt) : null,
        }).returning();

        return paymentRecord[0];
    } catch (error) {
        console.error('결제 데이터 저장 실패:', error);
        throw new Error('결제 정보 저장에 실패했습니다.');
    }
}

export const enrollPayedTextbook = async (
    userId: string,
    textbookId: number,
    paymentStatus: string
) => {

    try {
        // 토스페이먼츠 상태를 우리 시스템 상태로 매핑
        const enrollmentStatus = mapTossStatusToEnrollmentStatus(paymentStatus);

        const updatedEnrollment = await db.insert(enrollmentsTable)
            .values({
                user_id: userId,
                textbook_id: textbookId,
                enrollment_type: "PAID",
                payment_status: enrollmentStatus,
            })
            .returning();

        return updatedEnrollment[0];
    } catch (error) {
        console.error('수강 상태 업데이트 실패:', error);
        // 이 경우 결제는 이미 저장되었으므로 에러를 던지지 않고 로그만 남김
        return null;
    }
}

// 3. 토스페이먼츠 상태를 우리 시스템 상태로 매핑
function mapTossStatusToEnrollmentStatus(tossStatus: string): string {
    switch (tossStatus) {
        case 'DONE':
            return 'COMPLETED';
        case 'CANCELED':
        case 'ABORTED':
            return 'FAILED';
        case 'READY':
        case 'IN_PROGRESS':
        case 'WAITING_FOR_DEPOSIT':
        default:
            return 'PENDING';
    }
}
