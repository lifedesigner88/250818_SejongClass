import { getThemes } from "~/feature/themes/queries";
import { Link } from "react-router";
import type { Route } from "./+types/themes-page";

export const loader = async () => {
    const themes = await getThemes()
    return { themes }
}

export default function ThemesPage({ loaderData }: Route.ComponentProps) {
    const { themes } = loaderData;
    const baseSize = "size-50 text-5xl";
    const baseStyle = "text-white font-medium rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300";

    // slug를 첫글자 대문자로 변환하는 함수
    const capitalizeSlug = (slug: string) => {
        return slug.charAt(0).toUpperCase() + slug.slice(1);
    };

    return (
        <div className={"flex flex-col justify-center items-center min-h-screen"}>
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                🧮 관심있는 테마를 선택해주세요 ⚡
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {themes.map((t) => (
                    t.is_active ? (
                        <Link key={t.themes_id} to={`/theme/${t.slug}`}>
                            <div
                                className={`
                                    ${baseSize} 
                                    ${baseStyle} 
                                    ${t.class_name}
                                    ${t.hover}
                                    cursor-pointer
                                    relative group
                                `}>

                                {/* 기본 상태의 테마 이름 - 호버시 사라짐 */}
                                <span className="group-hover:opacity-0 transition-opacity duration-300">
                                    {t.name}
                                </span>

                                {/* 호버 시 나타나는 내용 */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div
                                        className="text-center transform group-hover:scale-110 transition-transform duration-300">

                                        <div className="text-4xl mb-1 font-bold text-white">
                                            {capitalizeSlug(t.slug)}
                                        </div>
                                        <div className="text-4xl text-white/90 font-semibold">
                                            🚀
                                        </div>
                                        <div className="text-sm text-white/70 mt-2">
                                            Let's Start
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div
                            key={t.themes_id}
                            className={`
                                ${baseSize} 
                                ${baseStyle} 
                                ${t.class_name}
                                ${t.hover}
                                cursor-not-allowed
                                relative group
                            `}>

                            {/* 기본 상태의 테마 이름 - 호버시 사라짐 */}
                            <span className="group-hover:opacity-0 transition-opacity duration-300">
                                {t.name}
                            </span>

                            {/* 호버 시 나타나는 내용 */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div
                                    className="text-center transform group-hover:scale-110 transition-transform duration-300">

                                    <div className="text-4xl mb-1 font-bold text-white">
                                        {capitalizeSlug(t.slug)}
                                    </div>
                                    <div className="text-4xl text-white/90 font-semibold">
                                        🔒
                                    </div>
                                    <div className="text-sm text-white/70 mt-2">
                                        Coming Soon
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}