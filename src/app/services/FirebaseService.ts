import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, push, set, remove, update } from "firebase/database";
import {getStorage, ref as refStorage, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import InformationObject from '../interfaces/InformationObject';
import NewsObject from "../interfaces/NewsObject";

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

interface UpdateData {
    name?: string;
    path?: string;
    url?: string;
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

export const getInformationObjects = async (type: 'images' | 'pdfs', pagina: string, componente: string): Promise<InformationObject[]> => {
    const imagenesRef = dbRef(db, type);  // Asegúrate de que el path 'images' es correcto según tu base de datos
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
                        url: imagesData[key].url,  // Inicialmente, url es null hasta que se actualice con la URL real
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
  type: 'images' | 'pdfs',
  imageFile: File, 
  component: string, 
  name: string, 
  page: string
): Promise<UploadResponse> => {
  const timestamp = new Date().getTime();
  const storagePath = `${type}/${page}/${component}/${timestamp}_${imageFile.name}`;

  try {
    // Referencia al lugar donde se guardará la imagen en Storage
    const storageRef = refStorage(storage, storagePath);
    
    // Subir imagen a Firebase Storage
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Crear un nuevo nodo en la database para guardar los detalles
    const newInfoRef = push(dbRef(db, type));
    await set(newInfoRef, {
        component: component,
        name: name,
        page: page,
        path: storagePath,  // Guardar el path de Storage para referencia futura
        url: downloadURL   // Guardar también la URL de descarga directa de la imagen
    });

    return { success: true, message: "Imagen y datos subidos correctamente", data: { name, page, component, path: storagePath } };
  } catch (error) {
    console.error('Error al subir imagen y datos:', error);
    return { success: false, message: 'Error al subir imagen y datos' };
  }
};

export const editInformationObject = async (
    type: 'images' | 'pdfs',
    key: string, 
    newImageFile: File | null, 
    newName: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const infoRef = dbRef(db, `${type}/${key}`);
      const snapshot = await get(infoRef);
      if (snapshot.exists()) {
        const imageData = snapshot.val() as { name: string, path: string, url: string, page: string, component: string };
  
        let updates: UpdateData = {};
        if (newImageFile) {
          // Si hay un nuevo archivo de imagen, subirlo y actualizar la URL y path
          const newImagePath = `${type}/${imageData.page}/${imageData.component}/${Date.now()}_${newImageFile.name}`;
          const imageStorageRef = refStorage(storage, newImagePath);
          const uploadResult = await uploadBytes(imageStorageRef, newImageFile);
          const newImageUrl = await getDownloadURL(uploadResult.ref);
  
          // Actualizar path y url en el objeto de actualizaciones
          updates.path = newImagePath;
          updates.url = newImageUrl;
        }
  
        // Verificar si el nombre ha cambiado y actualizarlo si es necesario
        if (newName !== imageData.name) {
          updates.name = newName;
        }
  
        // Solo llamar a update si realmente hay algo que actualizar
        if (Object.keys(updates).length > 0) {
          await update(infoRef, updates);
        }
  
        return { success: true, message: "Información actualizada correctamente." };
      } else {
        return { success: false, message: "No se encontró el objeto de información." };
      }
    } catch (error) {
      console.error('Error al editar el objeto de información:', error);
      return { success: false, message: 'Error al editar el objeto de información' };
    }
  };

type UpdatePaths = {
  [key: string]: string;  // Permite cualquier clave de string con valores de string
};

// Función para actualizar las URLs de todas las imágenes
export const updateImageUrls = async () => {
  const imagesRef = dbRef(db, 'images');
  try {
      const snapshot = await get(imagesRef);
      if (snapshot.exists()) {
          const imagesData = snapshot.val();
          const updates: UpdatePaths = {};
          for (const key in imagesData) {
              const imagePath = imagesData[key].path;
              const url = await getDownloadURL(refStorage(storage, imagePath));
              updates[`/${key}/url`] = url;  // Asumiendo que cada imagen está bajo 'images/{key}'
          }
          await update(imagesRef, updates);
          console.log('URLs actualizadas correctamente.');
      } else {
          console.log('No hay imágenes para actualizar.');
      }
  } catch (error) {
      console.error('Error al actualizar URLs:', error);
  }
};

/**
 * Función para eliminar un objeto de información y su imagen asociada en Firebase.
 * @param key - La clave del objeto en la base de datos que también indica el archivo en el storage.
 * @returns Promise que se resuelve con true si la eliminación fue exitosa o con un mensaje de error si falla.
 */
export const deleteInformationObject = async (type: 'images' | 'pdfs', key: string): Promise<{success: boolean, message?:string}> => {
  try {
      // Referencia al nodo específico en la base de datos
      const dbPath = dbRef(db, `${type}/${key}`);
      // Obtener el path del archivo en el storage antes de eliminarlo de la base de datos
      const snapshot = await get(dbPath);
      if (snapshot.exists()) {
          const data = snapshot.val();
          // Referencia al archivo en el storage
          const storagePath = refStorage(storage, data.path);

          // Eliminar archivo de Firebase Storage
          await deleteObject(storagePath);
          // Eliminar nodo de la base de datos
          await remove(dbPath);

          return { success: true, message: "Imagen eliminada correctamente" };
      } else {
          return { success: false, message: "No existe el objeto con la clave proporcionada, por favor comuniquese con el desarrollador Samuel Escobar" };
      }
  } catch (error: any) {
      console.error('Error al eliminar el objeto de información:', error);
      return { success: false, message: error.message || "Error al eliminar la imagen" };
  }
};

export const getNews = async(): Promise<NewsObject[]> => {
    return [];
}

export const editNews = async(
    key: string, 
    newImageFile: File | null, 
    newName: string
  ): Promise<{ success: boolean; message: string }> => {
    return {success: true, message: ""};
}

export const deleteNews = async(type: 'images' | 'pdfs', key: string): Promise<{success: boolean, message?:string}> => {
    return {success: true, message: ""};
}