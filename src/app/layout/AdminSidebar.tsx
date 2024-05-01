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

const AdminSidebar = ({ setPage, setComponent }: {setPage: any, setComponent: any}) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-5 font-bold text-lg">Administración</div>
      <NavbarItem title="Inicio">
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("homepage");setComponent("information")}}>Foto de información general del Club</div>
      </NavbarItem>
      <NavbarItem title="Quiénes somos?">
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("directory")}}>Directorio</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("statute")}}>Estatuto</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("regulations")}}>Reglamentos</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("memories")}}>Memorias</div>
      </NavbarItem>
      <NavbarItem title="Deportes">
        {/* Similar sub-items for each sport */}
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("swimming_page");setComponent("information")}}>Natación</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("tennis_page");setComponent("information")}}>Tenis</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("racket_page");setComponent("information")}}>Racquet</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("paddle_page");setComponent("information")}}>Paleta</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("football_page");setComponent("information")}}>Fútbol</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("gym_page");setComponent("information")}}>Gimnasio</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("cycling_page");setComponent("information")}}>Ciclismo</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("wally_page");setComponent("information")}}>Wally</div>
        {/* Add more sports here */}
      </NavbarItem>
      <NavbarItem title="Restaurante y Snack">
        {/* Similar sub-items for each menu type */}
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("restaurant_page");setComponent("weekly_menu")}}>Menú Semanal</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("restaurant_page");setComponent("main_menu")}}>Menú Comedor</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("restaurant_page");setComponent("snack_menu")}}>Menú Snack</div>
        {/* Add more menus here */}
      </NavbarItem>
      <NavbarItem title="Únete al Club">
        {/* Similar sub-items */}
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("join_us_page");setComponent("tariff")}}>Tarifario</div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("join_us_page");setComponent("participation")}}>Participación</div>
        {/* Add more join us sub-items here */}
      </NavbarItem>
      <div className="px-4 py-2 hover:bg-gray-600" onClick={()=>{setPage("news");setComponent("news")}}>Noticias</div>
    </div>
  );
};

export default AdminSidebar;
