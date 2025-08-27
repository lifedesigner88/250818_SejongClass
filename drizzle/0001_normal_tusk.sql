CREATE TABLE "curriculums" (
	"standard_id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"school_level" varchar(30) NOT NULL,
	"grade_group" smallint NOT NULL,
	"domain_number" smallint NOT NULL,
	"domain_name" varchar(50) NOT NULL,
	"sub_domain_number" smallint,
	"sub_domain_name" varchar(100),
	"achievement_number" smallint NOT NULL,
	"achievement_text" text NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "curriculums_code_unique" UNIQUE("code"),
	CONSTRAINT "grade_group_valid" CHECK ("curriculums"."grade_group" IN (2, 4, 6, 9, 10, 12)),
	CONSTRAINT "domain_number_valid" CHECK ("curriculums"."domain_number" BETWEEN 1 AND 4),
	CONSTRAINT "achievement_number_positive" CHECK ("curriculums"."achievement_number" > 0),
	CONSTRAINT "sort_order_positive" CHECK ("curriculums"."sort_order" > 0)
);
--> statement-breakpoint
CREATE INDEX "idx_curriculum_school_level" ON "curriculums" USING btree ("school_level");--> statement-breakpoint
CREATE INDEX "idx_curriculum_grade_domain" ON "curriculums" USING btree ("grade_group","domain_number");--> statement-breakpoint
CREATE INDEX "idx_curriculum_code" ON "curriculums" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_curriculum_sort_order" ON "curriculums" USING btree ("sort_order");