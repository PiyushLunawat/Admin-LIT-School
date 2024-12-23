import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileIcon, FileText, ImageIcon, Link2Icon, VideoIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getStudentApplication } from '@/app/api/student';


interface SubmissionViewProps {
  tasks: any;
  submission: any;
}

const SubmissionView: React.FC<SubmissionViewProps> = ({ tasks, submission }) => {

  console.log("subb",submission);
  

  return (
    <div className="">

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Dive</h3>

            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">Why are you interested in joining The LIT School?</h4>
            {submission?.courseDive?.text1 && 
            <div className="mt-2">
              <div className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.text1}</div> 
            </div>}
            </div>
            

            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">What are your career goals or aspirations??</h4>
              {submission?.courseDive?.text2 &&
              <div className="mt-2">
                <div className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.text2}</div> 
              </div>}
            </div>

          </div>
          <Separator className="my-8" />

        {tasks.map((task: any, index: any) => (<>
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-semibold">Task 0{index + 1}</h3>
            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">{task?.title}</h4>
              <p className="text-sm text-muted-foreground">{task?.description}</p>
            </div>

            {/* <div className="space-y-2">
              <h5 className="text-base font-medium">Resources</h5>
                <div className='flex gap-2'>
                  {task.resources.filename && <div className="flex items-center w-fit gap-2 mt-2 p-2 border rounded-xl">
                    <div className="flex gap-2 items-center text-sm">
                      <FileIcon className="w-4 h-4" />
                      {task.resources.filename}
                    </div>
                  </div>}
                  {task.resources.link && <div className="flex items-center w-fit gap-2 mt-2 p-2 border rounded-xl">
                    <div className="flex gap-2 items-center text-sm">
                      <Link2Icon className="w-4 h-4" />
                      {task.resources.link}
                    </div>
                  </div>}
                </div>
            </div> */}

            <div className="mt-4">
            {submission && 
              <div className='flex justify-between items-center'>
                <Badge variant="lemon"  className="px-3 py-2 text-sm bg-[#FFF552]/[0.2] border-[#FFF552]">
                  Submission
                </Badge>
                <div className="text-muted-foreground text-sm mt-2">
                  Type: {task?.config
                      .map((configItem: any) => configItem?.type)
                      .join(", ")}
                </div>
              </div>}
            {submission?.tasks[index]?.task?.text?.map((textItem: string, id: number) => (
              <div key={`text-${id}`} className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">
                {textItem}
              </div>
            ))}
            {submission?.tasks[index]?.task?.links?.map((linkItem: string, id: number) => (
              <div key={`link-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <Link2Icon className="w-4 h-4" />
                <a href={linkItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {linkItem}
                </a>
              </div>
            ))}
            {submission?.tasks[index]?.task?.images?.map((imageItem: string, id: number) => (
              <div key={`image-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <ImageIcon className="w-4 h-4" />
                <a href={imageItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {imageItem.split('/').pop()}
                </a>
              </div>
            ))}
            {submission?.tasks[index]?.task?.videos?.map((videoItem: string, id: number) => (
              <div key={`video-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <VideoIcon className="w-4 h-4" />
                <a href={videoItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {videoItem.split('/').pop()}
                </a>
              </div>
            ))}
            {submission?.tasks[index]?.task?.files?.map((fileItem: string, id: number) => (
              <div key={`file-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <FileIcon className="w-4 h-4" />
                <a href={fileItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {fileItem.split('/').pop()}
                </a>
              </div>
            ))}
            </div>

          </div>
            {index < tasks?.length - 1 && <Separator className="my-8" />}
        </>))}
    </div>
  );
};

export default SubmissionView;
