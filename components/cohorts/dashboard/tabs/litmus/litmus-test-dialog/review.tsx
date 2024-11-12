import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { FileText, HandMetal, Link, Link2Icon } from "lucide-react";
import React, { useState } from "react";

export function ReviewComponent() {
  const [clarity, setClarity] = useState(50);
  const [creativity, setCreativity] = useState(50);
  const [feasibility, setFeasibility] = useState(50);
  const [performanceRating, setPerformanceRating] = useState(4);

  const sections = [
    {
      title: "Strengths",
      placeholder: "Type here..."
    },
    {
      title: "Weakness",
      items: [
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown"
      ]
    },
    {
      title: "Opportunities",
      items: [
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown"
      ]
    },
    {
      title: "Threats",
      items: [
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown",
        "Influencer Cost Breakdown"
      ]
    }
  ];

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-base font-semibold">John Doe</h2>
              <div className="flex gap-4 h-5 items-center">
                <p className="text-sm text-muted-foreground">johndoe@yopmail.com</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-muted-foreground">9382222322</p>
              </div>
            </div>
          </div>

      {/* Task Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Task 01</h3>
        <p className="text-[#00A3FF] ">Pitch Your Business Idea</p>
        <ul className="space-y-2 list-disc pl-4 text-sm">
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
          <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
          <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium ">Resources</h4>
        <div className="space-y-2">
          <div className="flex gap-2">
          <div className="border rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4" />
              <span>Filename.pdf</span>
            </div>
          </div>
          
          <div className="border rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link2Icon className="w-4" />
              <span>http://localhost:3000/dashboard/cohorts</span>
            </div>
          </div>
          </div>
        </div>
      </div>


      <Badge variant="blue">Submission 01</Badge>
        <img 
            src="/assets/images/task-img.svg"
            alt="task"
            className="w-full h-auto"
          />

      <Badge variant="blue">Submission 02</Badge>

      <div className="mt-4">
        <Card className="">
          <div className="p-4 flex items-center justify-between">
            <p>Filename.mov</p>
            <span className="text-sm text-zinc-400">Type: Video | 20 mb</span>
          </div>
        </Card>
      </div>

      {/* Criteria Evaluation Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Criteria Evaluation</h3>
        <div  className="space-y-2">
          <div className="flex justify-between">
            <Label>Creativity</Label>
            <span className="text-sm">5/10</span>
          </div>
            <Slider
              defaultValue={[5]}
              max={10}
              step={1}
              className="w-full"
            />
        </div>
        <div  className="space-y-2">
          <div className="flex justify-between">
            <Label>Clarity</Label>
            <span className="text-sm">5/10</span>
          </div>
            <Slider
              defaultValue={[5]}
              max={10}
              step={1}
              className="w-full"
            />
        </div>
        <div  className="space-y-2">
          <div className="flex justify-between">
            <Label>Feasibility</Label>
            <span className="text-sm">5/10</span>
          </div>
            <Slider
              defaultValue={[5]}
              max={10}
              step={1}
              className="w-full"
            />
        </div>
      </div>

      {/* Performance Rating Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Performance Rating</h3>
        {/* <StarRating value={performanceRating} onChange={setPerformanceRating} max={5} /> */}
      </div>

      {/* Strengths and Weaknesses Section */}
      <div className="space-y-4">
      <h3 className="text-lg font-semibold">Feedback</h3>
      
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className="p-4">
            <h4 className="flex gap-2 items-center text-sm font-medium  mb-3">
              <HandMetal className="w-4 h-4 rotate-90"/>{section.title}
            </h4>
            {section.placeholder ? (
              <Textarea 
                placeholder={section.placeholder}
                className=""
              />
            ) : (
              <ul className="space-y-2 list-disc">
                {section.items?.map((item, index) => (
                  <li key={index} className="flex items-center text-sm font-normal space-x-2">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </div>
    
      {/* Publish Button */}
      <div className="text-center">
        <Button className="w-full">
          Publish Review
        </Button>
      </div>
    </div>
  );
}
