CREATE TABLE "email" (
	"id" text PRIMARY KEY NOT NULL,
	"to" text NOT NULL,
	"from" text NOT NULL,
	"subject" text NOT NULL,
	"text_content" text NOT NULL,
	"html_content" text NOT NULL,
	"status" text DEFAULT 'development' NOT NULL,
	"error_message" text,
	"postmark_message_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "email_to_index" ON "email" USING btree ("to");--> statement-breakpoint
CREATE INDEX "email_status_index" ON "email" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_created_at_index" ON "email" USING btree ("created_at");