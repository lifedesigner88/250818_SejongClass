import { Button } from "~/common/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/common/components/ui/card"
import { Badge } from "~/common/components/ui/badge"
import { Link } from "react-router";
import { ArrowRight, Zap, Shield, Code, Play, ChevronRight, Github, Youtube, BookOpen } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar - Supabase Style */}
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/app/common/logo.svg" alt="SejongClass Logo" className="size-8"/>
                            <span className="font-bold text-xl text-gray-900">SejongClass</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/themes" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Courses
                            </Link>
                            <Link to="/curriculums" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Docs
                            </Link>
                            <Link to="/monaco-demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Playground
                            </Link>
                            <div className="flex items-center space-x-3">
                                <Button variant="ghost" size="sm">
                                    Sign in
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Start learning
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Supabase Inspired */}
            <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
                {/* Background Grid Pattern */}
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>

                <div className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
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
                            Code Your Life with
                            <span
                                className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                Math & Physics
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                            종이와 연필을 넘어선 새로운 학습 경험. Python으로 수학과 물리를 체험하며
                            코딩 리터러시를 기르세요.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link to="/themes">
                                <Button size="lg"
                                        className="text-lg px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white group">
                                    Start learning
                                    <ArrowRight
                                        className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                                </Button>
                            </Link>
                            <Link to="/monaco-demo">
                                <Button variant="outline" size="lg" className="text-lg px-8 py-4 group">
                                    <Play className="mr-2 h-5 w-5"/>
                                    Try playground
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
                    </div>
                </div>
            </div>

            {/* Features Section - Supabase Cards Style */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            학습의 새로운 패러다임
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            전통적인 종이와 연필 학습을 넘어, 코드를 통해 수학과 물리의 본질을 탐구하세요.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Card
                            className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-emerald-200">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                                    <Code className="h-6 w-6 text-emerald-600"/>
                                </div>
                                <CardTitle className="text-gray-900">Interactive Coding</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-600">
                                    Python으로 수식을 직접 실행하고 결과를 즉시 확인하세요.
                                    브라우저에서 바로 코딩할 수 있습니다.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card
                            className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-200">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                    <Zap className="h-6 w-6 text-blue-600"/>
                                </div>
                                <CardTitle className="text-gray-900">Live Visualization</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-600">
                                    복잡한 수학 함수와 물리 법칙을 실시간 그래프와
                                    시뮬레이션으로 시각화합니다.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card
                            className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-purple-200">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                    <Shield className="h-6 w-6 text-purple-600"/>
                                </div>
                                <CardTitle className="text-gray-900">AI-Powered Learning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-600">
                                    AI가 개인 맞춤형 힌트를 제공하고 학습 과정을
                                    분석하여 최적의 학습 경로를 제안합니다.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Stats Section with Cards */}
            <div className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center border-emerald-200 bg-white/70 backdrop-blur-sm">
                            <CardContent className="pt-8">
                                <div className="text-5xl font-bold text-emerald-600 mb-4">∞</div>
                                <CardTitle className="text-2xl text-gray-900 mb-2">무한한 탐구</CardTitle>
                                <CardDescription className="text-gray-600">
                                    초등수학부터 대학수학까지<br/>체계적인 학습 과정
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-blue-200 bg-white/70 backdrop-blur-sm">
                            <CardContent className="pt-8">
                                <div className="text-5xl font-bold text-blue-600 mb-4">⚡</div>
                                <CardTitle className="text-2xl text-gray-900 mb-2">즉시 실행</CardTitle>
                                <CardDescription className="text-gray-600">
                                    브라우저에서 바로<br/>Python 코딩과 시각화
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-purple-200 bg-white/70 backdrop-blur-sm">
                            <CardContent className="pt-8">
                                <div className="text-5xl font-bold text-purple-600 mb-4">🎯</div>
                                <CardTitle className="text-2xl text-gray-900 mb-2">개인 맞춤</CardTitle>
                                <CardDescription className="text-gray-600">
                                    AI가 분석하는<br/>개인별 학습 데이터
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="py-24 bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-4xl font-bold text-white mb-6">
                        지금 시작해보세요
                    </h3>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        무료로 제공되는 초·중·고 과정부터 시작하여
                        대학수학과 물리학까지 탐구해보세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link to="/themes">
                            <Button size="lg"
                                    className="text-lg px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white group">
                                무료로 시작하기
                                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                            </Button>
                        </Link>
                        <Link to="/monaco-demo">
                            <Button variant="outline" size="lg"
                                    className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-gray-900">
                                Demo 체험하기
                            </Button>
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-6">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Github className="h-6 w-6"/>
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Youtube className="h-6 w-6"/>
                        </a>
                        <Link to="/curriculums" className="text-gray-400 hover:text-white transition-colors">
                            <BookOpen className="h-6 w-6"/>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                        <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div
                                className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-xs">S</span>
                            </div>
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
                        <span className="text-gray-300">|</span>
                        <Link
                            to="/themes"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            강의 안내
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