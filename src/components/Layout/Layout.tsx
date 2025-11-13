import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">Task Manager</h1>
          <nav className="nav">
            <Link
              to="/"
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Задачи
            </Link>
            <Link
              to="/create"
              className={location.pathname === '/create' ? 'nav-link active' : 'nav-link'}
            >
              Создать задачу
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Task Manager. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

