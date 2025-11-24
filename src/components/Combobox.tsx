'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '@/lib/constants';

interface ComboboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export function Combobox({ value, onChange, placeholder = "Select option...", required = false }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = BUSINESS_CATEGORIES.filter((category) =>
        category.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
        setOpen(true);
    };

    const handleSelect = (option: string) => {
        setInputValue(option);
        onChange(option);
        setOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500 h-full pr-8"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    required={required}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {open && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-[calc(100%+2rem)] -left-4 mt-4 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto py-2">
                    {filteredOptions.map((option) => (
                        <button
                            key={option}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 flex items-center justify-between group transition-colors"
                            onClick={() => handleSelect(option)}
                        >
                            <span>{option}</span>
                            {value === option && (
                                <Check className="w-4 h-4 text-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
