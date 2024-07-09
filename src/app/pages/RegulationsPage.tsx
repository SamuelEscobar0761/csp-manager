import { useCallback, useEffect, useState } from "react";
import InformationObject from "../interfaces/InformationObject";
import { addInformationObject, deleteInformationObject, editInformationObject, getInformationObjects } from "../services/FirebaseService";
import { RegulationCard } from "../components/RegulationCard";

export const RegulationsPage = ({ page, component }: { page: string, component: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [pdfInformationObjects, setPdfInformationObjects] = useState<InformationObject[]>([]);
    const [editDialog, setEditDialog] = useState<{ show: boolean, pdfKey?: string, pdfName?: string }>({ show: false });
    const [confirmButtonEnable, setConfirmButtonEnable] = useState<boolean>(false);
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
        setConfirmButtonEnable(true);
        setEditDialog({ show: true, pdfKey: key, pdfName: pdfName });
        setNewPdf({name: pdfName});
    };

    const handleEditSubmit = async () => {
        if (editDialog.pdfKey && confirmButtonEnable) {
            setConfirmButtonEnable(false);
            const response = await editInformationObject('pdfs', editDialog.pdfKey, newPdf.file? newPdf.file : null, newPdf.name!);
            if (response.success) {
                setEditDialog({ show: false });
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
        setConfirmButtonEnable(true);
        setConfirmDelete({ show: true, pdfKey: pdfKey });
    };

    const handleDeleteConfirm = async () => {
        if (confirmDelete.pdfKey && confirmButtonEnable) {
            setConfirmButtonEnable(false);
            const result = await deleteInformationObject('pdfs', confirmDelete.pdfKey);
            if (result.success) {
                setConfirmDelete({ show: false });
                loadPdfs();  // Recargar la lista de PDFs
            } else {
                alert(result.message);
            }
        }
    };

    // Función para manejar la subida de un nuevo PDF
    const handleNewPdfSubmit = async () => {
        if (newPdf.file && newPdf.name && confirmButtonEnable) {
            setConfirmButtonEnable(false);
            const result = await addInformationObject('pdfs', newPdf.file, component, newPdf.name, page);
            if (result.success) {
                setShowAddDialog(false);
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

    if (loading) {
        return <div><p>Cargando...</p></div>;
    }
    
    return(
        <div>
            <h2 className="px-5 py-10 text-7xl">Reglamentos</h2>
            <div className="grid grid-cols-3 gap-5 auto-rows-min px-5">
                {pdfInformationObjects.map((item, index) =>(
                    <RegulationCard key={item.key} name={item.name} url={item.url!} onEdit={() => handleEditClick(item.key, item.name)} onDelete={() => handleDeleteClick(item.key)}/>
                ))}
            </div>
        </div>
    
    );
}
