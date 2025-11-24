'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { getPlacePredictionsAction } from '@/app/actions';

interface LocationComboboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function LocationCombobox({ value, onChange, placeholder = "Location" }: LocationComboboxProps) {
    const [inputValue, setInputValue] = useState(value);
    const [predictions, setPredictions] = useState<{ description: string; placeId: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchPredictions = async () => {
            if (inputValue.length < 3) {
                setPredictions([]);
                return;
            }

            setIsLoading(true);
            try {
                const results = await getPlacePredictionsAction(inputValue);
                setPredictions(results);
                setIsOpen(true);
            } catch (error) {
                console.error('Failed to fetch predictions', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchPredictions, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    const handleSelect = (description: string) => {
        setInputValue(description);
        onChange(description);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                type="text"
                className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500 h-full"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    onChange(e.target.value);
                }}
                onFocus={() => inputValue.length >= 3 && setIsOpen(true)}
            />

            {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
            )}

            {isOpen && predictions.length > 0 && (
                <div className="absolute z-50 w-[calc(100%+2rem)] -left-4 mt-4 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto py-2">
                    {predictions.map((prediction) => (
                        <button
                            key={prediction.placeId}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 flex items-center gap-2 transition-colors"
                            onClick={() => handleSelect(prediction.description)}
                        >
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="truncate">{prediction.description}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
