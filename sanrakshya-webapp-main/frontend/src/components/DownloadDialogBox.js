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
                        <h2 className="text-xl font-bold mb-4">Download Options</h2>
                        <div className="flex justify-center space-x-4 mb-4">
                            <button className="bg-slate-800 text-white px-4 py-2 rounded">JSON</button>
                            <button className="bg-slate-800 text-white px-4 py-2 rounded">CSV</button>
                            <button className="bg-slate-800 text-white px-4 py-2 rounded">PDF</button>
                        </div>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">Download</button>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Modal;
