export const GeneralNotes = ({ generalNotes, onGeneralNotesChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-2 print:border-none print:shadow-none print:p-0">
            <h3 className="font-bold text-gray-800">
                General Notes / Thoughts
            </h3>
            <textarea
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                placeholder="Overall impressions, neighborhood vibe, etc."
                value={generalNotes}
                onChange={(e) => onGeneralNotesChange(e.target.value)}
            />
        </div>
    );
};