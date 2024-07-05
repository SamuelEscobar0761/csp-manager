const InformationCard = ({ imageName, imageUrl, disableDeleteButton, newsView, onEdit, onDelete }: {imageName: string, imageUrl: string, disableDeleteButton: boolean, newsView: boolean, onEdit: any, onDelete: any}) => {
  // Si es vista de noticias, no mostramos nada (o personaliza según necesidad)
  if (newsView) {
    return null;
  }

  // Si no es vista de noticias, mostramos la tarjeta normalmente
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-2">
      <img className="w-full" src={imageUrl} alt={imageName} />
      <p>{imageName}</p>
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <button 
          onClick={() => onEdit()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        {!disableDeleteButton && (
          <button 
            onClick={() => onDelete()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default InformationCard;
