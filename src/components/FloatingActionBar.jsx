import { Printer, Download } from "lucide-react";

export const FloatingActionBar = ({ onPrint, onShowExportModal }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 print:hidden">
            <div className="max-w-3xl mx-auto flex gap-3">
                <button
                    onClick={onPrint}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <Printer size={20} />
                    <span className="hidden sm:inline">Print</span>
                </button>
                <button
                    onClick={onShowExportModal}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Download size={20} />
                    <span>Export Markdown</span>
                </button>
            </div>
        </div>
    );
};