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
import { Badge } from "~/common/components/ui/badge";
import { Progress } from "~/common/components/ui/progress";
import { AspectRatio } from "~/common/components/ui/aspect-ratio";
import { BookOpen, Clock, Star, Users2 } from "lucide-react";
import React from "react";
import { DateTime } from "luxon"
import { getUserIdForSever, useAuthOutletData } from "~/feature/auth/useAuthUtil";

type ThemeWithTextbooks = Awaited<ReturnType<typeof getTextbooksByTheamSlug>>;
type TextbooksType = NonNullable<ThemeWithTextbooks>["subjects"][number]["textbooks"][number];


export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const themeSlug = params['theme-slug'];
    const userId = await getUserIdForSever(request)
    const textbooks = await getTextbooksByTheamSlug(themeSlug, userId!);
    if (!textbooks) throw redirect("/404")
    return { textbooks };
};

export default function SubjectsPage({ loaderData }: Route.ComponentProps) {
    const { textbooks } = loaderData;
    const auth = useAuthOutletData()
    if (!(auth.isLoggedIn && auth.publicUserData)) {
        auth.setPendingUrlAfterLogin(`/theme/${textbooks.slug}`)
        auth.setShowLoginDialog(true)
        return <h1></h1>
    }

    return (
        <div className={"flex flex-col items-center h-[calc(100vh-64px)] overflow-auto"}>
            {/* 과목별 교재 섹션 */}
            <div className=" space-y-10 w-full sm:w-10/12 max-w-[1500px] mt-10 mb-20">
                {textbooks.subjects.map((subject) => (
                    <section key={subject.subject_id} className="relative">
                        {/* 과목 헤더 */}
                        <div className="w-full flex justify-center sm:justify-start">
                            <div className={"flex items-center gap-1"}>
                                <div className="text-3xl">{subject.emoji}</div>
                                <h2 className="text-3xl font-bold text-foreground">
                                    {subject.name}{`  ${subject.textbooks.length}권 `}
                                </h2>
                            </div>
                        </div>

                        {/* 교재 캐러셀 */}
                        {subject.textbooks.length > 0 ? (
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: false,
                                }}
                                className="relative">
                                <CarouselContent className="pt-5 pb-5">
                                    {subject.textbooks.map((textbook) => (
                                        <CarouselItem
                                            key={textbook.textbook_id}
                                            className="basis-1/1 lg:basis-1/2 2xl:basis-1/3">
                                            <TextbookCard
                                                textbook={textbook}
                                                themeSlug={textbooks.slug}
                                                subjectSlug={subject.slug}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* 네비게이션 버튼 */}
                                <CarouselPrevious variant={"default"}
                                                  className={"left-5 -top-5 size-11 sm:top-1/2 sm:-left-12 xl:-left-16 sm:size-10 disabled:opacity-5"}/>
                                <CarouselNext variant={"default"}
                                              className={"right-5 -top-5 size-11 sm:top-1/2 sm:-right-12 xl:-right-16 sm:size-10 disabled:opacity-5"}/>
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
    textbook: TextbooksType,
    themeSlug: string,
    subjectSlug: string
}) {

    const isEnrolled = textbook.enrollments.length > 0;
    const whenEnrolled = isEnrolled ? textbook.enrollments[0].created_at : null;
    const progressValue = isEnrolled ? textbook.enrollments[0].progress_rate : 0;
    const lastStudyDate = isEnrolled ? textbook.enrollments[0].last_study_date : null;

    const estimatedTime = textbook.estimated_hours;
    const enrolledStudents = textbook.enrolled_students;
    const averageRating = textbook.average_rating;

    const isCompleted = progressValue === 100

    // 상태 분류
    const isPublished = textbook.is_published;
    const isNotFree = textbook.price > 0;

    // 클릭 가능 여부 및 링크 결정
    const isClickable = isPublished;

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
            <Link to={`/${themeSlug}/${subjectSlug}/${textbook.textbook_id}`} className="block group">
                {children}
            </Link>
        );
    };

    return (
        <CardContainer>
            {/* 유튜브 썸네일 비율 (16:9) 카드 */}
            <AspectRatio ratio={16 / 9}>
                <Card
                    className={`relative w-full h-full transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/80 overflow-hidden ${
                        isClickable
                            ? 'group-hover:shadow-lg group-hover:scale-[0.98] cursor-pointer'
                            : 'opacity-75 cursor-not-allowed'
                    }`}>

                    {/* 메인 커버 이미지 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500">
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
                            </div>
                        )}
                    </div>

                    {/* 상단 배지들 */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                        {/* 발행 상태 배지 */}
                        {!isPublished && (
                            <Badge variant="secondary" className="text-sm bg-red-500/90 text-white backdrop-blur-sm">
                                준비중
                            </Badge>
                        )}

                        {/* 완료 상태 배지 */}
                        {isCompleted && isPublished && (
                            <Badge className="text-sm bg-yellow-500/90 hover:bg-yellow-600 backdrop-blur-sm">
                                <Star className="w-3 h-3 mr-1 fill-white"/>
                                완료
                            </Badge>
                        )}
                    </div>

                    {/* 가격/무료 배지 */}
                    <div className="absolute top-3 left-3 z-10">
                        {isEnrolled?
                            <Badge variant="default" className="text-sm bg-orange-500/90 text-white backdrop-blur-sm">
                                등록
                            </Badge> :
                        isNotFree ? (
                            <Badge variant="default" className="text-sm bg-green-600/90 text-white backdrop-blur-sm">
                                {(textbook.price / 10000).toFixed(0)}만원
                            </Badge>
                        ) : isPublished ? (
                            <Badge variant="default" className="text-sm bg-blue-600/90 text-white backdrop-blur-sm">
                                무료
                            </Badge>
                        ) : null
                    }

                    </div>

                    {/* 제목 오버레이 (하단) */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 z-10">

                        <div className={"flex justify-between items-center"}>
                        <h3 className={`text-2xl pt-6 pb-2 font-bold leading-tight line-clamp-2 text-white transition-colors ${
                            isClickable ? 'group-hover:text-blue-200' : ''
                        }`}>
                            {textbook.title}
                        </h3>
                        {lastStudyDate && (
                            <div className="flex items-center gap-1 text-white pt-5">
                                {DateTime.fromJSDate(new Date(lastStudyDate)).toRelative({ locale: "ko" })}
                            </div>
                        )}
                        </div>
                        {/* 진도 표시 (발행된 교재만) */}
                        {isPublished && (
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs text-white/90">
                                    <div className="flex items-center gap-1">
                                        <div>
                                            {whenEnrolled
                                                ? whenEnrolled.toLocaleDateString('ko-KR', {
                                                    year: '2-digit',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }).replace(/\. /g, '.').replace(/\.$/, '')
                                                : "미등록"
                                            }
                                        </div>
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

                        {/* 간단한 메타 정보 */}
                        <div
                            className="flex items-center justify-between text-xs text-white/70 mt-3 pt-2 border-t border-white/20">
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3"/>
                                <span>{Number(estimatedTime).toFixed(1)} 시간</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users2 className="w-3 h-3"/>
                                <span>{enrolledStudents} 명 등록 </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/>
                                <span>{Number(averageRating).toFixed(1)}</span>
                            </div>
                        </div>

                    </div>

                    {/* 준비중일 때 전체 오버레이 */}
                    {!isPublished && (
                        <div className="absolute inset-0 bg-gray-500/10 z-10"/>
                    )}
                </Card>
            </AspectRatio>
        </CardContainer>
    );
}