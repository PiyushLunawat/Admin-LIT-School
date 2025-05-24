export interface Task {
  id: string;
  title: string;
  type: string;
  description: string;
  config: {
    characterLimit?: number;
    maxFiles?: number;
    maxFileSize?: number;
    allowedTypes?: string[];
  };
}

export interface TaskBuilderProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  typeOptions: {
    value: string;
    label: string;
  }[];
  fileTypeOptions?: {
    [key: string]: {
      value: string;
      label: string;
    }[];
  };
}
