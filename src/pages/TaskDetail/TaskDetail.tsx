import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '@/context/TaskContext';
import { TaskForm } from '@/components/TaskForm/TaskForm';
import type { UpdateTaskDto } from '@/types';
import './TaskDetail.css';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask, loading } = useTasks();
  const [isEditing, setIsEditing] = useState(false);

  const task = id ? getTaskById(id) : undefined;

  const handleUpdate = async (data: UpdateTaskDto) => {
    if (id) {
      await updateTask(id, data);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      await deleteTask(id);
      navigate('/');
    }
  };

  const handleStatusChange = async (newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (id) {
      await updateTask(id, { status: newStatus });
    }
  };

  if (!task) {
    return (
      <div className="task-detail">
        <div className="error">Задача не найдена</div>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Вернуться к списку
        </button>
      </div>
    );
  }

  const getStatusLabel = (status: typeof task.status) => {
    const labels = {
      pending: 'Ожидает',
      in_progress: 'В работе',
      completed: 'Завершена',
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: typeof task.priority) => {
    const labels = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
    };
    return labels[priority];
  };

  return (
    <div className="task-detail">
      {isEditing ? (
        <>
          <h2>Редактировать задачу</h2>
          <TaskForm task={task} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />
        </>
      ) : (
        <>
          <div className="task-detail-header">
            <h2>{task.title}</h2>
            <div className="task-detail-actions">
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Редактировать
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Удалить
              </button>
            </div>
          </div>

          <div className="task-detail-content">
            <div className="task-detail-section">
              <h3>Описание</h3>
              <p>{task.description}</p>
            </div>

            <div className="task-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Статус:</span>
                <span className={`status status-${task.status}`}>{getStatusLabel(task.status)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Приоритет:</span>
                <span className={`priority priority-${task.priority}`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
              {task.dueDate && (
                <div className="meta-item">
                  <span className="meta-label">Срок выполнения:</span>
                  <span>{new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
                </div>
              )}
              {task.assignee && (
                <div className="meta-item">
                  <span className="meta-label">Исполнитель:</span>
                  <span>{task.assignee}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Создана:</span>
                <span>{new Date(task.createdAt).toLocaleString('ru-RU')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Обновлена:</span>
                <span>{new Date(task.updatedAt).toLocaleString('ru-RU')}</span>
              </div>
            </div>

            <div className="task-detail-section">
              <h3>Изменить статус</h3>
              <div className="status-buttons">
                <button
                  onClick={() => handleStatusChange('pending')}
                  className={`btn btn-status ${task.status === 'pending' ? 'active' : ''}`}
                  disabled={task.status === 'pending'}
                >
                  Ожидает
                </button>
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className={`btn btn-status ${task.status === 'in_progress' ? 'active' : ''}`}
                  disabled={task.status === 'in_progress'}
                >
                  В работе
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className={`btn btn-status ${task.status === 'completed' ? 'active' : ''}`}
                  disabled={task.status === 'completed'}
                >
                  Завершена
                </button>
              </div>
            </div>
          </div>

          <div className="task-detail-footer">
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Вернуться к списку
            </button>
          </div>
        </>
      )}
    </div>
  );
};

