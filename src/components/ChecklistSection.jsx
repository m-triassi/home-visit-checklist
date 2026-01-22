import { ChecklistItem } from './ChecklistItem';

export const ChecklistSection = ({ 
    section, 
    checklistState, 
    expandedItems, 
    onToggleStatus, 
    onToggleExpand, 
    onNoteChange,
    getStatusColor 
}) => {
    return (
        <div key={section.id} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide px-1 pt-2">
                {section.title}
            </h3>

            {section.items.map((item) => {
                const state = checklistState[item.id] || {};
                const isExpanded = expandedItems[item.id] || false;

                return (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        state={state}
                        isExpanded={isExpanded}
                        onToggleStatus={onToggleStatus}
                        onToggleExpand={onToggleExpand}
                        onNoteChange={onNoteChange}
                        getStatusColor={getStatusColor}
                    />
                );
            })}
        </div>
    );
};