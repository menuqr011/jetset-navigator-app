
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane } from "lucide-react";
import { airports, Airport } from "@/data/airports";
import { cn } from "@/lib/utils";

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: "origin" | "destination";
  required?: boolean;
}

const AirportAutocomplete = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  icon = "origin",
  required = false 
}: AirportAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = airports.filter(airport => 
        airport.city.toLowerCase().includes(value.toLowerCase()) ||
        airport.code.toLowerCase().includes(value.toLowerCase()) ||
        airport.name.toLowerCase().includes(value.toLowerCase()) ||
        airport.country.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Limit to 8 results
      
      setFilteredAirports(filtered);
      setIsOpen(filtered.length > 0);
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
      setFilteredAirports([]);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleOptionClick = (airport: Airport) => {
    onChange(airport.city);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredAirports.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredAirports[highlightedIndex]) {
          handleOptionClick(filteredAirports[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor={label.toLowerCase()} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Plane className={cn(
          "absolute left-3 top-3 w-4 h-4 text-gray-400",
          icon === "destination" && "rotate-90"
        )} />
        <Input
          ref={inputRef}
          id={label.toLowerCase()}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setIsOpen(filteredAirports.length > 0)}
          className="pl-10"
          required={required}
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {filteredAirports.map((airport, index) => (
            <div
              key={airport.code}
              className={cn(
                "px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50",
                index === highlightedIndex && "bg-blue-50"
              )}
              onClick={() => handleOptionClick(airport)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{airport.city}</div>
                  <div className="text-sm text-gray-600 truncate">{airport.name}</div>
                  <div className="text-xs text-gray-500">{airport.country}</div>
                </div>
                <div className="ml-2 text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {airport.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
