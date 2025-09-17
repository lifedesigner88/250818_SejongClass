// 토스페이먼츠 결제 응답 타입 정의
export interface TossPaymentResponse {
    // 기본 정보
    mId: string;
    lastTransactionKey: string;
    paymentKey: string;
    orderId: string;
    orderName: string;

    // 금액 정보
    totalAmount: number;
    balanceAmount: number;
    suppliedAmount: number;
    vat: number;
    taxFreeAmount: number;
    taxExemptionAmount: number;

    // 상태 정보
    status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
    requestedAt: string;
    approvedAt: string;

    // 결제 수단 정보
    method: string;
    type: 'NORMAL' | 'BRANDPAY' | 'KEYIN';
    currency: 'KRW' | 'USD' | 'EUR' | 'GBP';
    country: 'KR' | 'US' | 'JP';
    version: string;

    // 옵션
    useEscrow: boolean;
    cultureExpense: boolean;
    isPartialCancelable: boolean;

    // 결제 수단별 상세 정보 (nullable)
    card: TossCardInfo | null;
    virtualAccount: TossVirtualAccountInfo | null;
    transfer: TossTransferInfo | null;
    mobilePhone: TossMobilePhoneInfo | null;
    giftCertificate: TossGiftCertificateInfo | null;
    easyPay: TossEasyPayInfo | null;

    // 기타
    cashReceipt: TossCashReceiptInfo | null;
    cashReceipts: TossCashReceiptInfo[] | null;
    discount: TossDiscountInfo | null;
    cancels: TossCancelInfo[] | null;
    failure: TossFailureInfo | null;

    // URL 정보
    receipt: {
        url: string;
    };
    checkout: {
        url: string;
    };

    // 보안
    secret: string;

    // 메타데이터 (프로젝트별 커스텀)
    metadata: {
        product_id: string;
        start_date: string;
        end_date: string;
        total_days: string;
        [key: string]: string; // 추가 메타데이터
    };
}

// 간편결제 정보
export interface TossEasyPayInfo {
    provider: '토스페이' | '카카오페이' | '페이코' | '삼성페이' | 'SSG페이' | '네이버페이' | 'KB페이' | '하나페이' | 'L페이' | '농협페이';
    amount: number;
    discountAmount: number;
}

// 카드 결제 정보
export interface TossCardInfo {
    issuerCode: string;
    acquirerCode: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    interestPayer: string | null;
    approveNo: string;
    useCardPoint: boolean;
    cardType: 'credit' | 'debit' | 'gift';
    ownerType: 'personal' | 'corporate';
    acquireStatus: 'READY' | 'REQUESTED' | 'COMPLETED' | 'CANCEL_REQUESTED' | 'CANCELED';
    amount: number;
}

// 가상계좌 정보
export interface TossVirtualAccountInfo {
    accountType: 'GENERAL' | 'FIXED';
    accountNumber: string;
    bankCode: string;
    customerName: string;
    dueDate: string;
    refundStatus: 'NONE' | 'PENDING' | 'FAILED' | 'COMPLETED';
    expired: boolean;
    settlementStatus: 'INCOMPLETED' | 'COMPLETED';
    refundReceiveAccount: TossRefundReceiveAccount | null;
}

export interface TossRefundReceiveAccount {
    bankCode: string;
    accountNumber: string;
    holderName: string;
}

// 계좌이체 정보
export interface TossTransferInfo {
    bankCode: string;
    settlementStatus: 'INCOMPLETED' | 'COMPLETED';
}

// 휴대폰 결제 정보
export interface TossMobilePhoneInfo {
    customerMobilePhone: string;
    settlementStatus: 'INCOMPLETED' | 'COMPLETED';
    receiptUrl: string;
}

// 상품권 결제 정보
export interface TossGiftCertificateInfo {
    approveNo: string;
    settlementStatus: 'INCOMPLETED' | 'COMPLETED';
}

// 현금영수증 정보
export interface TossCashReceiptInfo {
    type: 'personal' | 'corporate';
    receiptKey: string;
    issueNumber: string;
    receiptUrl: string;
    amount: number;
    taxFreeAmount: number;
}

// 할인 정보
export interface TossDiscountInfo {
    amount: number;
}

// 취소 정보
export interface TossCancelInfo {
    cancelAmount: number;
    cancelReason: string;
    taxFreeAmount: number;
    taxExemptionAmount: number;
    refundableAmount: number;
    easyPayDiscountAmount: number;
    canceledAt: string;
    transactionKey: string;
    receiptKey: string | null;
    cancelStatus: 'DONE';
    cancelRequestId: string | null;
}

// 실패 정보
export interface TossFailureInfo {
    code: string;
    message: string;
}

// 에러 응답 타입
export interface TossPaymentError {
    code: string;
    message: string;
    data: any;
}
