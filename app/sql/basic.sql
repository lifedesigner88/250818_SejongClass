-- 기본 테이블들 (의존성 없는 테이블들)
CREATE TABLE "users" (
                         "user_id" UUID NOT NULL,
                         "email" VARCHAR(255) NOT NULL,
                         "username" VARCHAR(100) NOT NULL,
                         "password_hash" VARCHAR(255) NOT NULL,
                         "role" VARCHAR(20) NOT NULL,
                         "profile_image_url" TEXT,
                         "created_at" TIMESTAMP,
                         "updated_at" TIMESTAMP,
                         CONSTRAINT "PK_USERS" PRIMARY KEY ("user_id")
);
CREATE TABLE "themes" (
                          "themes_id" serial PRIMARY KEY NOT NULL,
                          "name" varchar(100) NOT NULL,
                          "slug" varchar(100) NOT NULL,
                          "is_active" boolean DEFAULT true NOT NULL,
                          "sort_order" smallint NOT NULL,
                          "icon_url" varchar(200)
);

--> sta
CREATE TABLE "subjects" (
                            "subjects" serial PRIMARY KEY NOT NULL,
                            "name" varchar(100) NOT NULL,
                            "slug" varchar(100) NOT NULL,
                            "is_active" boolean DEFAULT true NOT NULL,
                            "sort_order" smallint NOT NULL,
                            "icon_url" varchar(200),
                            "themes_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_themes_id_themes_themes_id_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("themes_id") ON DELETE cascade ON UPDATE cascade;

CREATE TABLE "concepts" (
                            "concept_id" SERIAL NOT NULL,
                            "name" VARCHAR(200) NOT NULL,
                            "slug" VARCHAR(200) NOT NULL,
                            "description" TEXT,
                            "definition" TEXT,
                            "difficulty_level" INTEGER,
                            "tags" JSONB DEFAULT '{}',
                            "created_at" TIMESTAMP,
                            "updated_at" TIMESTAMP,
                            CONSTRAINT "PK_CONCEPTS" PRIMARY KEY ("concept_id")
);

);

-- subjects에 의존하는 테이블
CREATE TABLE "textbooks" (
                             "textbook_id" SMALLSERIAL NOT NULL,
                             "title" VARCHAR(200) NOT NULL,
                             "slug" VARCHAR(200) NOT NULL,
                             "description" TEXT,
                             "grade_level" VARCHAR(50),
                             "semester" VARCHAR(10),
                             "price" INTEGER NOT NULL DEFAULT 0,
                             "cover_image_url" TEXT,
                             "is_published" BOOLEAN,
                             "sort_order" INTEGER NOT NULL,
                             "created_at" TIMESTAMP,
                             "updated_at" TIMESTAMP,
                             "subjects_id" SMALLINT NOT NULL,
                             CONSTRAINT "PK_TEXTBOOKS" PRIMARY KEY ("textbook_id"),
                             CONSTRAINT "FK_TEXTBOOKS_SUBJECTS" FOREIGN KEY ("subjects_id") REFERENCES "subjects" ("subjects_id")
);

-- textbooks에 의존하는 테이블
CREATE TABLE "major_chapters" (
                                  "major_chapter_id" SMALLSERIAL NOT NULL,
                                  "textbook_id" SMALLINT NOT NULL,
                                  "title" VARCHAR(200) NOT NULL,
                                  "sort_order" INTEGER,
                                  "created_at" TIMESTAMP,
                                  CONSTRAINT "PK_MAJOR_CHAPTERS" PRIMARY KEY ("major_chapter_id"),
                                  CONSTRAINT "FK_MAJOR_CHAPTERS_TEXTBOOKS" FOREIGN KEY ("textbook_id") REFERENCES "textbooks" ("textbook_id")
);

-- major_chapters에 의존하는 테이블
CREATE TABLE "middle_chapters" (
                                   "middle_chapter_id" SMALLSERIAL NOT NULL,
                                   "major_chapter_id" SMALLINT NOT NULL,
                                   "title" VARCHAR(200) NOT NULL,
                                   "sort_order" INTEGER,
                                   "created_at" TIMESTAMP,
                                   CONSTRAINT "PK_MIDDLE_CHAPTERS" PRIMARY KEY ("middle_chapter_id"),
                                   CONSTRAINT "FK_MIDDLE_CHAPTERS_MAJOR" FOREIGN KEY ("major_chapter_id") REFERENCES "major_chapters" ("major_chapter_id")
);

-- middle_chapters에 의존하는 테이블
CREATE TABLE "units" (
                         "unit_id" SERIAL NOT NULL,
                         "title" VARCHAR(300) NOT NULL,
                         "slug" VARCHAR(300) NOT NULL,
                         "youtube_video_id" VARCHAR(20),
                         "readme_content" TEXT,
                         "estimated_duration" INTEGER,
                         "sort_order" INTEGER NOT NULL,
                         "is_published" BOOLEAN,
                         "created_at" TIMESTAMP,
                         "updated_at" TIMESTAMP,
                         "middle_chapter_id" SMALLINT NOT NULL,
                         CONSTRAINT "PK_UNITS" PRIMARY KEY ("unit_id"),
                         CONSTRAINT "FK_UNITS_MIDDLE_CHAPTERS" FOREIGN KEY ("middle_chapter_id") REFERENCES "middle_chapters" ("middle_chapter_id")
);

-- concepts 자기 참조 테이블들
CREATE TABLE "concept_supportives" (
                                       "concept_id" INTEGER NOT NULL,
                                       "supportives_id" INTEGER NOT NULL,
                                       "description" VARCHAR(255),
                                       "importance_level" INTEGER DEFAULT 1,
                                       "created_at" TIMESTAMP,
                                       CONSTRAINT "PK_CONCEPT_SUPPORTIVES" PRIMARY KEY ("concept_id", "supportives_id"),
                                       CONSTRAINT "FK_CONCEPT_SUPPORTIVES_CONCEPT" FOREIGN KEY ("concept_id") REFERENCES "concepts" ("concept_id"),
                                       CONSTRAINT "FK_CONCEPT_SUPPORTIVES_SUPPORT" FOREIGN KEY ("supportives_id") REFERENCES "concepts" ("concept_id")
);

CREATE TABLE "concept_prerequisites" (
                                         "concepts_id" INTEGER NOT NULL,
                                         "prerequisite_id" INTEGER NOT NULL,
                                         "description" VARCHAR(255),
                                         "importance_level" INTEGER DEFAULT 1,
                                         "created_at" TIMESTAMP,
                                         CONSTRAINT "PK_CONCEPT_PREREQUISITES" PRIMARY KEY ("concepts_id", "prerequisite_id"),
                                         CONSTRAINT "FK_CONCEPT_PREREQ_CONCEPT" FOREIGN KEY ("concepts_id") REFERENCES "concepts" ("concept_id"),
                                         CONSTRAINT "FK_CONCEPT_PREREQ_PREREQUISITE" FOREIGN KEY ("prerequisite_id") REFERENCES "concepts" ("concept_id")
);

-- 다중 테이블에 의존하는 테이블들
CREATE TABLE "user_textbook_enrollments" (
                                             "user_id" UUID NOT NULL,
                                             "textbook_id" SMALLINT NOT NULL,
                                             "enrolled_at" TIMESTAMP,
                                             "access_expires_at" TIMESTAMP,
                                             "payment_status" BOOLEAN DEFAULT FALSE,
                                             "progress_rate" SMALLINT DEFAULT 0,
                                             "last_access_at" TIMESTAMP,
                                             "review" TEXT,
                                             "rating" SMALLINT,
                                             CONSTRAINT "PK_USER_TEXTBOOK_ENROLLMENTS" PRIMARY KEY ("user_id", "textbook_id"),
                                             CONSTRAINT "FK_ENROLLMENTS_USERS" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
                                             CONSTRAINT "FK_ENROLLMENTS_TEXTBOOKS" FOREIGN KEY ("textbook_id") REFERENCES "textbooks" ("textbook_id")
);

CREATE TABLE "progress" (
                            "user_id" UUID NOT NULL,
                            "units_id" INTEGER NOT NULL,
                            "completion_status" BOOLEAN NOT NULL DEFAULT FALSE,
                            "completion_percentage" INTEGER DEFAULT 0,
                            "notes" TEXT,
                            "created_at" TIMESTAMP,
                            "updated_at" TIMESTAMP,
                            "field" BOOLEAN NOT NULL DEFAULT FALSE,
                            CONSTRAINT "PK_PROGRESS" PRIMARY KEY ("user_id", "units_id"),
                            CONSTRAINT "FK_PROGRESS_USERS" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
                            CONSTRAINT "FK_PROGRESS_UNITS" FOREIGN KEY ("units_id") REFERENCES "units" ("unit_id")
);

CREATE TABLE "user_concepts" (
                                 "user_id" UUID NOT NULL,
                                 "concepts_id" INTEGER NOT NULL,
                                 "master_rate" SMALLINT DEFAULT 0,
                                 CONSTRAINT "PK_USER_CONCEPTS" PRIMARY KEY ("user_id", "concepts_id"),
                                 CONSTRAINT "FK_USER_CONCEPTS_USERS" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
                                 CONSTRAINT "FK_USER_CONCEPTS_CONCEPTS" FOREIGN KEY ("concepts_id") REFERENCES "concepts" ("concept_id")
);

CREATE TABLE "unit_concepts" (
                                 "unit_id" INTEGER NOT NULL,
                                 "concept_id" INTEGER NOT NULL,
                                 "concept_type" VARCHAR(20) NOT NULL,
                                 "importance_level" INTEGER DEFAULT 1,
                                 "created_at" TIMESTAMP,
                                 CONSTRAINT "PK_UNIT_CONCEPTS" PRIMARY KEY ("unit_id", "concept_id"),
                                 CONSTRAINT "FK_UNIT_CONCEPTS_UNITS" FOREIGN KEY ("unit_id") REFERENCES "units" ("unit_id"),
                                 CONSTRAINT "FK_UNIT_CONCEPTS_CONCEPTS" FOREIGN KEY ("concept_id") REFERENCES "concepts" ("concept_id")
);