import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, file: File) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (file && name) {
      onSave(name, file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Agregar Nueva Imagen</h2>
        <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="mb-4 p-2 w-full border rounded" />
        <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Guardar
        </button>
        <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ml-2">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
