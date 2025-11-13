import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/context/TaskContext';
import { TaskForm } from '@/components/TaskForm/TaskForm';
import type { CreateTaskDto } from '@/types';
import './CreateTask.css';

export const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { createTask, loading } = useTasks();

  const handleSubmit = async (data: CreateTaskDto) => {
    await createTask(data);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-task">
      <h2>Создать новую задачу</h2>
      <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

