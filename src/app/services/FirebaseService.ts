import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, push, set, remove, update } from "firebase/database";
import {getStorage, ref as refStorage, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import InformationObject from '../interfaces/InformationObject';
import NewsObject from "../interfaces/NewsObject";
import { getAuth, signOut } from 'firebase/auth';

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

interface UpdateNews {
  date?: string;
  description?: string;
  image?: string;
  title?: string;
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
  let storagePath = "";
  if(type === 'images'){
    storagePath = `${type}/${page}/${component}/${timestamp}_${imageFile.name}`;
  }else if(type === 'pdfs'){
    storagePath = `${type}/${timestamp}_${imageFile.name}`;
  }

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

      // Si hay un nuevo archivo de imagen, primero eliminar el antiguo
      if (newImageFile) {
        // Eliminar el archivo antiguo de Firebase Storage si existe
        const oldStorageRef = refStorage(storage, imageData.path);
        await deleteObject(oldStorageRef);

        // Subir el nuevo archivo y actualizar la URL y path
        let newImagePath = "";
        if(type === 'images'){
          newImagePath = `${type}/${imageData.page}/${imageData.component}/${Date.now()}_${newImageFile.name}`;
        }else if(type === 'pdfs'){
          newImagePath = `${type}/${Date.now()}_${newImageFile.name}`;
        }
        const newStorageRef = refStorage(storage, newImagePath);
        const uploadResult = await uploadBytes(newStorageRef, newImageFile);
        const newImageUrl = await getDownloadURL(uploadResult.ref);

        updates.path = newImagePath;
        updates.url = newImageUrl;
      }

      // Verificar si el nombre ha cambiado y actualizarlo si es necesario
      if (newName && newName !== imageData.name) {
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

const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // Meses en JavaScript son 0-indexados (Enero = 0)
};


export const getNews = async(): Promise<NewsObject[]> => {
  const newsRef = dbRef(db, "news");
  try {
      const snapshot = await get(newsRef);
      const newsData = snapshot.val();
      let news: NewsObject[] = [];
      if (newsData) {
          // Extraer los datos completos que cumplen con la interfaz NewsObject
          Object.keys(newsData).forEach(key => {
              news.push({
                  key: key,
                  date: newsData[key].date,
                  description: newsData[key].description,
                  image: newsData[key].image,
                  title: newsData[key].title,
                  url: newsData[key].url,
              });
          });
          // Ordenar noticias por fecha de más reciente a más antigua
          news.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
      }
      return news;
  } catch (error) {
      console.error('Error al obtener noticias:', error);
      return [];
  }
};


export const addNews = async (title: string, description: string, date: string, imageFile: File): Promise<{ success: boolean; message: string }> => {
  try {
      // Subir la imagen primero a Firebase Storage
      const storagePath = `images/news/${imageFile.name}`;
      const imageRef = refStorage(storage, storagePath);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Si no hay titulo proporcionado asumimos que se trata de un comunicado
      if(!title){
        title = "Comunicado";
      }

      // Guardar la información de la noticia en la base de datos
      const newsData = {
          title: title,
          description: description,
          date: date,
          image: storagePath,
          url: imageUrl
      };
      const newsRef = push(dbRef(db, 'news'));
      await set(newsRef, newsData);

      return { success: true, message: "Noticia agregada correctamente" };
  } catch (error) {
      console.error('Error al agregar noticia:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export const editNews = async(
    key: string,
    type: string,
    title: string, 
    description: string,
    date: string,
    imageFile: File | null
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const infoRef = dbRef(db, `news/${key}`);
      const snapshot = await get(infoRef);
      if (snapshot.exists()) {
        const newsData = snapshot.val() as { date: string, description: string, image: string, title: string, url: string };
  
        let updates: UpdateNews = {};
  
        // Si hay un nuevo archivo de imagen, primero eliminar el antiguo
        if (imageFile) {
          // Eliminar el archivo antiguo de Firebase Storage si existe
          const oldStorageRef = refStorage(storage, newsData.image);
          await deleteObject(oldStorageRef);
  
          // Subir el nuevo archivo y actualizar la URL y path
          const newImagePath = `images/news/${Date.now()}_${imageFile.name}`;
          const newStorageRef = refStorage(storage, newImagePath);
          const uploadResult = await uploadBytes(newStorageRef, imageFile);
          const newImageUrl = await getDownloadURL(uploadResult.ref);
  
          updates.image = newImagePath;
          updates.url = newImageUrl;
        }

        if(type === 'comunicado'){
          updates.title = "Comunicado";
          updates.description = "";
        }
  
        // Verificar si el titulo ha cambiado y actualizarlo si es necesario
        if (title && title !== newsData.title) {
          updates.title = title;
        }

        // Verificar si la descripción ha cambiado y actualizarla si es necesario
        if (description && description !== newsData.description) {
          updates.description = description;
        }

        // Verificar si la fecha ha cambiado y actualizarlo si es necesario
        if (date && date !== newsData.date) {
          updates.date = date;
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
}

export const deleteNews = async(key: string): Promise<{success: boolean, message?:string}> => {
  try {
    // Referencia al nodo específico en la base de datos
    const dbPath = dbRef(db, `news/${key}`);
    // Obtener el path de la imágen en el storage antes de eliminarlo de la base de datos
    const snapshot = await get(dbPath);
    if (snapshot.exists()) {
        const data = snapshot.val();
        // Referencia al archivo en el storage
        const storagePath = refStorage(storage, data.image);

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
}


export const logoutUser = async (): Promise<void> => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("Sesión cerrada con éxito");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
