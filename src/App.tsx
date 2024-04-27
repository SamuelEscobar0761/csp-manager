import { useState } from 'react';

const NavbarItem = ({ title, children }: {title: string, children: any}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="w-full text-left px-4 py-2 text-white bg-gray-800 hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>
        {title}
      </button>
      {isOpen && (
        <div className="pl-4 bg-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-5 font-bold text-lg">Administración</div>
      <NavbarItem title="Inicio">
        <div className="py-2 px-4 hover:bg-gray-600">Foto de información general del Club</div>
      </NavbarItem>
      <NavbarItem title="Quiénes somos?">
        <div className="py-2 px-4 hover:bg-gray-600">Directorio</div>
        <div className="py-2 px-4 hover:bg-gray-600">Estatuto</div>
        <div className="py-2 px-4 hover:bg-gray-600">Reglamentos</div>
        <div className="py-2 px-4 hover:bg-gray-600">Memorias</div>
      </NavbarItem>
      <NavbarItem title="Deportes">
        {/* Similar sub-items for each sport */}
        <div className="py-2 px-4 hover:bg-gray-600">Natación</div>
        <div className="py-2 px-4 hover:bg-gray-600">Tenis</div>
        <div className="py-2 px-4 hover:bg-gray-600">Racquet</div>
        <div className="py-2 px-4 hover:bg-gray-600">Paleta</div>
        <div className="py-2 px-4 hover:bg-gray-600">Fútbol</div>
        <div className="py-2 px-4 hover:bg-gray-600">Gimnasio</div>
        <div className="py-2 px-4 hover:bg-gray-600">Ciclismo</div>
        <div className="py-2 px-4 hover:bg-gray-600">Wally</div>
        {/* Add more sports here */}
      </NavbarItem>
      <NavbarItem title="Restaurante y Snack">
        {/* Similar sub-items for each menu type */}
        <div className="py-2 px-4 hover:bg-gray-600">Menú Semanal</div>
        <div className="py-2 px-4 hover:bg-gray-600">Menú Comedor</div>
        <div className="py-2 px-4 hover:bg-gray-600">Menú Snack</div>
        {/* Add more menus here */}
      </NavbarItem>
      <NavbarItem title="Únete al Club">
        {/* Similar sub-items */}
        <div className="py-2 px-4 hover:bg-gray-600">Tarifario</div>
        <div className="py-2 px-4 hover:bg-gray-600">Participación</div>
        {/* Add more join us sub-items here */}
      </NavbarItem>
      <div className="px-4 py-2 hover:bg-gray-600">Noticias</div>
    </div>
  );
};

export default AdminSidebar;