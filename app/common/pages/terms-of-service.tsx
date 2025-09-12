export default function TermsOfServicePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">이용약관</h1>

            <div className="prose max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 1 조 (목적)</h2>
                    <p>
                        이 약관은 SejongClass(이하 "회사")가 제공하는 온라인 수학·물리 교육 서비스(이하 "서비스")의
                        이용조건 및 절차, 회사와 회원간의 권리·의무 및 책임사항 등을 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 2 조 (정의)</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>"서비스"</strong>란 회사가 제공하는 코드 기반 수학·물리 학습 플랫폼을 의미합니다.</li>
                        <li><strong>"회원"</strong>이란 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                        <li><strong>"무료 서비스"</strong>란 초·중·고등학교(일부) 수학 및 기초물리 콘텐츠를 말합니다.</li>
                        <li><strong>"유료 서비스"</strong>란 대학 수학, 고급 물리학 등 프리미엄 콘텐츠를 말합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 3 조 (약관의 효력 및 변경)</h2>
                    <p>
                        이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
                        회사는 필요한 경우 이 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 4 조 (회원가입)</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>회원가입은 Google OAuth를 통해 진행됩니다.</li>
                        <li>만 14세 미만은 법정대리인의 동의가 필요합니다.</li>
                        <li>허위 정보로 가입한 경우 서비스 이용이 제한될 수 있습니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 5 조 (서비스의 제공)</h2>
                    <p>회사는 다음과 같은 서비스를 제공합니다:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>무료 서비스:</strong> 기초 수학, 물리 그 외 </li>
                        <li><strong>유료 서비스:</strong> 페이지에 기재되어 있는 콘텐츠</li>
                        <li><strong>커뮤니티:</strong> 학습자 간 질문답변, 스터디 그룹</li>
                        <li><strong>학습 관리:</strong> 개인 학습 진도 추적 및 분석</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 6 조 (유료 서비스 및 결제)</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>유료 서비스는 과목별로 구매 가능합니다.</li>
                        <li>결제 완료 후 즉시 서비스 이용이 가능합니다.</li>
                        <li>결제 취소 및 환불은 관련 법령에 따라 처리됩니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 7 조 (회원의 의무)</h2>
                    <p>회원은 다음 행위를 하여서는 안 됩니다:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>타인의 개인정보를 도용하는 행위</li>
                        <li>서비스의 안정적 운영을 방해하는 행위</li>
                        <li>학습 콘텐츠를 무단으로 복제, 배포하는 행위</li>
                        <li>커뮤니티에서 타인을 비방하거나 명예를 훼손하는 행위</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 8 조 (지적재산권)</h2>
                    <p>
                        서비스에 포함된 모든 콘텐츠(텍스트, 이미지, 동영상, 소스코드 등)의 지적재산권은 회사에 귀속됩니다.
                        회원은 학습 목적으로만 이용할 수 있으며, 상업적 이용은 금지됩니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 9 조 (서비스 이용의 제한)</h2>
                    <p>
                        회사는 회원이 이 약관을 위반한 경우, 사전 통지 후 서비스 이용을 제한하거나
                        이용계약을 해지할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 10 조 (면책조항)</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>회사는 천재지변, 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.</li>
                        <li>회사는 회원의 학습 성과에 대해 보장하지 않습니다.</li>
                        <li>회사는 제3자가 제공하는 서비스(Google OAuth 등)의 장애에 대해 책임지지 않습니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 11 조 (준거법 및 관할법원)</h2>
                    <p>
                        이 약관은 대한민국 법령에 따라 규율되며, 서비스와 관련된 분쟁은
                        서울중앙지방법원을 관할법원으로 합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">제 12 조 (문의 및 연락처)</h2>
                    <p>서비스 이용 관련 문의사항이 있으시면 아래로 연락해 주세요:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>이메일: lifedesigner88@gmail.com</li>
                        <li>웹사이트: https://sejongclass.kr</li>
                    </ul>
                </section>

                <div className="border-t pt-6 mt-8">
                    <p className="text-sm text-gray-600">
                        <strong>시행일자:</strong> 2025년 9월 12일<br/>
                        <strong>최종 수정일:</strong> 2025년 9월 12일
                    </p>
                </div>
            </div>
        </div>
    );
}
