CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "concepts" (
	"concept_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"definition" varchar(100),
	"name_eng" varchar(100),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "concepts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
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
	"units_id" integer,
	CONSTRAINT "curriculums_code_unique" UNIQUE("code"),
	CONSTRAINT "grade_group_valid" CHECK ("curriculums"."grade_group" IN (2, 4, 6, 9, 10, 12)),
	CONSTRAINT "domain_number_valid" CHECK ("curriculums"."domain_number" BETWEEN 1 AND 4),
	CONSTRAINT "achievement_number_positive" CHECK ("curriculums"."achievement_number" > 0),
	CONSTRAINT "sort_order_positive" CHECK ("curriculums"."sort_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "dealings" (
	"unit_id" integer NOT NULL,
	"concept_id" integer NOT NULL,
	"discription" varchar(100) NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "pk_dealings_unit_concept" PRIMARY KEY("unit_id","concept_id"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0)
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"user_id" uuid NOT NULL,
	"textbook_id" integer NOT NULL,
	"progress_rate" smallint DEFAULT 0 NOT NULL,
	"payment_status" boolean DEFAULT false NOT NULL,
	"review" varchar(500),
	"rating" smallint DEFAULT 10,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pk_enrollment_user_textbook" PRIMARY KEY("user_id","textbook_id"),
	CONSTRAINT "completion_percentage_range" CHECK (progress_rate BETWEEN 0 AND 100),
	CONSTRAINT "rating_range" CHECK (rating >= 1 and rating <= 10)
);
--> statement-breakpoint
CREATE TABLE "majors" (
	"major_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"textbook_id" integer NOT NULL,
	CONSTRAINT "majors_title_unique" UNIQUE("title"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0)
);
--> statement-breakpoint
CREATE TABLE "masters" (
	"user_id" uuid NOT NULL,
	"concept_id" integer NOT NULL,
	"master_rate" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "pk_master_user_concept" PRIMARY KEY("user_id","concept_id"),
	CONSTRAINT "master_rate_positive" CHECK (master_rate BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE "middles" (
	"middle_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"major_id" integer NOT NULL,
	CONSTRAINT "sort_order_positive" CHECK (sort_order >= 0)
);
--> statement-breakpoint
CREATE TABLE "prerequisites" (
	"concept_id" integer NOT NULL,
	"prerequisite_id" integer NOT NULL,
	"description" varchar(100),
	"sort_order" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "pk_prerequisite_concept" PRIMARY KEY("concept_id","prerequisite_id"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0),
	CONSTRAINT "concept_not_self_prerequisite" CHECK (concept_id != prerequisite_id)
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"user_id" uuid NOT NULL,
	"unit_id" integer NOT NULL,
	"completion_status" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pk_progress_user_unit" PRIMARY KEY("user_id","unit_id")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"subject_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 1 NOT NULL,
	"emoji" varchar(100) NOT NULL,
	"themes_id" integer NOT NULL,
	CONSTRAINT "subjects_name_unique" UNIQUE("name"),
	CONSTRAINT "subjects_slug_unique" UNIQUE("slug"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0)
);
--> statement-breakpoint
CREATE TABLE "supportives" (
	"concept_id" integer NOT NULL,
	"supportive_id" integer NOT NULL,
	"description" varchar(100),
	"sort_order" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "pk_supportive_concept" PRIMARY KEY("concept_id","supportive_id"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0),
	CONSTRAINT "concept_not_self_supportive" CHECK (concept_id != supportive_id)
);
--> statement-breakpoint
CREATE TABLE "textbooks" (
	"textbook_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"cover_image_url" varchar(500),
	"subjects_id" integer NOT NULL,
	CONSTRAINT "textbooks_title_unique" UNIQUE("title"),
	CONSTRAINT "textbooks_slug_unique" UNIQUE("slug"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0),
	CONSTRAINT "price_positive" CHECK (price >= 0)
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"themes_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 1 NOT NULL,
	"class_name" varchar(200) NOT NULL,
	"hover" varchar(200) NOT NULL,
	CONSTRAINT "themes_name_unique" UNIQUE("name"),
	CONSTRAINT "themes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0)
);
--> statement-breakpoint
CREATE TABLE "units" (
	"unit_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"youtube_video_id" varchar(20),
	"readme_content" varchar(4000),
	"estimated_duration" integer,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"middle_chapter_id" integer NOT NULL,
	CONSTRAINT "sort_order_positive" CHECK (sort_order > 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"nickname" varchar(100),
	"profile_url" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_units_id_units_unit_id_fk" FOREIGN KEY ("units_id") REFERENCES "public"."units"("unit_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dealings" ADD CONSTRAINT "dealings_unit_id_units_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("unit_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dealings" ADD CONSTRAINT "dealings_concept_id_concepts_concept_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("concept_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_textbook_id_textbooks_textbook_id_fk" FOREIGN KEY ("textbook_id") REFERENCES "public"."textbooks"("textbook_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "majors" ADD CONSTRAINT "majors_textbook_id_textbooks_textbook_id_fk" FOREIGN KEY ("textbook_id") REFERENCES "public"."textbooks"("textbook_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masters" ADD CONSTRAINT "masters_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masters" ADD CONSTRAINT "masters_concept_id_concepts_concept_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("concept_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "middles" ADD CONSTRAINT "middles_major_id_majors_major_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("major_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_concept_id_concepts_concept_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("concept_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_prerequisite_id_concepts_concept_id_fk" FOREIGN KEY ("prerequisite_id") REFERENCES "public"."concepts"("concept_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_unit_id_units_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("unit_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_themes_id_themes_themes_id_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("themes_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportives" ADD CONSTRAINT "supportives_concept_id_concepts_concept_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("concept_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportives" ADD CONSTRAINT "supportives_supportive_id_concepts_concept_id_fk" FOREIGN KEY ("supportive_id") REFERENCES "public"."concepts"("concept_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "textbooks" ADD CONSTRAINT "textbooks_subjects_id_subjects_subject_id_fk" FOREIGN KEY ("subjects_id") REFERENCES "public"."subjects"("subject_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_middle_chapter_id_middles_middle_id_fk" FOREIGN KEY ("middle_chapter_id") REFERENCES "public"."middles"("middle_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_curriculum_school_level" ON "curriculums" USING btree ("school_level");--> statement-breakpoint
CREATE INDEX "idx_curriculum_grade_domain" ON "curriculums" USING btree ("grade_group","domain_number");--> statement-breakpoint
CREATE INDEX "idx_curriculum_code" ON "curriculums" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_curriculum_sort_order" ON "curriculums" USING btree ("sort_order");