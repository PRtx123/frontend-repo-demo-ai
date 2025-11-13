import type { Task, CreateTaskDto, UpdateTaskDto, User } from '@/types';

const API_BASE_URL = 'https://api.example.com';

// Mock data
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Изучить React',
    description: 'Изучить основы React и хуки',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    dueDate: '2024-02-01',
    assignee: 'user1',
  },
  {
    id: '2',
    title: 'Написать тесты',
    description: 'Написать unit тесты для компонентов',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    dueDate: '2024-02-15',
  },
  {
    id: '3',
    title: 'Рефакторинг кода',
    description: 'Улучшить структуру проекта',
    status: 'completed',
    priority: 'low',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
];

let mockUsers: User[] = [
  { id: 'user1', name: 'Иван Иванов', email: 'ivan@example.com', role: 'admin' },
  { id: 'user2', name: 'Мария Петрова', email: 'maria@example.com', role: 'user' },
  { id: 'user3', name: 'Петр Сидоров', email: 'petr@example.com', role: 'user' },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taskApi = {
  async getAll(): Promise<Task[]> {
    await delay(500);
    return [...mockTasks];
  },

  async getById(id: string): Promise<Task | null> {
    await delay(300);
    return mockTasks.find(task => task.id === id) || null;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    await delay(400);
    const newTask: Task = {
      id: String(mockTasks.length + 1),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return newTask;
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task | null> {
    await delay(400);
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;
    
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockTasks[taskIndex];
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;
    mockTasks.splice(taskIndex, 1);
    return true;
  },
};

export const userApi = {
  async getAll(): Promise<User[]> {
    await delay(300);
    return [...mockUsers];
  },

  async getById(id: string): Promise<User | null> {
    await delay(200);
    return mockUsers.find(user => user.id === id) || null;
  },
};

