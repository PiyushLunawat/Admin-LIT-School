"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Send, HelpCircle } from "lucide-react";

export function HelpSupport() {
  const faqs = [
    {
      question: "How do I evaluate a LITMUS test submission?",
      answer:
        "To evaluate a submission, go to the Submissions tab, select the submission you want to evaluate, and click on 'Start Evaluation'. Follow the evaluation criteria and provide detailed feedback for each section.",
    },
    {
      question: "What should I do if I need to reschedule a presentation?",
      answer:
        "Go to the Presentations tab, find the presentation you need to reschedule, click on the reschedule button, and select a new time slot. The applicant will be automatically notified of the change.",
    },
    {
      question: "How do I award scholarships?",
      answer:
        "After completing the evaluation, you can award scholarships based on the applicant's performance. Select the appropriate scholarship slab and provide justification for your decision.",
    },
    {
      question: "Can I export evaluation reports?",
      answer:
        "Yes, you can export evaluation reports from the Reports tab. Choose the date range and click on either 'Export PDF' or 'Export Excel' to download the reports.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What do you need help with?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue in detail..."
              className="min-h-[100px]"
            />
          </div>
          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Help Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              User Guide
            </Button>
            <Button variant="outline" className="justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Video Tutorials
            </Button>
            <Button variant="outline" className="justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Best Practices Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}