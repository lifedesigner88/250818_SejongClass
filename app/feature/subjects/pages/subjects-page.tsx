import type { Route } from "./+types/subjects-page";
import { getTextbooksByTheamSlug } from "~/feature/subjects/queries";
import { redirect, Link } from "react-router";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/common/components/ui/carousel";
import { Card } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Badge } from "~/common/components/ui/badge";
import { Progress } from "~/common/components/ui/progress";
import { BookOpen, Clock, DollarSign, Star, TrendingUp, PlayCircle, Lock, ShoppingCart } from "lucide-react";
import React from "react";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const themeSlug = params['theme-slug'];

    const textbooks = await getTextbooksByTheamSlug(themeSlug);
    if (!textbooks) throw redirect("/404")

    return { textbooks };
};

export default function SubjectsPage({ loaderData }: Route.ComponentProps) {
    const { textbooks } = loaderData;

    return (
        <div className="container mx-auto py-10 px-2">
            {/* 과목별 교재 섹션 */}
            <div className="space-y-10">
                {textbooks.subjects.map((subject) => (
                    <section key={subject.subject_id} className="relative">
                        {/* 과목 헤더 */}
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">{subject.emoji}</div>
                            <h2 className="text-3xl font-bold text-foreground">
                                {subject.name} {`( ${subject.textbooks.length} )`}
                            </h2>
                        </div>

                        {/* 교재 캐러셀 */}
                        {subject.textbooks.length > 0 ? (
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: false,
                                }}
                                className="relative"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4 pt-5 pb-5">
                                    {subject.textbooks.map((textbook) => (
                                        <CarouselItem
                                            key={textbook.textbook_id}
                                            className="basis-1/1 md:basis-1/2 lg:basis-1/3"
                                        >
                                            <TextbookCard
                                                textbook={textbook}
                                                themeSlug={textbooks.slug}
                                                subjectSlug={subject.slug}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* 네비게이션 버튼 */}
                                <CarouselPrevious variant={"default"} />
                                <CarouselNext variant={"default"} />
                            </Carousel>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                <p className="text-lg">아직 준비된 교재가 없습니다</p>
                                <p className="text-sm">곧 흥미진진한 콘텐츠가 업데이트될 예정입니다!</p>
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}

// 도서 비율을 유지하는 컴팩트한 교재 카드
function TextbookCard({
                          textbook,
                          themeSlug,
                          subjectSlug
                      }: {
    textbook: any,
    themeSlug: string,
    subjectSlug: string
}) {
    // 임의의 진도율 생성 (교재 ID를 기반으로 일관된 값 생성)
    const progressValue = ((textbook.textbook_id * 23) % 100);
    const isStarted = progressValue > 0;
    const isCompleted = progressValue === 100 || progressValue > 95;

    // 상태 분류
    const isPublished = textbook.is_published;
    const isPaid = textbook.price > 0;

    // 클릭 가능 여부 및 링크 결정
    const isClickable = isPublished;
    const linkTo = isPaid
        ? `/payment/textbook/${textbook.textbook_id}`
        : `/theme/${themeSlug}/${subjectSlug}/${textbook.textbook_id}`;

    // 카드 컨테이너
    const CardContainer = ({ children }: { children: React.ReactNode }) => {
        if (!isClickable) {
            return (
                <div className="block group relative">
                    {children}
                </div>
            );
        }

        return (
            <Link to={linkTo} className="block group">
                {children}
            </Link>
        );
    };

    return (
        <CardContainer>
            {/* 황금비율 가로형 카드 (1.618:1) - 가로가 긴 비율 */}
            <Card
                className={`relative aspect-[1.618/1] transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/80 overflow-hidden ${
                    isClickable
                        ? 'group-hover:shadow-lg group-hover:scale-[0.98] cursor-pointer'
                        : 'opacity-75 cursor-not-allowed'
                }`}>
                {/* 메인 커버 이미지 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600">
                    {textbook.cover_image_url ? (
                        <img
                            src={textbook.cover_image_url}
                            alt={textbook.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                                isClickable ? 'group-hover:scale-110' : ''
                            }`}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">
                            <BookOpen className="w-16 h-16 opacity-80"/>
                        </div>
                    )}
                </div>

                {/* 상단 배지들 */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                    {/* 발행 상태 배지 */}
                    {!isPublished && (
                        <Badge variant="secondary" className="text-xs bg-red-500/90 text-white backdrop-blur-sm">
                            준비중
                        </Badge>
                    )}

                    {/* 완료 상태 배지 */}
                    {isCompleted && isPublished && (
                        <Badge className="text-xs bg-yellow-500/90 hover:bg-yellow-600 backdrop-blur-sm">
                            <Star className="w-3 h-3 mr-1 fill-white"/>
                            완료
                        </Badge>
                    )}
                </div>

                {/* 가격/무료 배지 */}
                <div className="absolute top-3 left-3 z-10">
                    {isPaid ? (
                        <Badge variant="default" className="text-xs bg-green-600/90 text-white backdrop-blur-sm">
                            <DollarSign className="w-3 h-3 mr-1"/>
                            {(textbook.price / 10000).toFixed(0)}만원
                        </Badge>
                    ) : isPublished ? (
                        <Badge variant="default" className="text-xs bg-blue-600/90 text-white backdrop-blur-sm">
                            무료
                        </Badge>
                    ) : null}
                </div>

                {/* 제목 오버레이 (하단) */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 z-10">
                    <h3 className={`text-base font-bold leading-tight line-clamp-2 text-white transition-colors ${
                        isClickable ? 'group-hover:text-blue-200' : ''
                    }`}>
                        {textbook.title}
                    </h3>

                    {/* 진도 표시 (발행된 교재만) */}
                    {isPublished && isStarted && (
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs text-white/90">
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3"/>
                                    <span>진도</span>
                                </div>
                                <span className="font-medium">{progressValue}%</span>
                            </div>
                            <Progress value={progressValue} className="h-1.5 bg-white/20"/>
                            {isCompleted && (
                                <div className="text-xs text-yellow-300 font-medium">
                                    🎉 완료!
                                </div>
                            )}
                        </div>
                    )}

                    {/* 상태별 정보 표시 */}
                    {!isPublished ? (
                        <div className="flex items-center gap-1 text-xs text-white/80 mt-2">
                            <Lock className="w-3 h-3"/>
                            <span>출시 예정</span>
                        </div>
                    ) : !isStarted ? (
                        <div className="flex items-center gap-1 text-xs text-white/80 mt-2">
                            {isPaid ? (
                                <>
                                    <ShoppingCart className="w-3 h-3"/>
                                    <span>구매 후 이용</span>
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="w-3 h-3"/>
                                    <span>시작 대기</span>
                                </>
                            )}
                        </div>
                    ) : null}

                    {/* 간단한 메타 정보 */}
                    <div
                        className="flex items-center justify-between text-xs text-white/70 mt-3 pt-2 border-t border-white/20">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3"/>
                            <span>4주</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/>
                            <span>4.8</span>
                        </div>
                    </div>
                </div>

                {/* 호버 오버레이 & 액션 버튼 */}
                <div
                    className={`absolute inset-0 bg-black/0 transition-colors duration-300 flex flex-col items-center justify-center z-20 ${
                        isClickable ? 'group-hover:bg-black/30' : ''
                    }`}>
                    {!isPublished ? (
                        /* 잠금 아이콘 (준비중일 때) */
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 rounded-full p-4 backdrop-blur-sm">
                            <Lock className="w-10 h-10 text-white"/>
                        </div>
                    ) : (
                        /* 액션 버튼 (호버 시 표시) */
                        <Button
                            size="sm"
                            className={`opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm px-6 py-3 backdrop-blur-sm ${
                                isPaid
                                    ? 'bg-green-600/90 hover:bg-green-700 text-white'
                                    : 'bg-blue-600/90 hover:bg-blue-700 text-white'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isPaid ? (
                                <>
                                    <ShoppingCart className="w-4 h-4 mr-2"/>
                                    구매하기
                                </>
                            ) : isCompleted ? (
                                "복습하기"
                            ) : isStarted ? (
                                "계속하기"
                            ) : (
                                <>
                                    <PlayCircle className="w-4 h-4 mr-2"/>
                                    시작하기
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* 준비중일 때 전체 오버레이 */}
                {!isPublished && (
                    <div className="absolute inset-0 bg-gray-500/10 z-10"/>
                )}
            </Card>
        </CardContainer>
    );
}