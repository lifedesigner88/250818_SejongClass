import { Link } from "react-router";
import { CheckCircle2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { myPageEnrollmentsType } from "~/feature/users/pages/profile-page";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type CompletedCourse = NonNullable<myPageEnrollmentsType>[number]

interface CompletedCourseCardProps {
    course: CompletedCourse;
}

export function CompletedCourseCard({ course }: CompletedCourseCardProps) {
    const { textbook } = course;
    const navigationPath = `/${textbook.subject.theme.slug}/${textbook.subject.slug}/${textbook.textbook_id}`;

    return (
        <Link to={navigationPath} className="block">
            <AspectRatio ratio={16 / 9}>
                <Card className="w-full h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                        {/* 상단: 완료 표시와 테마 정보 */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 size={26}/>
                                <span className="text-lg font-bold">완료</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">{textbook.subject.theme.name}.{textbook.subject.name}</p>
                            </div>
                        </div>

                        {/* 중앙: 교재 제목과 과목 정보 */}
                        <div className="flex-1 flex flex-col justify-center text-center">
                            <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                                {textbook.title}
                            </h3>

                        </div>

                        {/* 하단: 평점 정보 */}
                        <div className="flex items-center justify-center gap-1">
                            {course.rating > 0 ? (
                                <>
                                    <Star size={16} className="fill-yellow-400 text-yellow-400"/>
                                    <span className="text-sm font-medium">{course.rating}</span>
                                </>
                            ) : (
                                <span className="text-xs text-muted-foreground">평점 없음</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </AspectRatio>
        </Link>
    );
}


export function CompletedCoursesGrid({ courses }: { courses: myPageEnrollmentsType }) {
    return (
        <div className="max-w-[1080px] m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
                <CompletedCourseCard
                    key={`${course.textbook.textbook_id}-${course.created_at}`}
                    course={course}
                />
            ))}
        </div>
    );
}