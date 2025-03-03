import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, Download, FileIcon, FileText, ImageIcon, Link2Icon, VideoIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getStudentApplication } from '@/app/api/student';
import { Button } from '@/components/ui/button';


interface SubmissionViewProps {
  tasks: any;
  submission: any;
}

const SubmissionView: React.FC<SubmissionViewProps> = ({ tasks, submission }) => {

  return (
    <div className="">

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Dive</h3>

            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">Why are you interested in joining The LIT School?</h4>
            {submission?.courseDive?.[0] && 
            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.[0]}</div> 
            </div>}
            </div>
            

            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">What are your career goals or aspirations??</h4>
              {submission?.courseDive?.[1] &&
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.[1]}</div> 
              </div>}
            </div>

          </div>
          <Separator className="my-8" />

        {tasks.map((task: any, index: any) => (
          <React.Fragment key={index}>
          <div className="space-y-4">
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
              </div>
            }
              <div className='flex flex-wrap gap-2 mt-2'>
              {submission?.tasks[index]?.text?.map((textItem: string, id: number) => (
                <div key={`text-${id}`} className="w-full flex items-center gap-2 text-sm px-4 py-2 border rounded-xl">
                  {textItem}
                </div>
              ))}
              {submission?.tasks[index]?.links?.map((linkItem: string, id: number) => (
                <div key={`link-${id}`} className="w-full flex items-center gap-2 text-sm p-3 border rounded-xl">
                  <Link2Icon className="w-4 h-4" />
                  <a href={linkItem} target="_blank" rel="noopener noreferrer" className="text-white">
                    {linkItem}
                  </a>
                </div>
              ))}
              {submission?.tasks[index]?.images?.map((imageItem: string, id: number) => (
                <div key={`image-${id}`} className="w-full flex flex-col items-center text-sm border rounded-xl">
                  <img src={imageItem} alt={imageItem.split('/').pop()} className='w-full h-[420px] object-contain rounded-t-xl' />
                  <div className='w-full flex justify-between items-center p-3 border-t'>
                    <div className='flex items-center gap-2 text-sm truncate'>
                      <ImageIcon className="w-4 h-4" />
                      <span className='w-[220px] text-white truncate'>
                        {imageItem.split('/').pop()}
                      </span>
                    </div>
                    <Button variant={'ghost'} size={'zero'} className=''>
                      <a href={imageItem} target="_blank" rel="noopener noreferrer" className="">
                        <Download className="w-4 h-4 " />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
              {submission?.tasks[index]?.videos?.map((videoItem: string, id: number) => (
                <div key={`video-${id}`} className="w-full flex flex-col w-fit items-center text-sm border rounded-xl">
                  <video controls preload="none" className='h-[420px] rounded-t-xl'>
                    <source src={videoItem} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className='w-full flex justify-between items-center p-3 border-t'>
                    <div className='flex items-center gap-2 text-sm truncate'>
                      <VideoIcon className="w-4 h-4" />
                      <span className='w-[220px] text-white truncate'>
                        {videoItem.split('/').pop()}
                      </span>
                    </div>
                    <Button variant={'ghost'} size={'zero'} className=''>
                      <a href={videoItem} target="_blank" rel="noopener noreferrer" className="">
                        <Download className="w-4 h-4 " />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
              {submission?.tasks[index]?.files?.map((fileItem: string, id: number) => (
                <div key={`file-${id}`} className="flex w-full items-center gap-2 text-sm p-3 border rounded-xl">
                  <FileIcon className="w-4 h-4" />
                  <a href={fileItem} target="_blank" rel="noopener noreferrer" className="text-white">
                    {fileItem.split('/').pop()}
                  </a>
                </div>
              ))}
              </div>
            </div>

          </div>
            {index < tasks?.length - 1 && <Separator className="my-8" />}
        </React.Fragment>))}
    </div>
  );
};

export default SubmissionView;
