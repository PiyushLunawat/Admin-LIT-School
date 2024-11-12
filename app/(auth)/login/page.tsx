"use client"

import { loginUser } from "@/app/api/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null); // Reset any previous errors

    try {
      const userData = await loginUser(email, password);
      // Optionally save user data/token here, e.g., in local storage or context
      router.push("/dashboard"); // Redirect to dashboard on success
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive" });
    }
  };
  
  return (
    <div className="w-full">
      <div className="relative">
        <img src="/assets/images/lit-banner.svg" alt="BANNER" className="w-full h-[200px] sm:h-[336px] object-cover" />
        <img src="/assets/images/lit-logo.svg" alt="LIT" className="absolute top-7 left-7 w-8 sm:w-14" />
      </div>
          <div className="w-full px-6 mt-8 sm:mt-14 justify-center items-center">
          <div className='max-w-[840px] mx-auto'>
            <div className="gap-4 sm:gap-6 flex flex-col text-center">
              <div className=" text-xl sm:text-3xl font-semibold ">Join the Education Revolution!</div>
              <div className=" text-sm sm:text-base font-semibold ">Access your dashboard by verifying your contact number</div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className='flex-1 space-y-1'>
                <Label htmlFor="email" className='text-sm font-normal pl-3'>Enter your Email</Label>
                <Input id="email" type="email" placeholder="johndoe@gmail.com" 
                value={email}1 items-center text-sm text-[#FF503D] font-normal pl-3'><AlertCircle className='w-3 h-3'/>This Email does not exists.</Label> */}
                onChange={(e) => setEmail(e.target.value)}/>
                {/* <Label htmlFor="email-error" className='flex gap-
              </div>

              <div className='flex-1 space-y-1'>
                <Label htmlFor="password" className='text-sm font-normal pl-3'>Enter your Password</Label>
                <Input id="password" type="password" placeholder="******" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                {/* <Label htmlFor="password-error" className='flex gap-1 items-center text-sm text-[#FF503D] font-normal pl-3'><AlertCircle className='w-3 h-3'/>Incorrect password.</Label> */}
              </div>

              {errorMessage && (
                <div className="text-sm text-[#FF503D] flex items-center gap-1 pl-3 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
               )}

              <div className="flex gap-2 justify-between items-center mt-6">
                <Button onClick={handleLogin} className='flex-1 space-y-1' >Login</Button>
              </div>
          </div>
            </div>
          </div>
    </div>
  );
}