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
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("homepage");setComponent("information")}}><button className='text-left'>Foto de información general del Club</button></div>
      </NavbarItem>
      <NavbarItem title="Quiénes somos?">
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("directory")}}><button className=''>Directorio</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("statute")}}><button>Estatuto</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("regulations")}}><button>Reglamentos</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("about_us_page");setComponent("memories")}}><button>Memorias</button></div>
      </NavbarItem>
      <NavbarItem title="Deportes">
        {/* Similar sub-items for each sport */}
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("swimming_page");setComponent("information")}}><button>Natación</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("tennis_page");setComponent("information")}}><button>Tenis</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("racket_page");setComponent("information")}}><button>Racquet</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("paddle_page");setComponent("information")}}><button>Paleta</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("football_page");setComponent("information")}}><button>Fútbol</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("gym_page");setComponent("information")}}><button>Gimnasio</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("cycling_page");setComponent("information")}}><button>Ciclismo</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("wally_page");setComponent("information")}}><button>Wally</button></div>
        {/* Add more sports here */}
      </NavbarItem>
      <NavbarItem title="Restaurante y Snack">
        {/* Similar sub-items for each menu type */}
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("restaurant_page");setComponent("weekly_menu")}}><button>Menú Semanal</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("restaurant_page");setComponent("main_menu")}}><button>Menú Comedor</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("restaurant_page");setComponent("snack_menu")}}><button>Menú Snack</button></div>
        {/* Add more menus here */}
      </NavbarItem>
      <NavbarItem title="Únete al Club">
        {/* Similar sub-items */}
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("join_us_page");setComponent("tariff")}}><button>Tarifario</button></div>
        <div className="py-2 px-4 hover:bg-gray-600" onClick={()=>{setPage("join_us_page");setComponent("participation")}}><button>Participación</button></div>
        {/* Add more join us sub-items here */}
      </NavbarItem>
      <div className="px-4 py-2 hover:bg-gray-600" onClick={()=>{setPage("news");setComponent("news")}}><button>Noticias</button></div>
    </div>
  );
};

export default AdminSidebar;
