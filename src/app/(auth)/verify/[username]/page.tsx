"use client";

import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="text-3xl font-bold text-center mb-6">
          Verify Your Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter verification code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Verify Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;