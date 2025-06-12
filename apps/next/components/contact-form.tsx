"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { FieldGroup, Fieldset } from "~/components/ui/fieldset";
import { TextField } from "~/components/ui/text-field";
import { TextAreaField } from "~/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof ContactFormData, value: string) => {
    const result = contactSchema.shape[field].safeParse(value);
    return result.success ? null : result.error.errors[0]?.message;
  };

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const field = key as keyof ContactFormData;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Contact form submitted:", formData);

      // Reset form after successful submission
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Fieldset>
        <FieldGroup>
          <TextField
            value={formData["name"]}
            onChange={(value) => handleFieldChange("name", value)}
            type="text"
            isInvalid={!!errors["name"]}
            label="Name"
            placeholder="Your full name"
            errorMessage={errors["name"]}
          />

          <TextField
            value={formData["email"]}
            onChange={(value) => handleFieldChange("email", value)}
            type="email"
            isInvalid={!!errors["email"]}
            label="Email"
            placeholder="your.email@example.com"
            errorMessage={errors["email"]}
          />

          <TextAreaField
            value={formData["message"]}
            onChange={(value) => handleFieldChange("message", value)}
            isInvalid={!!errors["message"]}
            label="Message"
            placeholder="Tell us how we can help you..."
            errorMessage={errors["message"]}
          />
        </FieldGroup>
      </Fieldset>

      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
