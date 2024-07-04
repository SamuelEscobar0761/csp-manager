import React, { useCallback, useEffect, useState } from "react";
import { getInformationObjects, addInformationObject, deleteInformationObject } from "../services/FirebaseService";
import InformationObject from '../interfaces/InformationObject';
import InformationCard from "../components/InformationCard";

export const MainLayout = ({ page, component }: { page: string, component: string }) => {
    const [informationObjects, setInformationObjects] = useState<InformationObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean, imageKey?: string, imageName?: string }>({ show: false });

    const handleDeleteClick = (imageKey: string, imageName: string) => {
        setConfirmDelete({ show: true, imageKey, imageName });
    };    

    const deleteImage = async () => {
    if (confirmDelete.imageKey) {
        const response = await deleteInformationObject(confirmDelete.imageKey);
        if (response.success) {
            setConfirmDelete({ show: false });
            await loadImages(); // Recargar las imágenes después de borrar
        } else {
            alert('No se pudo borrar la imagen');
        }
    }
};

const cancelDelete = () => {
    setConfirmDelete({ show: false });
};


    // Encapsula la función de carga en useCallback para evitar redefiniciones innecesarias
    const loadImages = useCallback(async () => {
        setLoading(true);
        try {
            const infoImages = await getInformationObjects(page, component);
            setInformationObjects(infoImages);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, component]);

    // Cargar imágenes al montar y cuando cambian las dependencias
    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleAddButtonClick = () => {
        setShowDialog(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setImageFile(file);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (imageFile && imageName) {
            const response = await addInformationObject(imageFile, component, imageName, page);
            if (response.success) {
                setShowDialog(false);
                setImageFile(null);
                setImageName("");
                await loadImages(); // Asegúrate de recargar las imágenes solo después de la subida exitosa
            } else {
                alert(response.message);
            }
        }
    };

    if (loading) {
        return <div><p>Cargando...</p></div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {informationObjects.map((item, index) => (
                    <InformationCard
                        imageKey={item.key}
                        imageUrl={item.url!}
                        onEdit={() => { }}
                        onDelete={() => handleDeleteClick(item.key, item.name)}
                        key={index}
                    />
                ))}
            </div>
            <button onClick={handleAddButtonClick} className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <span className="text-xl">+</span>
            </button>
            {confirmDelete.show && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg space-y-4">
                        <p className="text-center text-lg font-semibold">Estás a punto de borrar la imagen {confirmDelete.imageName}. Esta acción no se puede deshacer. ¿Estás seguro?</p>
                        <div className="flex justify-around">
                            <button onClick={deleteImage} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Borrar</button>
                            <button onClick={cancelDelete} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {showDialog && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg space-y-4">
                        <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
                        <input type="text" placeholder="Nombre de la imagen" value={imageName} onChange={(e) => setImageName(e.target.value)} className="p-2 border rounded" />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                        <button type="button" onClick={() => setShowDialog(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    );
};
