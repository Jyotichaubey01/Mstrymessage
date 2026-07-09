"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export function FormItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <label className="text-sm font-medium">{children}</label>;
}

export function FormControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function FormMessage() {
  const {
    formState: { errors },
  } = useFormContext();

  const error = Object.values(errors)[0];

  if (!error) return null;

  return (
    <p className="text-sm text-red-500">
      {String(error.message)}
    </p>
  );
}