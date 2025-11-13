import React from 'react';
import { Link } from 'react-router-dom';
import type { Task } from '@/types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      pending: 'Ожидает',
      in_progress: 'В работе',
      completed: 'Завершена',
    };
    return labels[status];
  };

  const getPriorityClass = (priority: Task['priority']) => {
    return `priority priority-${priority}`;
  };

  const getStatusClass = (status: Task['status']) => {
    return `status status-${status}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="task-card">
      <Link to={`/task/${task.id}`} className="task-card-link">
        <div className="task-card-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-badges">
            <span className={getStatusClass(task.status)}>{getStatusLabel(task.status)}</span>
            <span className={getPriorityClass(task.priority)}>{task.priority}</span>
          </div>
        </div>
        <p className="task-description">{task.description}</p>
        <div className="task-meta">
          {task.dueDate && (
            <span className="task-date">
              Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
            </span>
          )}
          <span className="task-assignee">Исполнитель: {task.assignee || 'Не назначен'}</span>
        </div>
      </Link>
      {onDelete && (
        <button className="task-delete-btn" onClick={handleDelete}>
          Удалить
        </button>
      )}
    </div>
  );
};

