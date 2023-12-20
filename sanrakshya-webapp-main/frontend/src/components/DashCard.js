import React from "react";
import ShareButton from "./ShareButton";
import Download from "./downloadMenu";
import {useNavigate} from "react-router-dom";
import CheckUpdates from "./CheckUpdates";


const DashCard = ({ data }) => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/home?id=${id}`);
    };
    return (
        <>
            {data.map((item, index) => (
                <div key={index} className="min-h-[70px] flex bg-slate-200 rounded-lg hover:shadow-md py-2 px-4 mx-2 mb-4"    >
                    <div className="flex-1 self-center">
                        <p className="text-xl font-semibold">{item.project_name}</p>
                    </div>
                    <div className="self-center px-8">
                        <span className="font-semibold">Last scanned:</span>
                        <span> {item.date}</span>
                    </div>
                    <div className="flex justify-between px-4 ">
                        <div className="flex justify-around self-center my-auto">
                            <div className="rounded-3xl w-[30px] h-[30px] text-center bg-lime-400 mx-2 my-auto">{item.low_count}</div>
                            <div className="rounded-3xl w-[30px] h-[30px] text-center bg-orange-400 mx-2 my-auto">{item.medium_count}</div>
                            <div className="rounded-3xl w-[30px] h-[30px] text-center bg-red-600 mx-2 my-auto">{item.high_count}</div>
                        </div>

                        <div className="flex justify-around pt-2 pl-8  ">
                            <CheckUpdates/>
                            <Download/>
                            <button className={"bg-slate-800 text-slate-200 h-80 rounded-lg px-4 py-2 mx-2 select-none  py-1 px-3 text-center align-middle  text-xs uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"} onClick={() => handleClick(item.id)}>view</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default DashCard