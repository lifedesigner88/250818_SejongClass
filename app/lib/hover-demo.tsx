"use client";

import React from "react";

export default function HoverDemo() {
    return (
        <div className="min-h-screen w-full bg-gray-100 p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-3xl font-bold">Hover Animation Demo</h1>


                {/* 특별 효과 데모 - 호버 애니메이션 */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">✨ 호버 애니메이션 데모</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        {/* 🚀 궁극의 호버 효과 - 스케일 + 회전 + 그림자 + 밝기 통합 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:brightness-110 transition-all duration-300 cursor-pointer">
                            Ultimate Hover
                        </div>

                        {/* 버전 3: 프리미엄 조합 (더 많은 효과) */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-110 hover:-rotate-3 hover:shadow-2xl hover:brightness-110 hover:backdrop-blur-sm transition-all duration-300 transform-gpu cursor-pointer">
                            Premium Mix
                        </div>

                        {/* 호버 밝기 증가 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-105 hover:rotate-3 hover:shadow-2xl hover:brightness-110 transition-all duration-300 ease-in-out cursor-pointer">
                            Perfect Mix
                        </div>

                        {/* 3. 🌟 반짝 효과 - 밝기 + 맥박 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:brightness-125 hover:animate-pulse hover:scale-105 transition-all duration-300 cursor-pointer">
                            Sparkle
                        </div>

                        {/* 4. 🚀 발사 효과 - 위로 올라가며 회전 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:-translate-y-2 hover:rotate-12 hover:shadow-2xl transition-all duration-400 cursor-pointer">
                            Launch Up
                        </div>
                        {/* 1. 🎯 타겟 포커스 - 스케일 + 회전 + 그림자 강화 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-115 hover:rotate-6 hover:shadow-2xl hover:brightness-115 transition-all duration-400 cursor-pointer">
                            Target Focus
                        </div>

                        {/* 2. 🌊 웨이브 플로우 - 스케일 + 위치 이동 + 맥박 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-108 hover:-translate-y-1 hover:animate-pulse hover:shadow-xl transition-all duration-350 cursor-pointer">
                            Wave Flow
                        </div>

                        {/* 3. 🚀 터보 부스트 - 강한 스케일 + 회전 + 발사 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-120 hover:-translate-y-3 hover:rotate-12 hover:brightness-120 transition-all duration-300 cursor-pointer">
                            Turbo Boost
                        </div>

                        {/* 4. 💎 크리스탈 샤인 - 스케일 + 반짝임 + 밝기 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-107 hover:animate-pulse hover:brightness-125 hover:shadow-2xl transition-all duration-450 cursor-pointer">
                            Crystal Shine
                        </div>

                        {/* 5. 🔥 플레임 댄스 - 스케일 + 좌우 흔들림 + 밝기 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-112 hover:skew-x-3 hover:brightness-118 hover:shadow-xl transition-all duration-350 cursor-pointer">
                            Flame Dance
                        </div>

                        {/* 6. ⚡ 일렉트릭 펄스 - 스케일 + 맥박 + 위치 변화 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-106 hover:animate-pulse hover:-translate-y-2 hover:brightness-112 transition-all duration-250 cursor-pointer">
                            Electric Pulse
                        </div>

                        {/* 7. 🌟 스타 버스트 - 강한 발사 + 회전 + 반짝임 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:-translate-y-4 hover:rotate-15 hover:animate-pulse hover:brightness-122 hover:shadow-2xl transition-all duration-500 cursor-pointer">
                            Star Burst
                        </div>

                        {/* 8. 🎭 매직 트랜스폼 - 복합 변환 효과 */}
                        <div
                            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-400 via-violet-500 to-pink-600 shadow-lg text-white text-sm font-medium flex items-center justify-center hover:scale-111 hover:-translate-y-1 hover:rotate-8 hover:brightness-116 hover:shadow-2xl transition-all duration-380 cursor-pointer">
                            Magic Transform
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}