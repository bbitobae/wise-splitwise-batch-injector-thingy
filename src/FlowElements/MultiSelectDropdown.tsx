import { useState, useRef, useEffect, ReactNode } from 'react';

interface MultiSelectFilterProps {
    options: string[];
    onFilterChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelectDropdown = ({
                               options,
                               onFilterChange,
                               placeholder = 'Select filters',
                               className = ''
                           }: MultiSelectFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([...options]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        setSelected(newSelected);
        onFilterChange(newSelected);
    };

    const handleSelectAll = () => {
        if (selected.length === options.length) {
            setSelected([]);
            onFilterChange([]);
        } else {
            setSelected(options);
            onFilterChange(options);
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left border rounded-lg bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls="multi-select-options"
            >
        <span className="flex items-center justify-between">
          <span>
            {selected.length === 0
                ? placeholder
                : `${selected.length} selected`}
          </span>
          <span className="material-icons text-base">
            {isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </span>
            </button>

            {isOpen && (
                <div
                    id="multi-select-options"
                    className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                >
                    <div className="p-2 border-b">
                        <button
                            onClick={handleSelectAll}
                            className="w-full text-left text-sm text-blue-600 hover:underline focus:outline-none"
                            aria-label={selected.length === options.length ? 'Deselect all' : 'Select all'}
                        >
                            {selected.length === options.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => toggleOption(option)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between ${
                                selected.includes(option) ? 'bg-blue-50 text-blue-700' : ''
                            }`}
                            aria-checked={selected.includes(option)}
                            role="option"
                            aria-selected={selected.includes(option)}
                        >
                            {option}
                            {selected.includes(option) && (
                                <span className="material-icons text-blue-600 text-base">check</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};