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
            <div>
            
            </div>
        );
    }

    return(
        <div className="w-full py-5">
            {pdfInformationObjects.map((item, index) =>(
              <div className="h-screen flex justify-start ..." key={index}>
                <iframe src={item.url!} className='pl-20 pr-5 w-2/3 h-full'/>
                <div className="bg-gray-200 w-3/12 h-1/6 rounded">
                  <h2 className="text-5xl pl-5 pt-2">Estatuto</h2>
                  <div className="m-5">
                    <p className="mr-2 text-xl">Nombre del documento: {item.name}</p>
                  </div>
                  <div className="m-5 flex justify-end ...">
                    <button onClick={() => {}} className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Editar</button>
                    <button onClick={() => {}} className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Borrar</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={()=>{}} className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <span className="text-xl">+</span>
            </button>
        </div>
    );  
}