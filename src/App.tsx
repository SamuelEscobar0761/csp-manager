import { BrowserRouter as Router } from 'react-router-dom';
import AdminSidebar from './app/layout/AdminSidebar';
import { MainLayout } from './app/layout/MainLayout';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<string>("");
  const [component, setComponent] = useState<string>("");

  return (
    <Router>
      <div className='flex min-h-screen'>
        <AdminSidebar setPage={setPage} setComponent={setComponent} />
        <div className='flex-grow'>
          <MainLayout page={page} component={component} />
        </div>
      </div>
    </Router>
  );
}

export default App;
