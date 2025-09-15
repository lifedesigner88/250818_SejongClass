import { pgTable, serial, smallint, varchar, text, integer, check, index, pgPolicy } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { unitsTable } from "~/feature/units/schema";
import { checklistsTable } from "~/feature/checklists/schema";


export const curriculumsTable = pgTable("curriculums", {
    curriculum_id: serial().primaryKey(),

    // 성취기준 코드 (예: "2수01-01", "9수02-14")
    code: varchar({ length: 20 }).notNull().unique(),

    // 학교급 정보
    school_level: varchar({ length: 30 }).notNull(), // "초등학교 1∼2학년"
    grade_group: smallint().notNull(), // 2, 4, 6, 9, 10, 12

    // 영역 정보
    domain_number: smallint().notNull(), // 1, 2, 3, 4
    domain_name: varchar({ length: 50 }).notNull(), // "수와 연산", "변화와 관계"

    // 하위 영역 정보 (선택적)
    sub_domain_number: smallint(), // 1, 2, 3... (NULL 가능)
    sub_domain_name: varchar({ length: 100 }), // "네 자리 이하의 수"

    // 성취기준 정보
    achievement_number: smallint().notNull(), // 01, 02, 03...
    achievement_text: text().notNull(), // 성취기준 전체 내용

    // 메타데이터
    sort_order: integer().default(1).notNull(),

    // 외래키
    unit_id: integer().references(() => unitsTable.unit_id, {
        onDelete: "cascade"
    })

}, (table) => [
    // 제약 조건
    check("grade_group_valid", sql`${table.grade_group} IN (2, 4, 6, 9, 10, 12)`),
    check("domain_number_valid", sql`${table.domain_number} BETWEEN 1 AND 4`),
    check("achievement_number_positive", sql`${table.achievement_number} > 0`),
    check("sort_order_positive", sql`${table.sort_order} > 0`),

    // 인덱스
    index("idx_curriculum_school_level").on(table.school_level),
    index("idx_curriculum_grade_domain").on(table.grade_group, table.domain_number),
    index("idx_curriculum_code").on(table.code),
    index("idx_curriculum_sort_order").on(table.sort_order),

    // pgPolicy(`policy-public`, {
    //     for: 'select',
    //     to: 'anon',  // 익명 사용자도 가능
    // }),
    pgPolicy(`policy-select`, {
        for: 'select',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
    }),
    // pgPolicy(`policy-insert`, {
    //     for: 'insert',
    //     to: 'authenticated',
    //     withCheck: sql`auth.uid() = user_id`,
    // }),
    // pgPolicy(`policy-update`, {
    //     for: 'update',
    //     to: 'authenticated',
    //     using: sql`auth.uid() = user_id`,
    //     withCheck: sql`auth.uid() = user_id`,
    // }),
    // pgPolicy(`policy-delete`, {
    //     for: 'delete',
    //     to: 'authenticated',
    //     using: sql`auth.uid() = user_id`,
    // }),
    pgPolicy(`policy-admin-insert`, {
        for: 'insert',
        to: 'authenticated',
        using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    pgPolicy(`policy-admin-update`, {
        for: 'update',
        to: 'authenticated',
        using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    pgPolicy(`policy-admin-delete`, {
        for: 'delete',
        to: 'authenticated',
        using: sql`auth.jwt() ->> 'role' = 'admin'`,
    })
]);

export const curriculumsRelations = relations(curriculumsTable, ({ one, many }) => ({
    units: one(unitsTable, {
        fields: [curriculumsTable.unit_id],
        references: [unitsTable.unit_id],
    }),
    checklists: many(checklistsTable)
}));
