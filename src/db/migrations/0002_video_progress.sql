-- Custom SQL migration file, put your code below! --
ALTER TABLE "video" ADD COLUMN "progress" integer DEFAULT 0 NOT NULL;
