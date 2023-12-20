import React from 'react';
import Download from "./downloadMenu";
import ProgressBar from "./ProgressBar";

const GeneratingModal = ({ showModal, setShowModal }) => {
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
                        <h2 className="text-xl font-bold mb-4">Upload Project</h2>
                        <ProgressBar/>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default GeneratingModal;
