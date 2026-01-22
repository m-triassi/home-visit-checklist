import { Check, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { STATUS_OPTS } from '../constants/checklist';

export const ChecklistItem = ({ 
    item, 
    state, 
    isExpanded, 
    onToggleStatus, 
    onToggleExpand, 
    onNoteChange,
    getStatusColor 
}) => {
    const status = state.status || STATUS_OPTS.NONE;

    return (
        <div
            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${getStatusColor(status)}`}
        >
            {/* Item Header / Toolbar */}
            <div className="p-4 flex items-start justify-between gap-3">
                <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onToggleExpand(item.id)}
                >
                    <h4 className="font-bold text-lg leading-tight mb-1">
                        {item.label}
                    </h4>
                    <p className="text-sm opacity-80">
                        {item.description}
                    </p>
                </div>

                {/* Status Toggle Button */}
                <button
                    onClick={() => onToggleStatus(item.id)}
                    className="flex-shrink-0 h-12 w-12 rounded-full bg-white/50 hover:bg-white border-2 border-transparent hover:border-black/10 flex items-center justify-center transition-all shadow-sm"
                    title="Toggle Status"
                >
                    {status === STATUS_OPTS.PASS && (
                        <Check
                            className="text-green-600 h-7 w-7"
                            strokeWidth={3}
                        />
                    )}
                    {status === STATUS_OPTS.FAIL && (
                        <X
                            className="text-red-600 h-7 w-7"
                            strokeWidth={3}
                        />
                    )}
                    {status === STATUS_OPTS.QUESTION && (
                        <HelpCircle
                            className="text-amber-600 h-7 w-7"
                            strokeWidth={3}
                        />
                    )}
                    {status === STATUS_OPTS.NONE && (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                </button>
            </div>

            {/* Details & Notes */}
            {(isExpanded || status !== STATUS_OPTS.NONE) && (
                <div className="bg-white/50 border-t border-black/5 px-4 py-3 space-y-3">
                    {/* Look For & Ask Lists */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                        {item.lookFor && (
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">
                                    👀 Look for:
                                </span>
                                <ul className="list-disc list-outside ml-4 space-y-1">
                                    {item.lookFor.map((lf, idx) => (
                                        <li key={idx}>{lf}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {item.ask && (
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">
                                    🗣 Ask:
                                </span>
                                <p className="italic">{item.ask}</p>
                            </div>
                        )}
                    </div>

                    {/* User Notes Input */}
                    <div className="pt-2">
                        <textarea
                            placeholder={`Add notes for ${item.label}...`}
                            className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[80px]"
                            value={state.note || ""}
                            onChange={(e) => onNoteChange(item.id, e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Expand/Collapse Toggle Footer for styling */}
            <button
                onClick={() => onToggleExpand(item.id)}
                className="w-full flex justify-center items-center py-1 bg-black/5 hover:bg-black/10 text-gray-500 text-xs uppercase font-bold tracking-wider"
            >
                {isExpanded ? (
                    <ChevronUp size={14} />
                ) : (
                    <ChevronDown size={14} />
                )}
            </button>
        </div>
    );
};