import React, {useState} from "react";
import Modal from "./UpdatesDialog";
const CheckUpdates = ()=>{
    const [showModal, setShowModal] = useState(false);
    return(
        <>
        <button
            className="border-lime-500 border-2  h-80 rounded-lg px-4 py-2 mx-2 select-none  py-1 px-3 text-center align-middle  text-xs uppercase text-lime-600 shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true" onClick={() => setShowModal(true)}>
            Check Updates</button>
            <Modal showModal={showModal} setShowModal={setShowModal} />
        </>
    )
}
export default CheckUpdates