"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { loginAdmin, verifyAdminOtp } from "@/app/api/auth";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { MailIcon } from "lucide-react";
import { OTPInput } from "input-otp";

// Validation schema using Zod
const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" })
  .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
  generalError: z.string().optional(),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(59);
  const [email, setEmail] = useState(""); // Store email for OTP verification
  const [otp, setOtp] = useState(""); // Store OTP input

  // Initialize React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // OTP Input Form
  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Handle login submission
  const handleSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      console.log("emaill",data.email, data.password);

      const loginPayload = {
        email: data.email,
        password: data.password
      }
      console.log("response f", loginPayload);

      const loginData = await loginAdmin(loginPayload);
      console.log("sssd",loginData);
      setShowOtp(true);
      // Cookies.set('admin-token', loginData.token,  { expires: 1 * });
      // router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message);
      setErrorMessage(error.message || "An unexpected error occurred.");
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const res = await verifyAdminOtp(email, otp);
      console.log("res",res);
      
      Cookies.set("admin-token", "some_token", { expires: 1 }); // Save token
      router.push("/dashboard"); // Redirect to dashboard after verification
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP countdown
  useEffect(() => {
    if (showOtp && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [showOtp, timer]);

  return (
    <div className="w-full">
      <div className="relative">
        <img
          src="/assets/images/lit-banner.svg"
          alt="BANNER"
          className="w-full h-[200px] sm:h-[336px] object-cover"
        />
        <img
          src="/assets/images/lit-logo.svg"
          alt="LIT"
          className="absolute top-7 left-7 w-8 sm:w-14"
        />
      </div>
      <div className="w-full px-6 mt-8 sm:mt-14 flex justify-center items-center">
        <div className="max-w-[840px] mx-auto">
          <div className="gap-1 sm:gap-3 flex flex-col text-center">
            <div className="text-2xl sm:text-3xl font-semibold ">
              Join the Education Revolution!
            </div>
            <div className="text-base sm:text-lg font-light sm:font-normal ">
              Access your dashboard by verifying your Email
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-2 mt-8"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Email Address</Label>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}

              <div className="flex justify-center items-center mt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  Login
                </Button>
              </div>
            </form>
          </Form>

          {/* OTP Dialog */}
          <Dialog open={showOtp} onOpenChange={setShowOtp}>
            <DialogContent className="flex flex-col gap-4 sm:gap-6 p-8 sm:p-16 bg-[#09090b] rounded-xl max-w-[90vw] sm:max-w-2xl mx-auto">
              <div className="text-center text-xl font-semibold">
                Verify Your Account
              </div>
              <div className="sm:w-fit sm:flex text-center mx-auto">
                <span className="font-light sm:font-normal">
                  An OTP was sent to your email
                </span>
                <span className="flex text-center font-light sm:font-normal mx-auto w-fit items-center">
                  <MailIcon className="w-4 h-4 ml-2 mr-1" /> {email}
                </span>
              </div>
              <div className="flex mx-auto">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>


              <div className="flex flex-col gap-">
                <div className="text-center">
                  <Button type="button" onClick={handleOtpSubmit} disabled={loading}>
                    {loading ? "Wait..." : "Confirm and Login"}
                  </Button>
                </div>

                <div className="flex gap-2 text-center items-center justify-center text-base mx-auto mt-2">
                  <Button
                    variant="link"
                    className="underline"
                    onClick={() => setShowOtp(true)}
                    disabled={loading || timer > 0}
                    >
                    {loading ? "Resending OTP..." : "Resend OTP"}
                  </Button>
                  {timer > 0 ? `in 00:${timer < 10 ? `0${timer}` : `timer`}` : ""}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}