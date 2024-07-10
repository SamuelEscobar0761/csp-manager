import { useCallback, useEffect, useState } from "react";
import NewsObject from "../interfaces/NewsObject";
import { getNews } from "../services/FirebaseService";
import { NewsCard } from "../components/NewsCard";

export const NewsPage = ({ page, component }: { page: string, component: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newsInformationObjects, setNewsInformationObjects] = useState<NewsObject[]>([]);
    
    // Encapsula la función de carga en useCallback para evitar redefiniciones innecesarias
    const loadNews = useCallback(async () => {
        setLoading(true);
        try {
            const infoNews = await getNews();
            console.log(infoNews);
            setNewsInformationObjects(infoNews);
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
        <div>
            {newsInformationObjects.map((item, index) =>(
                <div key={index}>
                    <NewsCard key={item.key} date={item.date} description={item.description} title={item.title} url={item.url!} onEdit={()=>{}} onDelete={() => {}}/>
                </div>
            ))}
        </div>
    );
}