import React, { useState, useEffect } from 'react';
import type { CreateTaskDto, UpdateTaskDto, Task } from '@/types';
import { userApi } from '@/services/api';
import type { User } from '@/types';
import './TaskForm.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => Promise<void>;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setAssignee(task.assignee || '');
    }
  }, []);

  useEffect(() => {
    userApi.getAll().then(data => {
      setUsers(data);
    });
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title) {
      newErrors.title = 'Название обязательно';
    }

    if (!description) {
      newErrors.description = 'Описание обязательно';
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Дата не может быть в прошлом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const formData: CreateTaskDto | UpdateTaskDto = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
        assignee: assignee || undefined,
      };

      await onSubmit(formData);
    } catch (err) {
      console.error('Ошибка сохранения задачи:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Название задачи *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание *</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            value={priority}
            onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Срок выполнения</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className={errors.dueDate ? 'input-error' : ''}
          />
          {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="assignee">Исполнитель</label>
        <select
          id="assignee"
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
        >
          <option value="">Не назначен</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Отмена
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Сохранение...' : task ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

