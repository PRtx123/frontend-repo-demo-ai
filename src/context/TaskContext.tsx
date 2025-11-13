import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';
import { taskApi } from '@/services/api';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки задач');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: CreateTaskDto) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskApi.create(data);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания задачи');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, data: UpdateTaskDto) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskApi.update(id, data);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления задачи');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await taskApi.delete(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления задачи');
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

