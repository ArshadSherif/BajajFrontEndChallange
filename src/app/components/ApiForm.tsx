/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/ApiForm.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import React-Select

export default function ApiForm() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false); // Control dropdown visibility

    // Options for the multiselect dropdown
    const filterOptions = [
        { value: 'Numbers', label: 'Numbers' },
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' }
    ];

    // Custom styles for react-select to match the dark theme
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: '#1f2937', // Dark background
            color: '#e5e7eb', // Light text color
            borderColor: '#374151', // Border color to match the design
            padding: '5px',
            boxShadow: 'none', // Remove the default box shadow
            '&:hover': {
                borderColor: '#4b5563', // Lighter border on hover
            }
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#1f2937', // Dark background for dropdown
            color: '#e5e7eb', // Light text color
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#374151' : '#1f2937', // Lighter background on hover
            color: '#e5e7eb', // Light text color
            '&:active': {
                backgroundColor: '#4b5563', // Even lighter on click
            }
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#4b5563', // Dark background for selected items
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#e5e7eb', // Light text color for selected labels
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#e5e7eb',
            '&:hover': {
                backgroundColor: '#6b7280', // Lighter background on hover
                color: 'white',
            },
        }),
    };

    // POST Request with GET first
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleGetRequest(); // Trigger GET request

        try {
            const parsedInput = JSON.parse(jsonInput); // Parse JSON to ensure validity
            console.log('Parsed JSON:', parsedInput);

            const res = await axios.post('https://bajaj-finserv-challenge-chi.vercel.app/bfhl', parsedInput);
            console.log('Response:', res.data);

            setResponse(res.data);
            setError('');
            setShowDropdown(true); // Show the dropdown after a valid submission
        } catch (err) {
            setError('Invalid JSON or error in API');
            console.error('Error:', err); // Log the error for debugging
            setShowDropdown(false); // Hide the dropdown if submission fails
        }
    };

    // Handle filter selection from react-select dropdown
    const handleFilterChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedFilters(selectedValues);
    };

    // Filter response based on selected dropdown options
    const renderFilteredResponse = () => {
        if (!response) return null;

        let filteredResponse: any = {};

        if (selectedFilters.includes('Numbers')) {
            filteredResponse.numbers = response.numbers;
        }

        if (selectedFilters.includes('Alphabets')) {
            filteredResponse.alphabets = response.alphabets;
        }

        if (selectedFilters.includes('Highest Lowercase Alphabet')) {
            filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
        }

        return filteredResponse;
    };

    // GET Request function
    const handleGetRequest = async () => {
        try {
            const res = await axios.get('https://bajaj-finserv-challenge-chi.vercel.app/bfhl');
            console.log('GET request successful:', res.data);
        } catch (err) {
            setError('Error in GET request');
            console.error('Error:', err);
        }
    };

    const filteredResponse = renderFilteredResponse();

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white"> {/* Dark background with white text */}
            <h1 className="text-2xl font-bold mb-4 text-white">BFHL Challenge</h1>

            {/* JSON Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg font-semibold text-gray-400 mb-2">API Input</label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-800 text-gray-200 p-3"  // Dark input background and light text
                        placeholder='{"data":["M","1","334","4","B"]}'
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {/* Multi-Select Dropdown - Appears after valid JSON submission */}
            {showDropdown && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400">Multi Filter</label>
                    <Select
                        isMulti
                        options={filterOptions}
                        value={filterOptions.filter(option => selectedFilters.includes(option.value))}
                        onChange={handleFilterChange}
                        className="w-full"
                        placeholder="Select filters"
                        styles={customStyles} // Apply custom styles
                    />

                </div>
            )}

            {/* Error Handling */}
            {error && <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>}

            {/* Filtered Response */}
            {response && selectedFilters.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-white">Filtered Response</h2>
                    <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg"> {/* Dark background for response */}
                        {filteredResponse && Object.keys(filteredResponse).length > 0 ? (
                            JSON.stringify(filteredResponse, null, 2)
                        ) : (
                            "No data to display. Please select a filter."
                        )}
                    </pre>
                </div>
            )}
        </div>
    );
}
