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
      question: "How do I reschedule an interview?",
      answer:
        "To reschedule an interview, go to the Scheduled Interviews tab, find the interview you want to reschedule, and click the reschedule button. You can then select a new time slot that works for both you and the applicant.",
    },
    {
      question: "What should I do if I'm running late for an interview?",
      answer:
        "If you're running late, use the Communications tab to quickly send a message to the applicant. You can use the 'Delay Notification' template to inform them about the delay and provide an estimated new start time.",
    },
    {
      question: "How do I submit interview feedback?",
      answer:
        "After completing an interview, go to the interview details page and click on the 'Submit Feedback' button. Fill out the evaluation form with your assessment and recommendations, then click submit.",
    },
    {
      question: "Can I export my interview schedule?",
      answer:
        "Yes, you can export your interview schedule by going to the Reports tab and clicking the 'Export Schedule' button. You can choose to export in PDF or Excel format.",
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