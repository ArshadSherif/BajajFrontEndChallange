/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/ApiForm.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ApiForm() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    // Options for the multiselect dropdown
    const filterOptions = ['Numbers', 'Alphabets', 'Highest Lowercase Alphabet'];
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleGetRequest();
        try {
            const parsedInput = JSON.parse(jsonInput);
            console.log('Parsed JSON:', parsedInput);
            
            const res = await axios.post('https://bajaj-finserv-challenge-chi.vercel.app/bfhl', parsedInput);
            
            console.log('Response:', res.data);
            setResponse(res.data);
            setError('');
        } catch (err) {
            setError('Invalid JSON or error in API');
            console.error('Error:', err); // Log the error to see details
        }
    };

    const handleFilterChange = (filter: string) => {
        setSelectedFilters((prevFilters) =>
            prevFilters.includes(filter)
                ? prevFilters.filter((f) => f !== filter)
                : [...prevFilters, filter]
        );
    };
    const renderFilteredResponse = () => {
        if (!response) return null;
    
        let filteredResponse: any = {};
    
        // If Numbers filter is selected
        if (selectedFilters.includes('Numbers')) {
            filteredResponse.numbers = response.numbers;
        }
    
        // If Alphabets filter is selected
        if (selectedFilters.includes('Alphabets')) {
            filteredResponse.alphabets = response.alphabets;
        }
    
        // If Highest Lowercase Alphabet filter is selected
        if (selectedFilters.includes('Highest Lowercase Alphabet')) {
            filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
        }
        
        return filteredResponse;
    };

    const handleGetRequest = async () => {
        try {
            const res = await axios.get('https://bajaj-finserv-challenge-chi.vercel.app/bfhl');
            setResponse(res.data);
            setError('');
        } catch (err) {
            setError('Error in GET request');
        }
    };

    const filteredResponse = renderFilteredResponse();

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-foreground">BFHL Challenge</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* JSON Input */}
                <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">API Input</label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border-gray-700 dark:border-gray-300 bg-background text-foreground rounded-md shadow-sm focus:border-accent focus:ring-accent"
                        placeholder='Input here...'
                    />
                </div>
                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
    
            {/* Multiselect Filter */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-secondary">Multi Filter</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleFilterChange(option)}
                            className={`px-3 py-1 rounded-full border ${
                                selectedFilters.includes(option)
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
    
            {/* Error Handling */}
            {error && <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>}
    
            {/* Filtered Response */}
            {response && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-foreground">Filtered Response</h2>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-foreground">
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
