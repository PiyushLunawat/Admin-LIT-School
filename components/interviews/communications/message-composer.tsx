"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, Send } from "lucide-react";

interface MessageComposerProps {
  onSend: (message: {
    content: string;
    template?: string;
    attachments?: File[];
  }) => void;
  templates: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

export function MessageComposer({ onSend, templates }: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setContent(template.content);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSend = () => {
    if (content.trim()) {
      onSend({
        content,
        template: selectedTemplate,
        attachments,
      });
      setContent("");
      setSelectedTemplate("");
      setAttachments([]);
    }
  };

  return (
    <div className="space-y-4 border-t p-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Template</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Label>Attachments</Label>
          <Input
            type="file"
            multiple
            onChange={handleAttachmentChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm bg-muted px-2 py-1 rounded"
              >
                <Paperclip className="h-4 w-4" />
                <span>{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={!content.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>
    </div>
  );
}