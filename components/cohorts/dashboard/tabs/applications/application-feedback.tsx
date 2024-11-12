import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
  title: string;
}

interface ApplicationFeedbackProps {
  name: string;
  email: string;
  phone: string;
  tasks: Task[];
  onClose: () => void;
  onUpdateStatus: (status: string, feedback: { [key: string]: string }) => void;
}

const ApplicationFeedback: React.FC<ApplicationFeedbackProps> = ({ name, email, phone, tasks, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState<string>('On Hold');
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [reason, setReason] = useState<string>('');

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (value !== 'On Hold') {
      setReason('');
    }
  };

  const handleFeedbackChange = (taskTitle: string, value: string) => {
    setFeedback((prev) => ({ ...prev, [taskTitle]: value }));
  };

  const handleUpdateStatus = () => {
    onUpdateStatus(status, feedback);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-sm text-muted-foreground">{phone}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status Selector */}
        <div>
          <Label>Status</Label>
          <Select onValueChange={handleStatusChange} defaultValue={status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Reason or Feedback Textareas */}
        {status === 'On Hold' && (
          <div>
            <Label>Provide Reason</Label>
            <Textarea placeholder="Enter missed deliverables..." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        )}

        {status === 'Accepted' && (
          <div className="space-y-4">
            <h4 className="font-medium">Feedback</h4>
            {tasks.map((task, index) => (
              <div key={index}>
                <Label className="text-[#00A3FF]">Task 0{index+1}</Label>
                <Textarea
                  placeholder="Type here..."
                  value={feedback[task.title] || ''}
                  onChange={(e) => handleFeedbackChange(task.title, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <Button className="w-full mt-4" onClick={handleUpdateStatus}>
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default ApplicationFeedback;
