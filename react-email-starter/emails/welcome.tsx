import {
    Body,
    Head,
    Html,
    Tailwind,
    Text,
    Img,
    Section,
    Container,
    Heading,
    Button
} from '@react-email/components';

export default function WelcomeUser({ username }: { username: string }) {
    return (
        <Html>
            <Head/>
            <Tailwind>
                <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
                    <Container className={"my-20"}>
                        {/* 헤더 섹션 */}
                        <Section style={{
                            backgroundColor: '#ffffff',
                            padding: '40px 30px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px'
                        }}>
                            <Heading style={{
                                color: '#1e293b',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                margin: '0 0 10px 0'
                            }}>
                                🎉 환영합니다, {username}님!
                            </Heading>

                        </Section>

                        {/* 목표 섹션 */}
                        <Section style={{
                            backgroundColor: '#ffffff',
                            padding: '30px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px'
                        }}>
                            <Heading style={{
                                color: '#dc2626',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                margin: '0 0 20px 0'
                            }}>
                                🎯 우리의 목표
                            </Heading>

                            <Text style={{
                                color: '#374151',
                                fontSize: '16px',
                                textAlign: 'center',
                                lineHeight: '1.6',
                                margin: '0 0 15px 0'
                            }}>
                                세 개의 핵심 물리 공식을 완벽히 이해하여<br/>
                                물리학의 기초를 탄탄히 다져봅시다!
                            </Text>

                            <Text style={{
                                color: '#059669',
                                fontSize: '14px',
                                textAlign: 'center',
                                fontWeight: '600',
                                backgroundColor: '#ecfdf5',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #d1fae5',
                                margin: '0'
                            }}>
                                ✨ 함께 도전하면 더 멀리 갈 수 있어요!
                            </Text>
                        </Section>

                        {/* 물리 공식들 섹션 */}
                        <Section style={{
                            backgroundColor: '#ffffff',
                            padding: '30px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px',
                        }}>


                            <Heading style={{
                                color: '#1e293b',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                margin: '20px 0 0 0'
                            }}>
                                📚 앞으로 다루게 될 개념들
                            </Heading>

                            {/* 공식 1 */}

                            <Img
                                src="https://ierkuifrgbcadwasnkih.supabase.co/storage/v1/object/public/image/email/welcome/2.png"
                                alt="A"
                                className="mx-auto mt-10 pb-1 w-full max-w-[600px]"
                            />

                            <Text style={{
                                color: '#dc2626',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                margin: '0 0 10px 0',
                                textAlign: 'center',
                            }}>
                                1️⃣ 미분 적분 수학
                            </Text>

                            {/* 공식 2 */}
                            <Img
                                src="https://ierkuifrgbcadwasnkih.supabase.co/storage/v1/object/public/image/email/welcome/1.png"
                                alt="A"
                                className="mx-auto mt-10 pb-1 w-full max-w-[300px]"
                            />

                            <Text style={{
                                color: '#dc2626',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                margin: '10px 0 10px 0',
                                textAlign: 'center',
                            }}>
                                2️⃣ 오일러-라그랑주 방정식
                            </Text>

                            {/* 공식 3 */}
                            <Img
                                src="https://ierkuifrgbcadwasnkih.supabase.co/storage/v1/object/public/image/email/welcome/4.png"
                                alt="A"
                                className="mx-auto mt-10 pb-1"
                                width={"100%"}
                            />

                            <Text style={{
                                color: '#dc2626',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                margin: '0 0 20px 0',
                                textAlign: 'center',
                            }}>
                                3️⃣ 이건 뭘까요 ? ^^
                            </Text>
                        </Section>

                        {/* 마무리 섹션 */}
                        <Section style={{
                            backgroundColor: '#ffffff',
                            padding: '30px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}>
                            <Text style={{
                                color: '#374151',
                                fontSize: '16px',
                                textAlign: 'center',
                                lineHeight: '1.6',
                                margin: '10px 0 15px 0'
                            }}>
                                물리학은 우주의 언어입니다. 🌌<br/>
                                이 공식들을 통해 자연의 비밀을 함께 풀어보아요!
                            </Text>


                            {/* CTA 버튼 섹션 */}

                            <Text style={{
                                color: '#374151',
                                fontSize: '16px',
                                textAlign: 'center',
                                lineHeight: '1.6',
                                margin: '0 0 25px 0'
                            }}>
                                지금 바로 학습을 시작해보세요! 🚀
                            </Text>


                            <Text style={{
                                color: '#6b7280',
                                fontSize: '14px',
                                textAlign: 'center',
                                margin: '0'
                            }}>
                                궁금한 점이 있으시면 언제든지 문의해주세요! 💬<br/>
                                함께 학습하는 여정을 응원합니다! 📖✨
                            </Text>
                        </Section>


                        <Button
                            className="box-border w-full rounded-[8px] bg-emerald-600 px-[12px] py-[12px] mt-5 text-center font-semibold text-white"
                            href="https://sejongclass.kr"
                        >
                            수강하러 가기
                        </Button>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
