import React from 'react';
import { Link } from 'react-router';

export default function NotFound() {
    // well-known 요청인 경우 빈 페이지를 렌더링
    if (typeof window !== 'undefined' &&
        window.location.pathname.includes('.well-known')) {
        return null;
    }

    const baseSize = "size-50 text-5xl";
    const baseStyle = "text-white font-medium rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300";

    const handleGoBack = () => {
        window.history.back();
    };

    // 일반 404 페이지 렌더링
    return (
        <div className={"flex flex-col justify-center items-center min-h-screen"}>
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                🔍 페이지를 찾을 수 없습니다 ❗
            </h1>
            
            {/* 404 메인 박스 - 클릭하면 이전 페이지로 */}
            <div className="mb-12">
                <div
                    onClick={handleGoBack}
                    className={`
                        ${baseSize} 
                        ${baseStyle} 
                        bg-gradient-to-br from-red-500 via-red-600 to-rose-700
                        hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:brightness-110
                        hover:shadow-red-500/30 hover:ring-2 hover:ring-red-400/50
                        cursor-pointer
                        relative group
                        border border-red-400/20
                    `}>

                    {/* 기본 상태 - 404 */}
                    <span className="group-hover:opacity-0 transition-opacity duration-300 drop-shadow-lg">
                        404
                    </span>

                    {/* 호버 시 나타나는 내용 */}
                    <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div
                            className="text-center transform group-hover:scale-110 transition-transform duration-300">

                            <div className="text-4xl mb-1 font-bold text-white drop-shadow-lg">
                                Go Back
                            </div>
                            <div className="text-4xl text-white/90 font-semibold drop-shadow-md">
                                ⚠️
                            </div>
                            <div className="text-sm text-white/70 mt-2 drop-shadow-sm">
                                Previous Page
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* 액션 버튼들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* 홈으로 가기 버튼 */}
                <Link to="/">
                    <div
                        className={`
                            ${baseSize} 
                            ${baseStyle} 
                            bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600
                            hover:scale-110 hover:-rotate-3 hover:shadow-2xl hover:brightness-110
                            cursor-pointer
                            relative group
                        `}>
                        
                        {/* 기본 상태 */}
                        <span className="group-hover:opacity-0 transition-opacity duration-300">
                            🏠
                        </span>

                        {/* 호버 시 나타나는 내용 */}
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div
                                className="text-center transform group-hover:scale-110 transition-transform duration-300">

                                <div className="text-4xl mb-1 font-bold text-white">
                                    Home
                                </div>
                                <div className="text-4xl text-white/90 font-semibold">
                                    🏠
                                </div>
                                <div className="text-sm text-white/70 mt-2">
                                    Go Back
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 테마 선택 버튼 */}
                <Link to="/themes">
                    <div
                        className={`
                            ${baseSize} 
                            ${baseStyle} 
                            bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600
                            hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:brightness-115
                            cursor-pointer
                            relative group
                        `}>
                        
                        {/* 기본 상태 */}
                        <span className="group-hover:opacity-0 transition-opacity duration-300">
                            📚
                        </span>

                        {/* 호버 시 나타나는 내용 */}
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div
                                className="text-center transform group-hover:scale-110 transition-transform duration-300">

                                <div className="text-4xl mb-1 font-bold text-white">
                                    Themes
                                </div>
                                <div className="text-4xl text-white/90 font-semibold">
                                    📚
                                </div>
                                <div className="text-sm text-white/70 mt-2">
                                    Explore
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>


        </div>
    );
}
