import { Home, Trash2 } from "lucide-react";
import { PropertyDropdown } from "./PropertyDropdown";

export const Header = ({ 
    onReset, 
    properties, 
    activePropertyId, 
    onSelectProperty, 
    onDeleteProperty, 
    onAddProperty 
}) => {
    return (
        <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-40 print:hidden">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Home className="h-6 w-6" />
                        <h1 className="text-lg font-bold">Home Evaluator</h1>
                    </div>
                    
                    <PropertyDropdown
                        properties={properties}
                        activePropertyId={activePropertyId}
                        onSelectProperty={onSelectProperty}
                        onDeleteProperty={onDeleteProperty}
                        onAddProperty={onAddProperty}
                    />
                </div>
                
                <button
                    onClick={onReset}
                    className="text-xs bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded flex items-center space-x-1 border border-blue-700 transition-colors"
                >
                    <Trash2 size={14} />
                    <span>Reset</span>
                </button>
            </div>
        </header>
    );
};