export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>

            <div className="prose max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. 개인정보 수집 및 이용목적</h2>
                    <p>SejongClass는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                    <ul>
                        <li>회원 가입 및 관리</li>
                        <li>교육 서비스 제공</li>
                        <li>학습 진도 관리</li>
                        <li>고객 상담 및 서비스 개선</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. 수집하는 개인정보 항목</h2>
                    <p><strong>Google OAuth를 통한 수집 정보:</strong></p>
                    <ul>
                        <li>이메일 주소</li>
                        <li>이름</li>
                        <li>프로필 이미지 (선택사항)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. 개인정보 보유 및 이용기간</h2>
                    <p>회원탈퇴 시까지 보유하며, 탈퇴 시 즉시 삭제합니다.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. 개인정보 제3자 제공</h2>
                    <p>SejongClass는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. 연락처</h2>
                    <p>개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요:</p>
                    <p>이메일: privacy@sejongclass.kr</p>
                </section>

                <p className="text-sm text-gray-600 mt-8">
                    최종 업데이트: 2025년 9월 12일
                </p>
            </div>
        </div>
    );
}
