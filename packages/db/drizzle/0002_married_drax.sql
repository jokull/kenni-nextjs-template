ALTER TABLE "dokobit_logins" RENAME TO "dokobit_login";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_personalCode_unique";--> statement-breakpoint
ALTER TABLE "dokobit_login" DROP CONSTRAINT "dokobit_logins_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "dokobit_logins_user_id_index";--> statement-breakpoint
DROP INDEX "dokobit_logins_dokobit_session_id_index";--> statement-breakpoint
DROP INDEX "dokobit_logins_created_at_index";--> statement-breakpoint
DROP INDEX "users_personal_code_index";--> statement-breakpoint
DROP INDEX "users_email_index";--> statement-breakpoint
DROP INDEX "users_role_index";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "kennital_type" text;--> statement-breakpoint
ALTER TABLE "dokobit_login" ADD CONSTRAINT "dokobit_login_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dokobit_login_user_id_index" ON "dokobit_login" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "dokobit_login_dokobit_session_id_index" ON "dokobit_login" USING btree ("dokobit_session_id");--> statement-breakpoint
CREATE INDEX "dokobit_login_created_at_index" ON "dokobit_login" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_personal_code_index" ON "user" USING btree ("personal_code");--> statement-breakpoint
CREATE INDEX "user_email_index" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_index" ON "user" USING btree ("role");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_personalCode_unique" UNIQUE("personal_code");
