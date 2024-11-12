import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileIcon, FileText, Link2Icon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Task {
  title: string;
  description: string;
  resources: { filename: string; link: string };
  submission: string; // Updated to match `application.tasks` data
  type: string;
  wordLimit?: string;
  fileSize?: string;
}

interface SubmissionViewProps {
  tasks: Task[];
}

const SubmissionView: React.FC<SubmissionViewProps> = ({ tasks }) => {
  return (
    <div className="h-[80vh] overflow-y-auto">
        {tasks.map((task, index) => (<>
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-semibold">Task 0{index + 1}</h3>
            <h4 className="font-medium text-[#00A3FF]">{task.title}</h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>

            <div className="space-y-2">
              <h5 className="text-base font-medium">Resources</h5>
                <div className='flex gap-2'>
                  {task.resources.filename && <div className="flex items-center w-fit gap-2 mt-2 p-2 border rounded">
                    <div className="flex gap-2 items-center text-sm">
                      <FileIcon className="w-4 h-4" />
                      {task.resources.filename}
                    </div>
                  </div>}
                  {task.resources.link && <div className="flex items-center w-fit gap-2 mt-2 p-2 border rounded">
                    <div className="flex gap-2 items-center text-sm">
                      <Link2Icon className="w-4 h-4" />
                      {task.resources.link}
                    </div>
                  </div>}
                </div>
            </div>

            <div className="mt-4">
              <div className='flex justify-between items-center'>
              <Badge variant="lemon"  className="px-3 py-2 text-sm bg-[#FFF552]/[0.2] border-[#FFF552]">
                Submission
              </Badge>
              <div className="text-muted-foreground text-sm mt-2">
                Type: {task.type}
                {task.wordLimit && ` (${task.wordLimit})` || task.fileSize && ` (${task.fileSize})`}
              </div>
              </div>
              <div className="flex items-center gap-2 mt-2 p-2 border rounded">{task.submission}</div> {/* Updated here */}
              
            </div>

          </div>
            {index < tasks.length - 1 && <Separator className="my-4" />}
        </>))}
    </div>
  );
};

export default SubmissionView;
