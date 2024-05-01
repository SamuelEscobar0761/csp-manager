// Props esperadas: name, imagePath, onEdit, onDelete
const InformationCard = ({ name, imagePath, imageUrl, onEdit, onDelete }: {name: string, imagePath: string, imageUrl: string, onEdit: any, onDelete: any}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-2">
      <img className="w-full" src={imageUrl} alt={`Preview of ${name}`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <button 
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <button 
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default InformationCard;
