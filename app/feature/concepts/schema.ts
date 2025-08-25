import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { dealingsTable } from "~/feature/dealings/schema";
import { prerequisitesTable } from "~/feature/prerequisites/schema";

export const conceptsTable = pgTable("concepts", {
    concept_id: serial().primaryKey(),

    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull().unique(),
    definition: varchar({ length: 100 }),
    name_eng: varchar({ length: 100 }),

    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
});

export const conceptsRelations = relations(conceptsTable, ({ many }) => ({

    // 이 개념이 다루어지는 강의들
    dealings: many(dealingsTable),

    // 이 개념의 선행조건들 (이 개념이 concept_id로 참조되는)
    prerequisites: many(prerequisitesTable, { relationName: "mainConcept" }),

    // 이 개념을 선행조건으로 갖는 다른 개념들 (이 개념이 prerequisite_id로 참조되는)
    dependentConcepts: many(prerequisitesTable, { relationName: "prerequisiteConcept" }),

}));
