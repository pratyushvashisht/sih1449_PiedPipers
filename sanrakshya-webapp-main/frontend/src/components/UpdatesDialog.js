import React from 'react';

const Modal = ({ showModal, setShowModal }) => {
    return (
        <>
            {showModal ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative">
                        <button
                            className="absolute top-3 right-3 text-lg font-semibold"
                            onClick={() => setShowModal(false)}
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-4 ">All Updates Available</h2>
                        <div className={'py-4'}>get all the updates list iterate through the list of updates</div>
                       <div className={'flex justify-around'}>
                           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">Inspect</button>
                           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">Share</button>
                       </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Modal;
