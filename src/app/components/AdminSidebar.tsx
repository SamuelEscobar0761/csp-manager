import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarItem = ({ title, children }: {title: string, children: any}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="w-full text-left px-4 py-2 text-white bg-gray-800 hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>
        {title}
      </button>
      {isOpen && (
        <div className="pl-10 bg-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = ({ setPage, setComponent }: { setPage: any; setComponent: any }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <h2 className="p-5 font-bold text-lg">Administración</h2>
      <NavbarItem title="Inicio">
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("homepage"); setComponent("information") }}>Foto de información general del Club</Link>
        </div>
      </NavbarItem>
      <NavbarItem title="Quiénes somos?">
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("about_us_page"); setComponent("directory") }}>Directorio</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/statute' onClick={() => { setPage("about_us_page"); setComponent("statute") }}>Estatuto</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/regulations' onClick={() => { setPage("about_us_page"); setComponent("regulations") }}>Reglamentos</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/memories' onClick={() => { setPage("about_us_page"); setComponent("memories") }}>Memorias</Link>
        </div>
      </NavbarItem>
      <NavbarItem title="Deportes">
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("swimming_page"); setComponent("information") }}>Natación</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("tennis_page"); setComponent("information") }}>Tenis</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("racket_page"); setComponent("information") }}>Racquet</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("paddle_page"); setComponent("information") }}>Paleta</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("football_page"); setComponent("information") }}>Fútbol</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("gym_page"); setComponent("information") }}>Gimnasio</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("cycling_page"); setComponent("information") }}>Ciclismo</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("wally_page"); setComponent("information") }}>Wally</Link>
        </div>
      </NavbarItem>
      <NavbarItem title="Restaurante y Snack">
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("restaurant_page"); setComponent("weekly_menu") }}>Menú Semanal</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("restaurant_page"); setComponent("main_menu") }}>Menú Comedor</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("restaurant_page"); setComponent("snack_menu") }}>Menú Snack</Link>
        </div>
      </NavbarItem>
      <NavbarItem title="Únete al Club">
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("join_us_page"); setComponent("tariff") }}>Tarifario</Link>
        </div>
        <div className="py-1 hover:bg-gray-600">
          <Link to='/' onClick={() => { setPage("join_us_page"); setComponent("participation") }}>Participación</Link>
        </div>
      </NavbarItem>
      <div className="pl-4 py-1 hover:bg-gray-600">
        <Link to='/news' onClick={() => { setPage("news"); setComponent("news") }}>Noticias</Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
