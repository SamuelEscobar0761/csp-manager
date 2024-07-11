import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

export const RegulationCard = ({ name, url, onEdit, onDelete }: { name: string, url: string, onEdit: any, onDelete: any }) => {
    return(
    <div className="bg-gray-100 pt-5 px-5 rounded">
      <div className="flex justify-end ...">
        <button onClick={() => {onEdit()}} className="text-white bg-blue-500 rounded p-2 w-10 h-10"><EditOutlinedIcon/></button>
        <button onClick={() => {onDelete()}} className="ml-2 text-white bg-red-500 rounded py-2 w-10 h-10"><DeleteOutlineOutlinedIcon/></button>
      </div>
      <div className="flex h-full py-5 justify-start ... ">
        <div>
            <img src='/pdf_icon.png' className="w-[50px] h-[50px]"/>
        </div>
        <div className="flex-1 ml-4 ">
            <a href={url} target="_blank" className="break-words underline"> {/* break-words permite que el texto se ajuste y rompa correctamente */}
              {name}
            </a>
          </div>
        </div>
      </div>
    );
}