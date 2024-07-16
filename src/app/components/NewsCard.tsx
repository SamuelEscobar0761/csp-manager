import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
export const NewsCard = ({date, description, title, url, onEdit, onDelete}: {date: string, description: string, title: string, url: string, onEdit: any, onDelete: any}) => {
    return(
        <div className="p-5 m-5 bg-gray-100 rounded">
        {title != 'Comunicado'?(
          <div>
            <div className="flex">
              <h3 className="flex-1 text-2xl">{title}: {date}</h3>
              <div className="flex justify-end ...">
                <button onClick={() => {onEdit()}} className="text-white bg-blue-500 rounded p-2 w-10 h-10"><EditOutlinedIcon/></button>
                <button onClick={() => {onDelete()}} className="ml-2 text-white bg-red-500 rounded py-2 w-10 h-10"><DeleteOutlineOutlinedIcon/></button>
              </div>
            </div>
            <div className="flex h-auto">
              <img src={url} className="h-96 w-auto"/>
              <div className="ml-5">     
                <div className="">
                <label className="text-2xl">Descripción:</label>
                </div>
                <p className="ml-4 text-xl">{description}</p>
              </div>
            </div>
          </div>
        ):(
          <div>
            <div className='flex justify-between items-center'>
              <div className="flex-1 text-center">
                <h3 className="text-2xl">{title}: {date}</h3>
              </div>
              <div className="flex">
                <button onClick={() => {onEdit()}} className="text-white bg-blue-500 rounded p-2 w-10 h-10">
                  <EditOutlinedIcon/>
                </button>
                <button onClick={() => {onDelete()}} className="ml-2 text-white bg-red-500 rounded p-2 w-10 h-10">
                  <DeleteOutlineOutlinedIcon/>
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-5">
                <img src={url} className="w-auto h-96"/>
            </div>
          </div>
        )}
      </div>
    );
}