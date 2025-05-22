"use client";

import { login, resendOtp, verifyOtp } from "@/app/api/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Eye, EyeOff, MailIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema using Zod
const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
  generalError: z.string().optional(),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");

  useEffect(() => {
    setTimer(59);
  }, []);

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
      const loginPayload = {
        email: data.email,
        password: data.password,
      };
      const loginData = await login(loginPayload);
      console.log(loginData);

      Cookies.set("adminOtpRequestToken", loginData.otpRequestToken, {
        expires: 1 / 144,
      });

      // setOtpToken(loginData.otpRequestToken)
      setShowOtp(true);
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
      const x = Cookies.get("adminOtpRequestToken");
      if (x) {
        const otpPayload = {
          otpRequestToken: x,
          otp: otp,
        };

        const res = await verifyOtp(otpPayload);
        // console.log("res",res);

        Cookies.set("adminAccessToken", res.accessToken, { expires: 1 / 12 });
        Cookies.set("adminRefreshToken", res.refreshToken, { expires: 7 });
        Cookies.set("adminId", res.user.id);
        Cookies.set("adminEmail", res.user.email);
        Cookies.remove("adminOtpRequestToken");
        router.push("/dashboard"); // Redirect to dashboard after verification
      }
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendSubmit = async () => {
    setLoading(true);
    try {
      const x = Cookies.get("adminOtpRequestToken");
      if (x) {
        const resendPayload = {
          otpRequestToken: x,
        };

        const res = await resendOtp(resendPayload);
        console.log("res", res);
        setTimer(59);
      }
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message || "Please try again.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP countdown
  useEffect(() => {
    if (showOtp && typeof timer === "number" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) =>
          typeof prev === "number" && prev > 0 ? prev - 1 : 0
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtp, timer]);

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          src="/assets/images/lit-banner.svg"
          alt="BANNER"
          width={1200}
          height={336}
          className="w-full h-[200px] sm:h-[336px] object-cover"
        />
        <Image
          src="/assets/images/lit-logo.svg"
          alt="LIT"
          width={56}
          height={56}
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
                      <Input
                        type="email"
                        placeholder="johndoe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="pl-3" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative">
                    <Label>Password</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="pl-3" />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="text-[#FF503D] text-sm pl-3">
                  {errorMessage}
                </div>
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
            <DialogTitle></DialogTitle>
            <DialogContent className="flex flex-col gap-4 sm:gap-6 p-8 sm:p-16 bg-[#09090b] rounded-xl max-w-[90vw] sm:max-w-2xl mx-auto">
              <div className="text-center text-xl font-semibold">
                Verify Your Account
              </div>
              <div className="sm:w-fit sm:flex text-center mx-auto">
                <span className="font-light sm:font-normal">
                  An OTP was sent to your email
                </span>
                <span className="flex text-center font-light sm:font-normal mx-auto w-fit items-center">
                  <MailIcon className="w-4 h-4 ml-2 mr-1" />{" "}
                  {form.getValues("email")}
                </span>
              </div>
              <div className="flex mx-auto">
                <InputOTP
                  maxLength={6}
                  value={otp} // Controlled state
                  onChange={(value) => setOtp(value)} // Update OTP state
                >
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
                  <Button
                    type="button"
                    onClick={handleOtpSubmit}
                    disabled={loading}
                  >
                    {loading ? "Wait..." : "Confirm and Login"}
                  </Button>
                </div>

                <div className="flex gap-2 text-center items-center justify-center text-base mx-auto mt-2">
                  <Button
                    variant="link"
                    className="underline"
                    onClick={handleResendSubmit}
                    disabled={
                      loading || (typeof timer === "number" && timer > 0)
                    }
                  >
                    {loading ? "Resending OTP..." : "Resend OTP"}
                  </Button>
                  {typeof timer === "number" && timer > 0 && (
                    <span>in 00:{timer < 10 ? `0${timer}` : timer}</span>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
