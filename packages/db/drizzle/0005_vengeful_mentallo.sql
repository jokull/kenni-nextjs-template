CREATE TABLE "kenni_login" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kennital_id" text NOT NULL,
	"id_token" text NOT NULL,
	"access_token" text NOT NULL,
	"user_claims" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "dokobit_login" CASCADE;--> statement-breakpoint
ALTER TABLE "kenni_login" ADD CONSTRAINT "kenni_login_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kenni_login_user_id_index" ON "kenni_login" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "kenni_login_kennital_id_index" ON "kenni_login" USING btree ("kennital_id");--> statement-breakpoint
CREATE INDEX "kenni_login_created_at_index" ON "kenni_login" USING btree ("created_at");