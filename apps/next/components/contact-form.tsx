"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/field";
import { FieldGroup, Fieldset } from "~/components/ui/fieldset";
import { Input, TextField } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Contact form submitted:", data);

    // Reset form after successful submission
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Fieldset>
        <FieldGroup>
          <TextField isInvalid={!!errors.name}>
            <Label>Name</Label>
            <Input
              {...register("name")}
              type="text"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </TextField>

          <TextField isInvalid={!!errors.email}>
            <Label>Email</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </TextField>

          <TextField isInvalid={!!errors.message}>
            <Label>Message</Label>
            <Textarea
              {...register("message")}
              placeholder="Tell us how we can help you..."
              rows={4}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.message.message}
              </p>
            )}
          </TextField>
        </FieldGroup>
      </Fieldset>

      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
