import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import type { Task } from '@/types';
import './TaskList.css';

export const TaskList: React.FC = () => {
  const { tasks, loading, error, deleteTask } = useTasks();
  const [filter, setFilter] = useState<'all' | Task['status']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
  });

  if (loading && tasks.length === 0) {
    return <div className="loading">Загрузка задач...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Список задач</h2>
        <div className="task-list-controls">
          <div className="filter-group">
            <label>Фильтр:</label>
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">Все</option>
              <option value="pending">Ожидают</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершены</option>
            </select>
          </div>
          <div className="sort-group">
            <label>Сортировка:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="date">По дате</option>
              <option value="priority">По приоритету</option>
            </select>
          </div>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="empty-state">Задачи не найдены</div>
      ) : (
        <div className="task-grid">
          {sortedTasks.map(task => (
            <TaskCard key={task.title} task={task} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
};

