/*import React, {useRef} from 'react'

 const AddButton=()=>{
     const fileInputRef = useRef(null);

     const handleClick = () => {
         fileInputRef.current.click();
     };
    return(
        <div>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} />
     <button onClick={handleClick}>Add Project +</button>
        </div>

    )
}*/
import React, { useRef } from "react";



function AddButton({ onFileSelect }) {

    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file.name);
        onFileSelect(file); // Trigger the modal open
    };
    return (
        <div className={"bg-slate-800 self-center text-center flex text-slate-200 h-80 rounded-lg px-4 py-2 mx-2 select-none  py-1 px-3 text-center align-middle  text-xs uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"}>
            <button onClick={handleClick}>Add Project +</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        </div>
    );
}

export default AddButton