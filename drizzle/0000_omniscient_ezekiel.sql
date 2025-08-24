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
CREATE TABLE "themes" (
	"themes_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" smallint NOT NULL,
	"icon_url" varchar(200)
);
--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_themes_id_themes_themes_id_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("themes_id") ON DELETE cascade ON UPDATE cascade;