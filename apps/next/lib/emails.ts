import { render } from "@react-email/render";
import { eq } from "drizzle-orm";
import { fromSafePromise, ResultAsync } from "neverthrow";

import { db, Email } from "@acme/db";
import { safeFetch } from "@acme/utils";

import { WelcomeEmail } from "~/emails/welcome";

import { env } from "./env";

function stringToBase64(str: string): string {
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const buffer = encoder.encode(str);

  // Convert ArrayBuffer to binary string
  const binaryString = new Uint8Array(buffer).reduce(
    (acc, byte) => acc + String.fromCodePoint(byte),
    "",
  );

  // Convert binary string to base64
  return btoa(binaryString);
}

// Log email to database
async function logEmail({
  to,
  from,
  subject,
  textContent,
  htmlContent,
  status = "development",
  errorMessage,
  postmarkMessageId,
}: {
  to: string;
  from: string;
  subject: string;
  textContent: string;
  htmlContent: string;
  status?: "sent" | "failed" | "development";
  errorMessage?: string;
  postmarkMessageId?: string;
}): Promise<string> {
  const [emailRecord] = await db
    .insert(Email)
    .values({
      to,
      from,
      subject,
      textContent,
      htmlContent,
      status,
      errorMessage,
      postmarkMessageId,
    })
    .returning();

  return emailRecord!.id;
}

interface Mail {
  content: { html?: string; txt: string };
  addresses: string[];
  subject: string;
  attachments?: { name: string; content: string; contentType: string }[];
  cc?: string;
}

interface EmailError {
  type: "validation";
  message: string;
}

export async function sendEmail({
  mail: { addresses, content, subject, attachments, cc },
  from = '"Órslofs" <info@solberg.is>',
}: {
  mail: Mail;
  from?: string;
}) {
  // Validate input
  if (addresses.length === 0) {
    return ResultAsync.fromSafePromise(
      Promise.reject(new Error("No email addresses provided")),
    ).mapErr(
      (): EmailError => ({
        type: "validation",
        message: "No email addresses provided",
      }),
    );
  }

  if (!content.txt.trim()) {
    return ResultAsync.fromSafePromise(
      Promise.reject(new Error("Email text content is required")),
    ).mapErr(
      (): EmailError => ({
        type: "validation",
        message: "Email text content is required",
      }),
    );
  }

  if (!subject.trim()) {
    return ResultAsync.fromSafePromise(
      Promise.reject(new Error("Email subject is required")),
    ).mapErr(
      (): EmailError => ({
        type: "validation",
        message: "Email subject is required",
      }),
    );
  }

  // Always log emails to database first
  const emailIds = await Promise.all(
    addresses.map((address) =>
      logEmail({
        to: address,
        from,
        subject,
        textContent: content.txt,
        htmlContent: content.html || "",
        status: env.NODE_ENV === "development" ? "development" : "sent",
      }),
    ),
  );

  // In development, just log and return success
  if (env.NODE_ENV === "development") {
    console.info(`📧 Email logged to database:`);
    emailIds.forEach((emailId, index) => {
      console.info(`   To: ${addresses[index]}`);
      console.info(`   Subject: ${subject}`);
      console.info(`   View: http://localhost:3000/dev/emails/${emailId}`);
    });
    return fromSafePromise(Promise.resolve(emailIds)).map(() => {
      return { isOk: true, value: emailIds };
    });
  }

  // In production, send via Postmark
  const json = addresses.map((address) => ({
    From: from,
    To: address,
    Subject: subject,
    Cc: cc,
    HtmlBody: content.html,
    TextBody: content.txt,
    ...(attachments?.length
      ? {
          Attachments: attachments.map(({ content, contentType, name }) => ({
            Content: stringToBase64(content),
            ContentType: contentType,
            Name: name,
          })),
        }
      : undefined),
  }));

  return safeFetch("https://api.postmarkapp.com/email/batch", {
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": env.POSTMARK_SERVER_API_TOKEN,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  }).mapErr(async (error) => {
    // Update email records with failure status
    await Promise.all(
      emailIds.map((emailId) =>
        db
          .update(Email)
          .set({
            status: "failed",
            errorMessage: (() => {
              if (error.type === "http") {
                return `HTTP ${error.status}: ${error.url}`;
              }
              if (error.type === "network") {
                return `Network error: ${error.error.message}`;
              }
              return `Parse error: ${error.error.message}`;
            })(),
          })
          .where(eq(Email.id, emailId)),
      ),
    );
    return error;
  });
}

// Welcome email template
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const subject = "Velkomin til Órslofs!";

  // Render React Email template
  const htmlContent = await render(WelcomeEmail({ name }));
  const textContent = await render(WelcomeEmail({ name }), { plainText: true });

  const result = await sendEmail({
    mail: {
      addresses: [email],
      subject,
      content: {
        txt: textContent,
        html: htmlContent,
      },
    },
  });

  return result;
}
