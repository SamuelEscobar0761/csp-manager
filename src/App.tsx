import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminSidebar from './app/components/AdminSidebar';
import { MainLayout } from './app/pages/MainLayout';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<string>("");
  const [component, setComponent] = useState<string>("");

  return (
    <Router>
      <div className='flex min-h-screen'>
        <AdminSidebar setPage={setPage} setComponent={setComponent} />
        <Routes>
          <Route path="/" element={ <MainLayout page={page} component={component}/> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
