import React from 'react';

import { useState } from "react";
import { Chip } from "@material-tailwind/react"

const TableComponent = ({ data }) => {
    const [sortBy, setSortBy] = useState('CVEid'); // Default sorting column
    const [sortAsc, setSortAsc] = useState(true); // Default sorting order

    // Function to toggle sorting order
    const toggleSortOrder = () => {
        setSortAsc(!sortAsc);
    };

    // Function to handle column header click
    const handleHeaderClick = (column) => {
        if (sortBy === column) {
            // If the same column is clicked, toggle the sorting order
            toggleSortOrder();
        } else {
            // If a different column is clicked, set it as the sorting column
            setSortBy(column);
            setSortAsc(true); // Reset sorting order to ascending
        }
    };

    // Sort the data based on the sorting criteria
    const sortedData = [...data].sort((a, b) => {
        if (sortAsc) {
            return a[sortBy].localeCompare(b[sortBy]);
        } else {
            return b[sortBy].localeCompare(a[sortBy]);
        }
    });

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table" >
                <thead className="bg-gray-50">
                    <tr>
                        <th onClick={() => handleHeaderClick('CVEid')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CVE ID {sortBy === 'CVEid' && (sortAsc ? '↑' : '↓')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Link
                        </th>
                        <th onClick={() => handleHeaderClick('PkgName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Package Name{sortBy === 'PkgName' && (sortAsc ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleHeaderClick('PkgVersion')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Package Version{sortBy === 'PkgVersion' && (sortAsc ? '↑' : '↓')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th onClick={() => handleHeaderClick('Severity')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Severity{sortBy === 'Severity' && (sortAsc ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleHeaderClick('Severity')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CVE Score{sortBy === 'Severity' && (sortAsc ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleHeaderClick('Severity')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fixed Version {sortBy === 'Severity' && (sortAsc ? '↑' : '↓')}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.CVEid}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <a
                                    href={item.Link}
                                    className="text-blue-500 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.Link}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.PkgName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.PkgVersion}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.Type}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-max ">
                                    <div className={'rounded-xl p-1 px-3'} style={{
                                        backgroundColor: item.severity === "Low" ? "green" : item.severity === "Mdium" ? "orange" : "red"
                                        /*backgroundColor:{
                                        item.Severity == "Low"
                                        ? "green"
                                        : item.Severity == "Medium"
                                        ? "amber"
                                        : "red"
                                    }*/
                                    }}
                                    >
                                        {item.Severity}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.cveScore}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.PkgFixedVersion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
