import React, {useContext, useEffect, useState} from "react";
import DashCard from "../components/DashCard";
import ProjectData from "../data/ProjetData.json"
import Nav from "../components/DashboardNav";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AddProject from "../components/AddProject";
import AddButton from "../components/AddProject";
import Modal from "../components/SbomDialog"




const sampleData = [
    {
        pkgName: "Project 1",
        date: "2023-12-01",
        low: "3",
        moderate: "5",
        high: "1"
    },
    {
        pkgName: "Project 2",
        date: "2023-12-02",
        low: "2",
        moderate: "4",
        high: "6"
    },
    {
        pkgName: "Project 3",
        date: "2023-12-03",
        low: "1",
        moderate: "3",
        high: "2"
    }
];


const Dashboard = ()=>{
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setShowModal(true);
    };


    let { user, authTokens } = useContext(AuthContext)
    const[dash,setDash] = useState([])
// useEffect runs the following methods on each load of page
    useEffect(() => {

        // To fetch the past vulnerability data of user
        let getDash = async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-projects/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()
            setDash(data)
            if (response.status === 200) {
                console.log("DATA: ", data)
            } else {
                alert('ERROR: While loading the user\'s vulnerabilty data', response)
            }
        }

        getDash()

    }, [authTokens])

    return(
        <div className={' flex justify-between flex-col gap-6'}>
            <div className="bg-gray-950  px-6 m-0 top-0 ">
                <Nav/>
            </div>
            <div className={'flex justify-between mr-2'}>

                <div className={'px-8'}>
                    <p className={"text-2xl font-bold text-slate-800"} >Dashboard</p>
                    <p className={"text-md text-slate-800"} >Sanrakshya tracks and flags pull requests in the topmost vulnerable projects</p>
                </div>
                <div>
                    <AddButton onFileSelect={handleFileSelect}/>
                    <Modal showModal={showModal} setShowModal={setShowModal} selectedFile={selectedFile} />
                </div>
            </div>
            <div>

                <div className={' px-4 flex justify-between flex-grow rounded-lg bg-slate-50  py-2 font-bold mx-6 my-6 mx-8' }>
                    <p className={'self-start'}>Project Name</p>
                    <p className={'self-start'}>Date Scanned</p>
                    <p className={'self-start'}>Issues</p>
                    <p className={'self-start'}>Actions</p>
                    <p></p>
                </div>
                <div className={'px-8'} >
                    <DashCard data={dash}/>
                    <DashCard data={dash}/>
                    <DashCard data={dash}/>
                    <DashCard data={dash}/>
                    <DashCard data={dash}/>
                </div>
            </div>
        </div>
    )
}
export default Dashboard


