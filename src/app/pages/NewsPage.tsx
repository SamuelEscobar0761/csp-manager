import { useCallback, useEffect, useState } from "react";
import NewsObject from "../interfaces/NewsObject";
import { getNews } from "../services/FirebaseService";

export const NewsPage = ({ page, component }: { page: string, component: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newsInformationObjects, setNewsInformationObjects] = useState<NewsObject[]>([]);
    
    // Encapsula la función de carga en useCallback para evitar redefiniciones innecesarias
    const loadNews = useCallback(async () => {
        setLoading(true);
        try {
            const infoPdfs = await getNews();
            setNewsInformationObjects(infoPdfs);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, component]);

    // Cargar imágenes al montar y cuando cambian las dependencias
    useEffect(() => {
        loadNews();
    }, [loadNews]);

    if(loading){
        return <div><p>Cargando...</p></div>;
    }

    return(
        <></>
    );
}