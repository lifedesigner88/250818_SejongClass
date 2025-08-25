import { check, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { conceptsTable } from "~/feature/concepts/schema";
import { relations, sql } from "drizzle-orm";

export const prerequisitesTable = pgTable("prerequisites", {
        concept_id: integer().references(() => conceptsTable.concept_id, {
            onDelete: "cascade",
        }).notNull(),
        prerequisite_id: integer().references(() => conceptsTable.concept_id, {
            onDelete: "cascade",
        }).notNull(),

        description: varchar({ length: 100 }),
        sort_order: integer().default(1).notNull(),
    },
    (table) => [
        primaryKey({
            name: 'pk_prerequisite_concept',
            columns: [table.concept_id, table.prerequisite_id]
        }),
        check("sort_order_positive", sql`sort_order > 0`),
        check("concept_not_self_prerequisite", sql`concept_id != prerequisite_id`),
    ]
);

export const prerequisitesRelations = relations(prerequisitesTable, ({ one }) => ({

    // 메인 개념 (concept_id) - 선행조건이 필요한 개념
    mainConcept: one(conceptsTable, {
        fields: [prerequisitesTable.concept_id],
        references: [conceptsTable.concept_id],
        relationName: "mainConcept"
    }),

    // 선행조건 개념 (prerequisite_id) - 선행조건이 되는 개념
    prerequisiteConcept: one(conceptsTable, {
        fields: [prerequisitesTable.prerequisite_id],
        references: [conceptsTable.concept_id],
        relationName: "prerequisiteConcept"
    }),

}));
