import React from 'react';

const Modal = ({ showModal, setShowModal, selectedFile }) => {
    return (
        <>
            {showModal ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/4">
                        <button
                            className="absolute top-3 right-3 text-lg font-semibold"
                            onClick={() => setShowModal(false)}
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-4">Upload Project</h2>
                        <div className={'flex rounded-lg px-2 py-2 bg-slate-50 my-2'}>
                            {selectedFile ? selectedFile.name : 'No file selected'}
                        </div>
                        <div className="flex justify-center space-x-4 mb-4">
                            <button className="bg-slate-800 text-white px-4 py-2 rounded">Generate SBOM</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Modal;
