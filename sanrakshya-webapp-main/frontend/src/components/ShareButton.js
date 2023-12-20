import React from "react";

const Share = ()=>{
    return(
        <button
            className="bg-slate-800 text-slate-200 min-h-80 rounded-lg px-4 py-2 mx-2 select-none  py-2 px-3 text-center align-middle  text-xs uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true"
        >
            Share</button>
    )
}
export default Share