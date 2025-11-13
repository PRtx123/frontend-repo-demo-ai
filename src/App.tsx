import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from '@/context/TaskContext';
import { Layout } from '@/components/Layout/Layout';
import { TaskList } from '@/pages/TaskList/TaskList';
import { CreateTask } from '@/pages/CreateTask/CreateTask';
import { TaskDetail } from '@/pages/TaskDetail/TaskDetail';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/task/:id" element={<TaskDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;

