import { X, Home } from "lucide-react";

export const PropertyListItem = ({ 
    property, 
    isActive, 
    onSelect, 
    onDelete, 
    showDelete = true 
}) => {
    const handleClick = () => {
        onSelect(property.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(property.id);
    };

    return (
        <div
            className={`
                w-full flex items-center justify-between px-3 py-2 cursor-pointer 
                transition-colors group relative
                ${isActive 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }
            `}
            onClick={handleClick}
        >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Home size={14} className="flex-shrink-0" />
                <span className="truncate text-sm">
                    {property.name}
                </span>
            </div>
            
            {showDelete && (
                <button
                    onClick={handleDelete}
                    className={`
                        p-1 rounded opacity-0 group-hover:opacity-100 
                        transition-opacity flex-shrink-0 ml-2
                        ${isActive 
                            ? 'hover:bg-blue-100 text-blue-600' 
                            : 'hover:bg-red-50 text-red-600'
                        }
                    `}
                    title="Delete property"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};