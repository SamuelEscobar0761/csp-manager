import { useCallback, useEffect, useState } from "react";
import { addInformationObject, deleteInformationObject, editInformationObject, getInformationObjects } from "../services/FirebaseService";
import InformationObject from "../interfaces/InformationObject";

export const AboutUsPage = ({ page, component }: { page: string, component: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [pdfInformationObjects, setPdfInformationObjects] = useState<InformationObject[]>([]);
    const [editDialog, setEditDialog] = useState<{ show: boolean, pdfKey?: string, pdfName?: string }>({ show: false });
    const [newPdf, setNewPdf] = useState<{ name?: string | null, file?: File | null}>({name: ""});
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean, pdfKey?: string }>({ show: false });
    const [showAddDialog, setShowAddDialog] = useState(false);
    
    // Encapsula la función de carga en useCallback para evitar redefiniciones innecesarias
    const loadPdfs = useCallback(async () => {
        setLoading(true);
        try {
            const infoPdfs = await getInformationObjects('pdfs', page, component);
            setPdfInformationObjects(infoPdfs);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, component]);

    const handleEditClick = async (key: string, pdfName: string) => {
        setEditDialog({ show: true, pdfKey: key, pdfName: pdfName });
        setNewPdf({name: pdfName});
    };

    const handleEditSubmit = async () => {
        if (editDialog.pdfKey) {
            setEditDialog({ show: false });
            const response = await editInformationObject('pdfs', editDialog.pdfKey, newPdf.file? newPdf.file : null, newPdf.name!);
            if (response.success) {
                await loadPdfs(); // Reload the images to reflect the changes
            } else {
                alert('Error al subir el archivo pdf, error de conexión');
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setNewPdf(prev => ({...prev, file: file}));
    };

    const cancelEdit = () => {
        setEditDialog({ show: false });
        setNewPdf({name: editDialog.pdfName, file: null});
    };

    const handleDeleteClick = (pdfKey: string) => {
        setConfirmDelete({ show: true, pdfKey: pdfKey });
    };

    const handleDeleteConfirm = async () => {
        if (confirmDelete.pdfKey) {
            setConfirmDelete({ show: false });
            const result = await deleteInformationObject('pdfs', confirmDelete.pdfKey);
            if (result.success) {
                loadPdfs();  // Recargar la lista de PDFs
            } else {
                alert(result.message);
            }
        }
    };

    // Función para manejar la subida de un nuevo PDF
    const handleNewPdfSubmit = async () => {
        if (newPdf.file && newPdf.name) {
            setShowAddDialog(false);
            const result = await addInformationObject('pdfs', newPdf.file, component, newPdf.name, page);
            if (result.success) {
                loadPdfs(); // Recargar la lista de PDFs
            } else {
                alert('Please ensure both file and name are provided: ' + result.message);
            }
        }
    };

    // Cargar imágenes al montar y cuando cambian las dependencias
    useEffect(() => {
        loadPdfs();
    }, [loadPdfs]);

    if(loading){
        return <div><p>Cargando...</p></div>;
    }

    if(component === 'regulations'){
        return(
            <div>
            
            </div>
        );
    }

    return(
        <div className="w-full py-5">
            {pdfInformationObjects.map((item, index) =>(
              <div className="h-auto flex justify-start ..." key={index}>
                <iframe src={item.url!} className='pl-20 pr-5 w-2/3 h-screen'/>
                <div className="bg-gray-200 w-3/12 h-full rounded">
                  <h2 className="text-5xl pl-5 pt-2">{component === 'statute'? ("Estatuto"):("Memorias")}</h2>
                  <div className="pl-5 m-5">
                    <p className="mr-2 text-xl">Nombre del documento:</p>
                    <p className="pt-1 text-bold">{item.name}.pdf</p>
                  </div>
                  <div className="m-5 flex justify-end ...">
                    <button onClick={() => {handleEditClick(item.key, item.name)}} className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Editar</button>
                    <button onClick={() => {handleDeleteClick(item.key)}} className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Borrar</button>
                  </div>
                </div>
              </div>
            ))}
            {(pdfInformationObjects.length < 1 &&(
              <button onClick={() => {setShowAddDialog(true);}} className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <span className="text-xl">+</span>
              </button>
            ))}
            {showAddDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-4 rounded-lg space-y-4">
                <h2 className="text-lg font-semibold">Agregar nuevo pdf</h2>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} />
                  <input type="text" onChange={(e) => setNewPdf(prev => ({ ...prev, name: e.target.value}))} className="p-2 border rounded" placeholder="Nombre" />
                  <div className="flex justify-around">
                    <button onClick={() => setShowAddDialog(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    <button onClick={handleNewPdfSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirmar</button>
                  </div>
              </div>
            </div>
            )}
            {editDialog.show && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <p className="text-left text-lg font-semibold">Estás a punto de editar la imágen de "{editDialog.pdfName}".<br/>¿Estás seguro de guardar los cambios? La acción no podrá deshacerse.</p>
                  <input type="file" onChange={handleFileChange} accept="application/pdf" />
                  <input type="text" value={newPdf.name!} onChange={(e) => setNewPdf(prev => ({ ...prev, name: e.target.value}))} className="p-2 border rounded" placeholder="Nombre" />
                  <div className="flex justify-around">
                    <button onClick={() => handleEditSubmit()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Guardar y remplazar</button>
                    <button onClick={() => cancelEdit()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {confirmDelete.show && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <p className="text-center text-lg font-semibold">¿Estás seguro de que quieres borrar este documento? Esta acción no se puede deshacer.</p>
                  <div className="flex justify-around">
                    <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Confirmar</button>
                   <button onClick={() => {setConfirmDelete(prev => ({...prev, show: false}))}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );  
}