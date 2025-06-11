CREATE TABLE "dokobit_logins" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"dokobit_session_id" text NOT NULL,
	"certificate_data" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"personal_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"email_verified_at" timestamp,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_personalCode_unique" UNIQUE("personal_code")
);
--> statement-breakpoint
ALTER TABLE "dokobit_logins" ADD CONSTRAINT "dokobit_logins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dokobit_logins_user_id_index" ON "dokobit_logins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "dokobit_logins_dokobit_session_id_index" ON "dokobit_logins" USING btree ("dokobit_session_id");--> statement-breakpoint
CREATE INDEX "dokobit_logins_created_at_index" ON "dokobit_logins" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_personal_code_index" ON "users" USING btree ("personal_code");--> statement-breakpoint
CREATE INDEX "users_email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_index" ON "users" USING btree ("role");