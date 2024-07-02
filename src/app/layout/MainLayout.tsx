import React, { useEffect, useState } from "react";
import { getInformationObjects, getUrl, addInformationObject } from "../services/FirebaseService";
import InformationObject from '../interfaces/InformationObject';
import InformationCard from "../components/InformationCard";

export const MainLayout = ({ page, component }: { page: string, component: string }) => {
    const [informationObjects, setInformationObjects] = useState<InformationObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");

    useEffect(() => {
        const loadImages = async () => {
            setLoading(true);
            try {
                const infoImages = await getInformationObjects(page, component);
                const infoImagesWithUrls = await Promise.all(
                    infoImages.map(async (image) => ({
                        ...image,
                        url: await getUrl(image.path)
                    }))
                );
                setInformationObjects(infoImagesWithUrls);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener las imágenes:', error);
            }
        };
        loadImages();
    }, [page, component]);

    const handleAddButtonClick = () => {
        setShowDialog(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setImageFile(file);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (imageFile) {
            const response = await addInformationObject(imageFile, component, imageName, page);
            if (response.success) {
                setShowDialog(false);
                setImageFile(null);
                setImageName("");
                // Reload images
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
                        imageUrl={item.url!}
                        onDelete={() => { }}
                        onEdit={() => { }}
                        key={index}
                    />
                ))}
            </div>
            <button onClick={handleAddButtonClick} className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <span className="text-xl">+</span>
            </button>
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
