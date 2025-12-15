import { Button } from "~/common/components/ui/button"
import { Card, CardHeader, CardContent } from "~/common/components/ui/card"
import { Badge } from "~/common/components/ui/badge"
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function HomePage() {

    return (
        <div className="min-h-screen bg-white h-[calc(100vh-64px)] overflow-auto">
            {/* Hero Section - Supabase Inspired */}
            <div className="relative z-10 container mx-auto px-6 pt-13 sm:pt-17 pb-32 text-center">
                {/* Badge */}
                <div className="mb-8">
                    <Badge variant="secondary"
                        className="text-emerald-700 bg-emerald-50 border-emerald-200 px-4 py-2">
                        🚀 새로운 학습 패러다임
                    </Badge>
                </div>

                {/* Main Headline */}
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Code Your <span
                            className="bg-linear-to-r from-red-500 to-orange-300 bg-clip-text text-transparent">Life</span> with
                        <span
                            className="block bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            Math & Physics
                        </span>
                    </h1>

                    <div className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                        수학, 물리, 코딩, 인생
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to="/themes">
                            <Button size="lg"
                                className="text-lg bg-emerald-600 hover:bg-emerald-700 text-white group">
                                Start learning
                                <ArrowRight
                                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Code Demo Card */}
                    <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-800 text-left">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-gray-400 text-sm font-mono">Python Interactive</span>
                            </div>
                        </CardHeader>
                        <CardContent className="font-mono text-sm bg-gray-900">
                            <div className="text-green-400">
                                <div><span className="text-gray-500"># 이차방정식을 시각화해보세요</span></div>
                                <div className="mt-2">
                                    <span className="text-purple-400">import</span>{" "}
                                    <span className="text-yellow-400">numpy</span> <span
                                        className="text-purple-400">as</span> np
                                </div>
                                <div>
                                    <span className="text-purple-400">import</span>{" "}
                                    <span className="text-yellow-400">matplotlib.pyplot</span> <span
                                        className="text-purple-400">as</span> plt
                                </div>
                                <div className="mt-2">
                                    x = np.<span className="text-blue-400">linspace</span>(-10, 10, 100)
                                </div>
                                <div>
                                    y = x**2 - 4*x + 3
                                </div>
                                <div className="mt-2">
                                    plt.<span className="text-blue-400">plot</span>(x, y, <span
                                        className="text-orange-400">'b-'</span>, linewidth=2)
                                </div>
                                <div>
                                    plt.<span className="text-blue-400">grid</span>(<span
                                        className="text-orange-400">True</span>, alpha=0.3)
                                </div>
                                <div>
                                    plt.<span className="text-blue-400">show</span>()
                                </div>
                                <div className="mt-4 text-gray-500">
                                    <span className="text-green-500">✓</span> 실행 완료 - 그래프가 생성되었습니다!
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA Buttons */}
                    <div className={"flex flex-col items-center gap-4 mt-16"}>
                        <Link to="/themes">
                            <Button size="lg"
                                className="text-lg bg-emerald-600 hover:bg-emerald-700 text-white group">
                                Start learning
                                <ArrowRight
                                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <div className="md:hidden items-center space-x-8 mt-15">
                            <a
                                href="https://www.youtube.com/@sejongclass"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Youtube
                            </a>

                            <a
                                href="https://blog.naver.com/lifedesigner88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Blog
                            </a>
                            <a
                                href="https://www.instagram.com/lifedesignersj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Insta
                            </a>
                            <a
                                href="http://github.com/lifedesigner88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Github
                            </a>
                        </div>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <footer className="py-10 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-15">
                        <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
                            <img src="/logo.svg" alt="SejongClass Logo" className="size-6" />
                            <span className="font-semibold text-gray-900">SejongClass</span>
                        </Link>

                        <div className="text-gray-600 text-center md:text-left">
                            © 2025 SejongClass. Code Your Life with Math & Physics.
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
                        <Link
                            to="/privacy-policy"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            개인정보처리방침
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                            to="/terms-of-service"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            이용약관
                        </Link>
                    </div>

                    {/* Mathematical symbols decoration */}
                    <div className="text-center text-3xl text-gray-300 opacity-50">
                        ∫ Σ π dx λ ψ → F=ma · E=mc²
                    </div>

                </div>

            </footer>
        </div>
    )
}