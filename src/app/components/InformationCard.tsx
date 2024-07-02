// Props esperadas: imagePath, onEdit, onDelete
const InformationCard = ({ imageUrl, onEdit, onDelete }: {imageUrl: string, onEdit: any, onDelete: any}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-2">
      <img className="w-full" src={imageUrl} />
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <button 
          onClick={onEdit()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <button 
          onClick={onDelete()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default InformationCard;
