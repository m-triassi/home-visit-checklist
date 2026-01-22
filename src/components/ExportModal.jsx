import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { Modal } from './Modal';

export const ExportModal = ({ isOpen, onClose, metadata, checklistState, INITIAL_SECTIONS, STATUS_OPTS }) => {
    const [isCopied, setIsCopied] = useState(false);

    const generateMarkdown = () => {
        const warrantyIcon = metadata.legalWarranty === "yes" ? "✅" : "❌";

        let md = `### Home Visit Checklist\n\n`;
        md += `**Address**: ${metadata.address}\n`;
        md += `**Centris Listing ID**: ${metadata.centrisId}\n`;
        md += `**Legal Warranty**: ${warrantyIcon}\n\n`;
        md += `*Items that are Checked are good / pass, items with an X are bad / fails*\n`;

        INITIAL_SECTIONS.forEach((section) => {
            md += `#### ${section.title}\n\n`;
            section.items.forEach((item) => {
                const state = checklistState[item.id] || {};
                let visualMark = "[ ]";
                if (state.status === STATUS_OPTS.PASS) visualMark = "[x]";
                if (state.status === STATUS_OPTS.FAIL) visualMark = "[-]";
                if (state.status === STATUS_OPTS.QUESTION) visualMark = "[?]";

                md += `- ${visualMark} **${item.label}**\n`;
                if (state.note) {
                    md += `    - **Note:** ${state.note}\n`;
                }
            });
            md += `\n`;
        });

        if (metadata.generalNotes) {
            md += `#### General Notes\n\n${metadata.generalNotes}\n`;
        }

        return md;
    };

    const copyToClipboard = () => {
        const text = generateMarkdown();
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Export Data"
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    Copy the text below and paste it into Notion, Obsidian,
                    or your email.
                </p>
                <div className="relative">
                    <textarea
                        readOnly
                        className="w-full h-64 p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs focus:outline-none resize-none"
                        value={generateMarkdown()}
                    />
                    <button
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 bg-white shadow-sm border p-2 rounded hover:bg-gray-50 transition-all"
                        title="Copy to clipboard"
                    >
                        {isCopied ? (
                            <Check size={16} className="text-green-600" />
                        ) : (
                            <Clipboard size={16} className="text-gray-600" />
                        )}
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                    Done
                </button>
            </div>
        </Modal>
    );
};