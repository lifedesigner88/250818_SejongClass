import db from "~/db";
import { eq, and, asc, desc } from "drizzle-orm";
import { curriculumsTable } from "./schema";

// 모든 성취기준 조회
export async function getAllcurriculumsTable() {
    return db.select()
        .from(curriculumsTable)
        .where(eq(curriculumsTable.is_active, true))
        .orderBy(asc(curriculumsTable.sort_order));
}

// 학교급별 성취기준 조회
export async function getcurriculumsTableBySchoolLevel(schoolLevel: string) {
    return db.select()
        .from(curriculumsTable)
        .where(
            and(
                eq(curriculumsTable.school_level, schoolLevel),
                eq(curriculumsTable.is_active, true)
            )
        )
        .orderBy(
            asc(curriculumsTable.domain_number),
            asc(curriculumsTable.sub_domain_number),
            asc(curriculumsTable.achievement_number)
        );
}

// 학년군과 영역으로 성취기준 조회
export async function getcurriculumsTableByGradeAndDomain(
    gradeGroup: number,
    domainNumber: number
) {
    return db.select()
        .from(curriculumsTable)
        .where(
            and(
                eq(curriculumsTable.grade_group, gradeGroup),
                eq(curriculumsTable.domain_number, domainNumber),
                eq(curriculumsTable.is_active, true)
            )
        )
        .orderBy(
            asc(curriculumsTable.sub_domain_number),
            asc(curriculumsTable.achievement_number)
        );
}

// 코드로 특정 성취기준 조회
export async function getCurriculumStandardByCode(code: string) {
    return db.query.curriculumsTable.findFirst({
        where: eq(curriculumsTable.code, code),
    });
}

// 학교급별 영역 목록 조회
export async function getDomainsBySchoolLevel(schoolLevel: string) {
    return db.selectDistinct({
        domain_number: curriculumsTable.domain_number,
        domain_name: curriculumsTable.domain_name,
    })
        .from(curriculumsTable)
        .where(
            and(
                eq(curriculumsTable.school_level, schoolLevel),
                eq(curriculumsTable.is_active, true)
            )
        )
        .orderBy(asc(curriculumsTable.domain_number));
}

// 특정 영역의 하위 영역 목록 조회
export async function getSubDomainsByDomain(
    gradeGroup: number,
    domainNumber: number
) {
    return db.selectDistinct({
        sub_domain_number: curriculumsTable.sub_domain_number,
        sub_domain_name: curriculumsTable.sub_domain_name,
    })
        .from(curriculumsTable)
        .where(
            and(
                eq(curriculumsTable.grade_group, gradeGroup),
                eq(curriculumsTable.domain_number, domainNumber),
                eq(curriculumsTable.is_active, true)
            )
        )
        .orderBy(asc(curriculumsTable.sub_domain_number));
}

// 성취기준과 연결된 개념들 조회 (관계 테이블 사용)
export async function getcurriculumsTableWithConcepts() {
    return db.query.curriculumsTable.findMany({
        where: eq(curriculumsTable.is_active, true),
        with: {
            conceptMappings: {
                with: {
                    concept: {
                        columns: {
                            concept_id: true,
                            name: true,
                            slug: true,
                            definition: true,
                        }
                    }
                }
            }
        },
        orderBy: [asc(curriculumsTable.sort_order)],
    });
}