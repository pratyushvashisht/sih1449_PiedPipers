import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import {defaults} from "chart.js/auto"
import Nav from "../components/DashboardNav";
import TableComponent from "../components/DashboardTable";
import PieChart from "../components/DashboardPieChart";
import LineChart from "../components/DahboardLineChart";
import Download from "../components/downloadMenu";
import Share from "../components/ShareButton";
import lineChart from '../data/lineChart.json'
import TableComponent2 from "../components/Table2";
import { useLocation } from 'react-router-dom';

//for charts labeling the global plugins to access opitions config
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const HomePage = () => {

    const query = new URLSearchParams(useLocation().search);
    const id = query.get('id');

    let { user, authTokens } = useContext(AuthContext)
    const [vulnerabilities, setVulnerabilites] = useState([])
    const [projectName, setProjectName] = useState([])
    const [low, setLow] = useState([])
    const [medium, setMedium] = useState([])
    const [high, setHigh] = useState([])

    // useEffect runs the following methods on each load of page
    useEffect(() => {

        // To fetch the past vulnerability data of user
        let getVulnerabilities = async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-vulnerabilities/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()
            setVulnerabilites(data.data)
            setProjectName(data.project_name)
            setLow(data.low_count)
            setMedium(data.medium_count)
            setHigh(data.high_count)
            if (response.status === 200) {
                console.log("DATA: ", data)
            } else {
                alert('ERROR: While loading the user\'s vulnerabilty data', response)
            }
        }

        getVulnerabilities()

    }, [authTokens])

    //dummy data for pie chart
    const chartData = [
        { label: 'Low', value: {low} },
        { label: 'Moderate', value: {medium} },
        { label: 'High', value: {high} },
    ];


    return (
        <div className="flex flex-col bg-gray-100 justify-around overflow-y-scroll" >

            <div className="bg-gray-950  px-6 m-0 top-0 ">
                <Nav/>
            </div>
            <div className={"p-4 heading flex justify-between"}>
                <div>
                    <p className={"text-2xl font-bold text-slate-800"} >{projectName}</p>
                    {/* <p className={"text-md text-slate-800"} >Dashboard description or the name of dashboard</p> */}
                </div>
                <div className={'flex justify-between gap-3'}>
                    <Download/>
                    <Share/>
                </div>
            </div>
            <div className="flex mb-4 flex-shrink">
                <div className=" flex-1 flex-shrink bg-gray-50 aspect-square hover:shadow-lg ease-in-out duration-300 hover:bg-white m-4 border-2 p-4 max-w-40 rounded-lg">
                    <PieChart data={chartData}/>
                </div>
                <div className=" flex-1 min-h-[400px] bg-gray-50 hover:shadow-lg ease-in-out duration-300 hover:bg-white m-4 border-2 p-4 max-w-40 rounded-lg">
                    <LineChart data={lineChart}/>
                </div>
            </div>
            <div>
                <h2 className={"p-2 text-gray-900 text-xl px-4"}> Packages</h2>
            </div>
            <div className="p-4 card-large m-0 rounded-lg">
                <TableComponent data={vulnerabilities} />
                {/*<TableComponent2/>*/}
            </div>
        </div>
    )
}


export default HomePage
