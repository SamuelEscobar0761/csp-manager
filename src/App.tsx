import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminSidebar from './app/components/AdminSidebar';
import { MainLayout } from './app/pages/MainLayout';
import { useEffect, useState } from 'react';
import { AboutUsPage } from './app/pages/AboutUsPage';
import { NewsPage } from './app/pages/NewsPage';
import { RegulationsPage } from './app/pages/RegulationsPage';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import LoginPage from './app/pages/LoginPage';

function App() {
  const [page, setPage] = useState<string>("");
  const [component, setComponent] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        resetTimer();
      } else {
        setUser(null);
        clearTimer();
      }
    });
  }, []);

  const resetTimer = () => {
    clearTimer(); // Limpia el timer anterior si existe
    const newTimer = setTimeout(() => {
      // Cierra la sesión después de 1 hora
      signOut(getAuth()).catch(console.error);
    }, 3600000); // 3600000 ms = 1 hora
    setTimer(newTimer);
  };

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return (
    <Router>
      {user ? (
        <div className='flex min-h-screen'>
          <AdminSidebar setPage={setPage} setComponent={setComponent} />
          <Routes>
            <Route path="/" element={<MainLayout page={page} component={component}/>} />
            <Route path="/about_us" element={<AboutUsPage page={page} component={component}/>} />
            <Route path="/regulations" element={<RegulationsPage page={page} component={component}/>} />
            <Route path="/news" element={<NewsPage page={page} component={component}/>} />
            <Route path="/*" element={ <Navigate to='/' /> } />
          </Routes>
        </div>
      ) : (
        <LoginPage/>
      )}
    </Router>
  );
}

export default App;