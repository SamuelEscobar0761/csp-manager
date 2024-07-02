import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, push, set } from "firebase/database";
import {getStorage, ref as refStorage, uploadBytes, getDownloadURL} from "firebase/storage";
import InformationObject from '../interfaces/InformationObject';

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
      name: string;
      page: string;
      component: string;
      path: string;
  };
}

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCiXm7xzyou9GySZ7Y7x1tmm6CYs-BBars",
    authDomain: "club-social-petrolero.firebaseapp.com",
    databaseURL: "https://club-social-petrolero-default-rtdb.firebaseio.com",
    projectId: "club-social-petrolero",
    storageBucket: "club-social-petrolero.appspot.com",
    messagingSenderId: "95503166689",
    appId: "1:95503166689:web:e8ba558c1aa1daebf25ba0",
    measurementId: "G-G9RMY72TFT"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage();

export const getUrl = async (path: string): Promise<string | null> => {
  try {
    const fileRef = refStorage(storage, path);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;  // Esto ahora devuelve la URL de descarga directa
  } catch (error) {
    console.error('Error al obtener la URL del file', error);
    return null;
  }
};

export const getInformationObjects = async (pagina: string, componente: string): Promise<InformationObject[]> => {
    const imagenesRef = dbRef(db, 'images');  // Asegúrate de que el path 'images' es correcto según tu base de datos
    try {
        const snapshot = await get(imagenesRef);
        const imagesData = snapshot.val();
        let images: InformationObject[] = [];
        if (imagesData) {
            // Filtrar por 'page' y extraer los datos completos que cumplen con la interfaz Image
            Object.keys(imagesData).forEach(key => {
                if (imagesData[key].page === pagina && imagesData[key].component === componente) {
                    images.push({
                        key: key,
                        page: imagesData[key].page,
                        component: imagesData[key].component,
                        name: imagesData[key].name,
                        path: imagesData[key].path,
                        url: null,  // Inicialmente, url es null hasta que se actualice con la URL real
                    });
                }
            });
        }
        return images;
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        return [];
    }
};

/**
 * Función para agregar un objeto de información y subir una imagen a Firebase.
 * @param imageFile - Archivo de imagen para subir.
 * @param component - Componente al cual pertenece la imagen.
 * @param name - Nombre de la imagen.
 * @param page - Página a la que pertenece la imagen.
 * @returns Promise<UploadResponse>
 */
export const addInformationObject = async (
  imageFile: File, 
  component: string, 
  name: string, 
  page: string
): Promise<UploadResponse> => {
  const timestamp = new Date().getTime();
  const storagePath = `images/${page}/${component}/${timestamp}_${imageFile.name}`;

  try {
    // Referencia al lugar donde se guardará la imagen en Storage
    const storageRef = refStorage(storage, storagePath);
    
    // Subir imagen a Firebase Storage
    await uploadBytes(storageRef, imageFile);

    // Crear un nuevo nodo en la database para guardar los detalles
    const newInfoRef = push(dbRef(db, 'images'));
    await set(newInfoRef, {
        component: component,
        name: name,
        page: page,
        path: storagePath  // Guardar el path de Storage para referencia futura
    });

    return { success: true, message: "Imagen y datos subidos correctamente", data: { name, page, component, path: storagePath } };
  } catch (error) {
    console.error('Error al subir imagen y datos:', error);
    return { success: false, message: 'Error al subir imagen y datos' };
  }
};

const editInformationObject = () => {

}

const deleteInformationObject = () => {

}