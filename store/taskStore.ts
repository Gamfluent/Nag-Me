import 'react-native-get-random-values';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { scheduleTaskNotification, cancelTaskNotifications, rescheduleAllNotifications } from '../services/notifications';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: number;
  completed: boolean;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'completed' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: async (task) => {
        const newTask: Task = {
          ...task,
          id: uuidv4(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
        await scheduleTaskNotification(newTask);
      },
      updateTask: async (taskId, updates) => {
        let updatedTask: Task | undefined;
        set((state) => {
          const newTasks = state.tasks.map(t => {
            if (t.id === taskId) {
              updatedTask = { ...t, ...updates };
              return updatedTask;
            }
            return t;
          });
          return { tasks: newTasks };
        });
        if (updatedTask) {
          await scheduleTaskNotification(updatedTask);
        }
      },
      deleteTask: async (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== taskId)
        }));
        await cancelTaskNotifications(taskId);
      },
      toggleComplete: async (taskId) => {
        let toggledTask: Task | undefined;
        set((state) => {
          const newTasks = state.tasks.map(t => {
            if (t.id === taskId) {
              toggledTask = { ...t, completed: !t.completed };
              return toggledTask;
            }
            return t;
          });
          return { tasks: newTasks };
        });
        if (toggledTask) {
          if (toggledTask.completed) {
            await cancelTaskNotifications(taskId);
          } else {
            await scheduleTaskNotification(toggledTask);
          }
        }
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
