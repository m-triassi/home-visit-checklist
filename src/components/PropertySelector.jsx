import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Home } from "lucide-react";
import { PropertyListItem } from "./PropertyListItem";

export const PropertySelector = ({ 
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

        // Close dropdown when scrolling
        const handleScroll = () => {
            setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('scroll', handleScroll, true);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4 print:shadow-none print:border-none print:p-0 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Current Property</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {activeProperty?.name || "No Property Selected"}
                        </p>
                    </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors min-w-0 max-w-[200px]"
                    >
                        <span className="truncate text-sm font-medium text-gray-700">
                            Switch Property
                        </span>
                        <ChevronDown 
                            size={14} 
                            className={`flex-shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
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
            </div>
        </div>
    );
};