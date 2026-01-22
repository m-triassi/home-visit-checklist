import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Home } from "lucide-react";
import { PropertyListItem } from "./PropertyListItem";

export const PropertyDropdown = ({ 
    properties, 
    activePropertyId, 
    onSelectProperty, 
    onDeleteProperty, 
    onAddProperty 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const activeProperty = properties.find(prop => prop.id === activePropertyId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddNew = () => {
        setIsOpen(false);
        onAddProperty();
    };

    const handleSelect = (propertyId) => {
        setIsOpen(false);
        onSelectProperty(propertyId);
    };

    const handleDelete = (propertyId) => {
        // Don't close dropdown on delete to allow confirmation
        onDeleteProperty(propertyId);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md border border-white/20 transition-colors min-w-0 max-w-[200px]"
            >
                <Home size={16} className="flex-shrink-0" />
                <span className="truncate text-sm font-medium">
                    {activeProperty?.name || "Select Property"}
                </span>
                <ChevronDown 
                    size={14} 
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="max-h-64 overflow-y-auto">
                        {properties.map((property) => (
                            <PropertyListItem
                                key={property.id}
                                property={property}
                                isActive={property.id === activePropertyId}
                                onSelect={handleSelect}
                                onDelete={handleDelete}
                                showDelete={properties.length > 1}
                            />
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-200 p-2">
                        <button
                            onClick={handleAddNew}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                        >
                            <Plus size={14} />
                            <span className="text-sm font-medium">Add New Property</span>
                        </button>
                    </div>

                    {properties.length > 0 && (
                        <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
                            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};