import type { Route } from "./+types/calculate-textbook";
import db from "~/db";
import { textbooksTable } from "~/feature/textbooks/schema";
import { eq, lt, sql } from "drizzle-orm";
import { notificationsTable } from "#app/feature/notifications/schema.js";


// 텍스트북 실제 데이터 계산 함수
const calculateTextbooksRealInfo = (textbooksRealInfo: any[]) => {
    return textbooksRealInfo.map(textbook => {

        // 1. estimated_hours 계산: 모든 units의 estimated_seconds를 더해서 시간으로 변환 (decimal 2,1)
        let totalSeconds = 0;
        textbook.majors?.forEach((major: any) => {
            major.middles?.forEach((middle: any) => {
                middle.units?.forEach((unit: any) => {
                    if (unit.estimated_seconds) {
                        totalSeconds += unit.estimated_seconds;
                    }
                });
            });
        });
        const estimated_hours = Number((totalSeconds / 3600).toFixed(1));

        // 2. average_rating 계산: 0을 제외한 rating 값들의 평균 (decimal 2,1)
        const validRatings = textbook.enrollments
            ?.map((enrollment: any) => enrollment.rating)
            ?.filter((rating: number) => rating && rating > 0) || [];

        const average_rating = validRatings.length > 0
            ? Number((validRatings.reduce((sum: number, rating: number) => sum + rating, 0) / validRatings.length).toFixed(1))
            : 0.0;

        // 3. enrolled_students 계산: enrollments 배열의 길이 (smallint - 정수)
        const enrolled_students = textbook.enrollments?.length || 0;

        return {
            textbook_id: textbook.textbook_id,
            estimated_hours,
            average_rating,
            enrolled_students
        };
    });
};


export const action = async ({ request }: Route.LoaderArgs) => {
    console.time("calculate-textbook Cron Job🔥");

    if (request.method !== "POST") return new Response(null, { status: 404 })
    const header = request.headers.get("X-SEJONG")
    const secretKey = process.env.SEJONG_SECRET_KEY
    if (!header || header !== secretKey) return new Response(null, { status: 404 })

    try {
        // 여기서 실제 DB 조회를 수행
        const textbooksRealInfo = await db.query.textbooksTable.findMany({
            columns: {
                textbook_id: true,
                estimated_hours: true,
                average_rating: true,
                enrolled_students: true,
            },
            with: {
                enrollments: {
                    columns: {
                        rating: true,
                    }
                },
                majors: {
                    columns: {
                        major_id: false,
                        textbook_id: false,
                        title: false,
                        sort_order: false,
                        is_published: false,
                    },
                    with: {
                        middles: {
                            columns: {
                                middle_id: false,
                                major_id: false,
                                title: false,
                                sort_order: false,
                                is_published: false,
                            },
                            with: {
                                units: {
                                    columns: {
                                        estimated_seconds: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // 실제 데이터 계산
        const calculatedData = calculateTextbooksRealInfo(textbooksRealInfo);

        // DB 업데이트 부분 (트랜잭션 사용)
        await db.transaction(async (tx) => {
            for (const textbook of calculatedData) {
                await tx.update(textbooksTable)
                    .set({
                        estimated_hours: textbook.estimated_hours.toString(), // decimal 타입이므로 문자열로 변환
                        average_rating: textbook.average_rating.toString(), // decimal 타입이므로 문자열로 변환
                        enrolled_students: textbook.enrolled_students // smallint 타입이므로 정수 그대로
                    })
                    .where(eq(textbooksTable.textbook_id, textbook.textbook_id));
            }
        });
        console.timeEnd("calculate-textbook Cron Job🔥");


        console.time("delete 7 days Notification Cron Job🔥");
        await db.delete(notificationsTable)
            .where(
                lt(notificationsTable.created_at, sql`NOW() - INTERVAL '7 days'`)
            );
        console.timeEnd("delete 7 days Notification Cron Job🔥");


        return { message: "ok", updatedCount: calculatedData.length };

    } catch (error) {
        console.error("텍스트북 계산 중 오류:", error);
        return Response.json({
            message: "error",
            error: error instanceof Error ? error.message : "알 수 없는 오류"
        }, { status: 500 });
    }

};
