export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: number; // 0-10
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate: Date;
  priority: number;
}
