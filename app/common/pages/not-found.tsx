import React from 'react';
import { Link } from 'react-router';

export default function NotFound() {
    // well-known 요청인 경우 빈 페이지를 렌더링
    if (typeof window !== 'undefined' &&
        window.location.pathname.includes('.well-known')) {
        return null;
    }

    // 일반 404 페이지 렌더링
    return (
        <div className="container mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
            <p className="mb-6">요청하신 페이지가 존재하지 않습니다.</p>
            <Link to="/" className="text-blue-500 hover:underline">
                홈으로 돌아가기
            </Link>
        </div>
    );
}
