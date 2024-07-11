import { useCallback, useEffect, useState } from "react";
import NewsObject from "../interfaces/NewsObject";
import { addNews, deleteNews, editNews, getNews } from "../services/FirebaseService";
import { NewsCard } from "../components/NewsCard";

export const NewsPage = ({ page, component }: { page: string, component: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newsInformationObjects, setNewsInformationObjects] = useState<NewsObject[]>([]);
    const [selectedType, setSelectedType] = useState('comunicado');
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [inputsfilled, setInputsFilled] = useState<boolean>(true);
    const [editDialog, setEditDialog] = useState<{ show: boolean, newsKey?: string }>({ show: false });
    const [newNews, setNewNews] = useState<{ title?: string, date?: string | null, image?: File | null, description?: string}>({title:"", description: ""});
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean, newsKey?: string }>({ show: false });
    
    // Encapsula la función de carga en useCallback para evitar redefiniciones innecesarias
    const loadNews = useCallback(async () => {
        setLoading(true);
        try {
            const infoNews = await getNews();
            setNewsInformationObjects(infoNews);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, component]);

    const handleAddButtonClick = () => {
        setShowAddDialog(true);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value);
    };

    const formatDateToString = (dateString: string): string => {
        // Asegúrate de tratar la fecha como UTC para evitar cambios por zona horaria
        const date = new Date(dateString + 'T00:00:00Z');
        const day = ("0" + date.getUTCDate()).slice(-2);  // Usar getUTCDate para obtener el día UTC
        const month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Usar getUTCMonth para obtener el mes UTC
        const year = date.getUTCFullYear(); // Usar getUTCFullYear para obtener el año UTC
        return `${day}-${month}-${year}`; // Formato dd-mm-yyyy
    };

    const formatStringToDate = (date: string): string =>{
        const [day, month, year] = date.split("-");
        return `${year}-${month}-${day}`;
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formattedDate = formatDateToString(event.target.value);
        setNewNews(prev => ({ ...prev, date: formattedDate }));
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setNewNews(prev => ({ ...prev, title: title }));
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const description = event.target.value;
        setNewNews(prev => ({ ...prev, description: description }));
    }

    // Función para manejar la subida de un nuevo PDF
    const handleNewNewsSubmit = async () => {
        if(!newNews.image || !newNews.date || (selectedType === 'publicacion' && (!newNews.title || !newNews.description))){
            setInputsFilled(false);
        }else{
            setShowAddDialog(false);
            setInputsFilled(true);
            const result = await addNews(newNews.title!, newNews.description!, newNews.date, newNews.image);
            if (result.success) {
                loadNews(); // Recargar la lista de PDFs
            } else {
                alert('Please ensure both file and name are provided: ' + result.message);
            }
        }
    };

    const handleDeleteClick = (newsKey: string) => {
        setConfirmDelete({ show: true, newsKey: newsKey });
    };

    const handleDeleteConfirm = async () => {
        if (confirmDelete.newsKey) {
            setConfirmDelete({ show: false });
            const result = await deleteNews(confirmDelete.newsKey);
            if (result.success) {
                loadNews();  // Recargar la lista de PDFs
            } else {
                alert(result.message);
            }
        }
    };

    const handleEditClick = (newsKey: string) => {
        setEditDialog({ show: true, newsKey: newsKey });
        const newsSelected = newsInformationObjects.filter(item => item.key == newsKey)[0];
        if(newsSelected.title === "Comunicado"){
            setSelectedType("comunicado");
        }else{
            setSelectedType("publicacion");
        }
        setNewNews({title: newsSelected.title, date: newsSelected.date, description: newsSelected.description});
    }

    const handleEditConfirm = async() => {
        if(editDialog.newsKey && !(selectedType === 'publicacion' && newNews.title === 'Comunicado')){
            setEditDialog({show: false});
            const result = await editNews(editDialog.newsKey, selectedType, newNews.title!, newNews.description!, newNews.date!, newNews.image!);
            if (result.success) {
                loadNews();  // Recargar la lista de PDFs
            } else {
                alert(result.message);
            }
        }
    }

    // Cargar imágenes al montar y cuando cambian las dependencias
    useEffect(() => {
        loadNews();
    }, [loadNews]);

    // useEffect(() => {
    //     console.log(newNews);
    // }, [newNews]);

    if(loading){
        return <div><p>Cargando...</p></div>;
    }

    return(
        <div>
            <h2 className="px-5 py-5 text-7xl">Noticias</h2>
            <button onClick={handleAddButtonClick} className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <span className="text-xl">+</span>
                </button>
            {newsInformationObjects.map((item, index) =>(
                <div key={index}>
                    <NewsCard key={item.key} date={item.date} description={item.description} title={item.title} url={item.url!} onEdit={()=>handleEditClick(item.key)} onDelete={() => handleDeleteClick(item.key)}/>
                </div>
            ))}
            {showAddDialog && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <h2 className="text-lg font-semibold">Nueva noticia</h2>
                  <select id="typeSelect" className='border-solid border-2 border-gray-500 m-2 rounded p-[2px] cursor-pointer' value={selectedType} onChange={handleTypeChange}>
                    <option value="comunicado">Comunicado</option>
                    <option value="publicacion">Publicación</option>
                  </select>
                  <input type="file" accept="image/png, image/jpeg" onChange={(e) => setNewNews(prev => ({ ...prev, image: e.target.files ? e.target.files[0] : null}))} />
                  <input type="date" onChange={handleDateChange} className="p-2 border rounded" placeholder="Fecha" />
                  {selectedType === 'publicacion' &&(
                    <div>
                      <input type="text" onChange={handleTitleChange} className="" placeholder="Título"/>
                      <input type="text" onChange={handleDescriptionChange} className="" placeholder="Descripción"/>
                    </div>
                  )}
                    <div className="flex justify-around">
                      <button onClick={() => setShowAddDialog(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                      <button onClick={handleNewNewsSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirmar</button>
                    </div>
                  {!inputsfilled &&(
                      <p className="text-red-500 text-md">Por favor asegurate de haber llenado todos los campos.</p>
                  )}
                </div>
              </div>
            )}
            {confirmDelete.show &&(
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <p className="text-center text-lg font-semibold">¿Estás seguro de que quieres continuar? Esta acción no se puede deshacer.</p>
                  <div className="flex justify-around">
                    <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Confirmar</button>
                   <button onClick={() => {setConfirmDelete(prev => ({...prev, show: false}))}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {editDialog.show &&(
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <h2 className="text-lg font-semibold">¡Atención! Este cambio es irreversible.</h2>
                  <select id="typeSelect" className='border-solid border-2 border-gray-500 m-2 rounded p-[2px] cursor-pointer' value={selectedType} onChange={handleTypeChange}>
                    <option value="comunicado">Comunicado</option>
                    <option value="publicacion">Publicación</option>
                  </select>
                  <input type="file" accept="image/png, image/jpeg" onChange={(e) => setNewNews(prev => ({ ...prev, image: e.target.files ? e.target.files[0] : null}))} />
                  <input type="date" onChange={handleDateChange} className="p-2 border rounded" value={formatStringToDate(newNews.date!)}/>
                  {selectedType === 'publicacion' &&(
                    <div>
                      <input type="text" onChange={handleTitleChange} className="border rounded" value={newNews.title}/>
                      <input type="text" onChange={handleDescriptionChange} className="mx-2 border rounded" value={newNews.description} placeholder="Descripción"/>
                    </div>
                  )}
                    <div className="flex justify-around">
                      <button onClick={() => setEditDialog({show:false})} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                      <button onClick={handleEditConfirm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirmar</button>
                    </div>
                    {selectedType === 'publicacion' && newNews.title === 'Comunicado' &&(
                    <p className="text-red-500 text-md">El título de una publicación no puede ser "Comunicado", ese título es exclusivo para comunicados</p>
                )}
                </div>
              </div>
            )}
        </div>
    );
}