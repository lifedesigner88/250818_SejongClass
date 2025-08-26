ALTER TABLE "themes" ALTER COLUMN "class_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "hover" varchar(200) NOT NULL;