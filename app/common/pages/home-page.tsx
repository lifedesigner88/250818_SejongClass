
import { Button } from "~/common/components/ui/button"
import { Link } from "react-router";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Hero Section */}
            <div className="relative">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-6 py-20 text-center text-white">
                    {/* Brand Logo */}
                    <div className="mb-15">
                        <h1 className="text-6xl font-bold mb-4">
                            <span className="text-white">Sejong</span>
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Class</span>
                        </h1>
                        <p className="text-xl text-blue-200 font-medium">
                            Code Your Life with Math & Physics
                        </p>
                    </div>


                    {/* Demo Preview */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-black/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                            <div className="bg-gray-900/90 rounded-xl p-6 font-mono text-left">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-4 text-gray-400 text-sm">Python Interactive Editor</span>
                                </div>
                                <div className="text-green-400">
                                    <div><span className="text-blue-400"># 이차방정식의 해를 구해보세요</span></div>
                                    <div><span className="text-purple-400">import</span> <span className="text-yellow-400">math</span></div>
                                    <div className="mt-2"></div>
                                    <div><span className="text-purple-400">def</span> <span className="text-blue-300">quadratic_formula</span>(a, b, c):</div>
                                    <div className="ml-4"><span className="text-gray-400">discriminant = b**2 - 4*a*c</span></div>
                                    <div className="ml-4"><span className="text-purple-400">if</span> {"discriminant >= 0:"}</div>
                                    <div className="ml-8"><span className="text-gray-400">x1 = (-b + math.sqrt(discriminant)) / (2*a)</span></div>
                                    <div className="ml-8"><span className="text-gray-400">x2 = (-b - math.sqrt(discriminant)) / (2*a)</span></div>
                                    <div className="ml-8"><span className="text-purple-400">return</span> x1, x2</div>
                                    <div className="mt-2"></div>
                                    <div><span className="text-gray-400"># 결과: (3.0, 2.0)</span></div>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Main Tagline */}
                    <div className="max-w-4xl mx-auto mb-10">
                        <h2 className="text-3xl md:text-4xl mt-12 font-bold mb-4 leading-tight">
                            종이, 연필 ❌
                        </h2>
                        <p className="mb-3 text-2xl text-gray-300 leading-relaxed">
                            수학과 물리를 배우며 기르는
                        </p>
                        <strong className="text-3xl text-blue-300 mt-3">코딩 리터러시</strong>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Link to="/themes">
                            <Button size="lg" className="cursor-pointer text-xl px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                                📚 강의 둘러보기
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                <div className="container mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center text-white mb-16">
                        왜 <span className="text-blue-400">SejongClass</span>인가요?
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-4xl mb-4">🧮</div>
                            <h4 className="text-xl font-bold text-white mb-4">수식이 코드로, 코드가 그림으로</h4>
                            <p className="text-gray-300">
                                미분/적분/행렬/확률을 <code className="bg-blue-900/50 px-2 py-1 rounded text-blue-200">Python</code>으로
                                직접 실행하고, 그래프로 즉시 확인합니다.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-4xl mb-4">⚡</div>
                            <h4 className="text-xl font-bold text-white mb-4">시뮬레이션으로 체감하는 법칙</h4>
                            <p className="text-gray-300">
                                뉴턴 역학·포물선 운동·진동·파동 방정식을
                                <strong className="text-purple-300"> 상호작용</strong>으로 탐구합니다.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-4xl mb-4">🤖</div>
                            <h4 className="text-xl font-bold text-white mb-4">AI와 함께 하는 탐구</h4>
                            <p className="text-gray-300">
                                맞춤형 힌트·설명·오류 디버깅까지,
                                <strong className="text-green-300">질문→실험→통찰</strong> 루프를 가속합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold text-blue-400 mb-2">∫</div>
                            <h4 className="text-2xl font-bold mb-2">수학 개념</h4>
                            <p className="text-gray-300">초등부터 대학수학까지</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-400 mb-2">⚛️</div>
                            <h4 className="text-2xl font-bold mb-2">물리 법칙</h4>
                            <p className="text-gray-300">역학부터 현대물리까지</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">💻</div>
                            <h4 className="text-2xl font-bold mb-2">코딩 실력</h4>
                            <p className="text-gray-300">Python 기초부터 시각화까지</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="py-20 text-center">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-bold text-white mb-8">
                        준비되셨나요? 지금 바로 시작해보세요! 🚀
                    </h3>
                    <Link to="/monaco-demo">
                        <Button size="lg" className="cursor-pointer text-xl px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                            Python 에디터 체험하기
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer - 개인정보처리방침 링크 추가 */}
            <div className="py-8 border-t border-blue-500/20">
                <div className="container mx-auto px-6">
                    <div className="text-center text-gray-400 space-y-4">
                        <p>© 2025 SejongClass — Code Your Life with Math & Physics</p>

                        {/* 법적 링크들 */}
                        <div className="flex justify-center gap-6 text-sm">
                            <Link
                                to="/privacy-policy"
                                className="hover:text-blue-400 transition-colors"
                            >
                                개인정보처리방침
                            </Link>
                            <span>|</span>
                            <Link
                                to="/terms-of-service"
                                className="hover:text-blue-400 transition-colors"
                            >
                                이용약관
                            </Link>
                        </div>

                        <div className="text-2xl opacity-30">
                            ∫ Σ π dx λ ψ → F=ma · E=mc²
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}