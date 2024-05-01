import { useEffect, useState } from "react";
import { getInformationObjects, getUrl } from "../services/FirebaseService";
import Image from '../interfaces/Image';
import InformationCard from "../components/InformationCard";

export const MainLayout = ({page, component}: {page: string, component: string}) => {
    const [informationObjects, setInformationObjects] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadImages = async () => {
            setLoading(true);
            try {    
                // Obtener información de imágenes con todos los detalles incluyendo paths
                const infoImages = await getInformationObjects(page, component);
    
                // Obtener URLs para cada imagen usando el path de cada objeto Image
                const infoImagesWithUrls = await Promise.all(
                    infoImages.map(async (image) => ({
                        ...image,
                        url: await getUrl(image.path) // Obtener la URL real y añadirla al objeto
                    }))
                );
    
                // Establecer los estados con los datos cargados
                setInformationObjects(infoImagesWithUrls);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener las imágenes:', error);
            }
        };
        loadImages();
    }, [page, component]);

    if(loading){
        return(
            <div>
                <p>Cargando...</p>
            </div>
        )
    }
    return(
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {informationObjects.map((item, index) => (
                    <InformationCard 
                        name={item.name} 
                        imageUrl={item.url!}
                        onDelete={()=>{}} 
                        onEdit={()=>{}} 
                        key={index}
                    />
                ))}
            </div>
            <div id="add_button">
            <button className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span className="text-xl">+</span>
            </button>
            </div>
        </div>
    );
}
