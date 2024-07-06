import { useCallback, useEffect, useState } from "react";
import { getInformationObjects } from "../services/FirebaseService";
import InformationObject from "../interfaces/InformationObject";

export const AboutUsPage = ({ page, component }: { page: string, component: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [pdfInformationObjects, setPdfInformationObjects] = useState<InformationObject[]>([]);
    
    // Encapsula la función de carga en useCallback para evitar redefiniciones innecesarias
    const loadPdfs = useCallback(async () => {
        setLoading(true);
        try {
            const infoPdfs = await getInformationObjects('pdfs', page, component);
            setPdfInformationObjects(infoPdfs);
            console.log(infoPdfs);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, component]);

    // Cargar imágenes al montar y cuando cambian las dependencias
    useEffect(() => {
        loadPdfs();
    }, [loadPdfs]);

    if(loading){
        return <div><p>Cargando...</p></div>;
    }

    if(component === 'regulations'){
        return(
            <></>
        );
    }

    return(
        <></>
    );    
}