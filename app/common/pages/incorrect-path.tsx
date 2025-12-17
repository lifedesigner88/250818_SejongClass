import { Link, useNavigate } from 'react-router';

export default function IncorrectPath() {
    const navigate = useNavigate();

    // well-known 요청인 경우 빈 페이지를 렌더링
    if (typeof window !== 'undefined' &&
        window.location.pathname.includes('.well-known')) {
        return null;
    }

    const handleGoBack = () => {
        // 이전 페이지가 있으면 뒤로가기, 없으면 홈으로
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="pb-25 flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            {/* 제목 */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    잘못된 경로입니다
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    요청하신 페이지의 경로가 올바르지 않습니다
                </p>
            </div>

            {/* 메인 에러 표시 */}
            <div className="mb-16">
                <div
                    onClick={handleGoBack}
                    className="w-48 h-48 bg-linear-to-br from-amber-400 via-orange-500 to-red-500
                             text-white font-bold text-6xl rounded-3xl shadow-xl
                             flex items-center justify-center transition-all duration-300
                             hover:scale-105 hover:rotate-1 hover:shadow-2xl
                             hover:shadow-orange-500/30 cursor-pointer group
                             border border-orange-300/20"
                >
                    {/* 기본 상태 */}
                    <span className="group-hover:opacity-0 transition-opacity duration-300 drop-shadow-lg">
                        ⚠️
                    </span>

                    {/* 호버 시 표시 */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
                                  transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                            <div className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                                돌아가기
                            </div>
                            <div className="text-2xl text-white/90">
                                ←
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {/* 홈으로 */}
                <Link to="/" className="group">
                    <div className="h-32 bg-linear-to-br from-blue-500 to-indigo-600
                                  text-white font-semibold rounded-2xl shadow-lg
                                  flex flex-col items-center justify-center transition-all duration-300
                                  hover:scale-105 hover:-rotate-1 hover:shadow-xl
                                  hover:shadow-blue-500/30 cursor-pointer">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                            🏠
                        </div>
                        <span className="text-lg font-medium">홈으로</span>
                    </div>
                </Link>

                {/* 테마 선택 */}
                <Link to="/themes" className="group">
                    <div className="h-32 bg-linear-to-br from-emerald-500 to-teal-600
                                  text-white font-semibold rounded-2xl shadow-lg
                                  flex flex-col items-center justify-center transition-all duration-300
                                  hover:scale-105 hover:rotate-1 hover:shadow-xl
                                  hover:shadow-emerald-500/30 cursor-pointer">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                            📚
                        </div>
                        <span className="text-lg font-medium">테마 선택</span>
                    </div>
                </Link>

            </div>

            {/* 도움말 텍스트 */}
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    URL을 다시 확인하시거나, 위의 버튼을 통해 원하는 페이지로 이동하세요
                </p>
            </div>
        </div>
    );
}