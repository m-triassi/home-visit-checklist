import React, { useState, useEffect, useRef } from "react";
import {
    Check,
    X,
    HelpCircle,
    Trash2,
    Download,
    ChevronDown,
    ChevronUp,
    Clipboard,
    Home,
    MapPin,
    Hash,
    FileText,
    Printer,
} from "lucide-react";

// --- Data Structure based on User's Checklist ---

const INITIAL_SECTIONS = [
    {
        id: "structural",
        title: "Major Structural",
        items: [
            {
                id: "foundation",
                label: "Foundation",
                description:
                    "Major concern in Montreal due to clay-rich soil and freeze-thaw cycles.",
                lookFor: [
                    'Horizontal or "stair-step" cracks in basement walls',
                    "Signs of water infiltration (stains, dampness, efflorescence)",
                    "Uneven or sloping floors",
                    "Doors/windows that stick",
                ],
                ask: "Have there ever been foundation repairs? Is there a warranty?",
            },
            {
                id: "french_drain",
                label: "French Drain (Drain français)",
                description: "Critical for water management.",
                lookFor: [
                    "Check if there is a sump pump and ask if it is active",
                ],
                ask: "When was the drain last replaced/inspected? (Typical lifespan 25-30 years)",
            },
            {
                id: "roof",
                label: "Roof (Toit)",
                description: "Montreal snow/ice impact.",
                lookFor: [
                    "Curling, cracked, or missing shingles",
                    "Flat roofs: Pooling water, bubbles",
                    "Attic: Leaks, condensation, blocked soffits",
                ],
                ask: "When was the roof last replaced? (Asphalt 15-20 yrs)",
            },
            {
                id: "masonry",
                label: "Brickwork & Siding (Maçonnerie)",
                description: "External envelope condition.",
                lookFor: [
                    "Crumbling mortar (repointing needed)",
                    "Bulging/bowing bricks (structural red flag)",
                    "Large cracks",
                ],
                ask: null,
            },
            {
                id: "windows_doors",
                label: "Windows & Doors",
                description: "Insulation and seal integrity.",
                lookFor: [
                    "Condensation BETWEEN glass panes (blown seal)",
                    "Water stains on wall under windows",
                    "Drafts or gaps",
                ],
                ask: "How old are the windows?",
            },
        ],
    },
    {
        id: "systems",
        title: "Interior Systems",
        items: [
            {
                id: "electrical",
                label: "Electrical (Électricité)",
                description: "Safety and insurance compliance.",
                lookFor: [
                    "Fuses instead of breakers",
                    "Knob-and-tube wiring (pre-1950s)",
                    "Aluminum wiring (1960-70s)",
                    "Ungrounded (2-prong) outlets",
                ],
                ask: "Is panel 100A or 200A? Any recalls?",
            },
            {
                id: "plumbing",
                label: "Plumbing (Plomberie)",
                description: "Pipe material and water pressure.",
                lookFor: [
                    "Galvanized steel pipes (dull grey, pre-1960s)",
                    "Lead pipes",
                    "Signs of leaks (ceilings, under sinks)",
                    "Low water pressure (test shower+toilet)",
                ],
                ask: "Has main sewer line been replaced/inspected? (Tree roots)",
            },
            {
                id: "heating",
                label: "Heating (Chauffage)",
                description: "Furnace/Boiler health.",
                lookFor: ["Age of furnace, boiler, or heat pump"],
                ask: "System age? Hot water tank rented? Oil tank inspection date?",
            },
            {
                id: "pyrite",
                label: "Pyrite",
                description: "Backfill mineral causing swelling (1980s-90s).",
                lookFor: [
                    "Starburst/spider-web cracks in basement/garage floor",
                ],
                ask: "Has property been tested for pyrite?",
            },
            {
                id: "vermiculite",
                label: "Vermiculite Insulation",
                description:
                    "Attic insulation (pre-1990) may contain asbestos.",
                lookFor: ["Pebbly, grey-brown/silver-gold insulation in attic"],
                ask: "Is there vermiculite? Tested for asbestos?",
            },
            {
                id: "asbestos",
                label: "Asbestos (Amiante)",
                description: "Hazardous material in older finishes.",
                lookFor: [
                    "9x9 floor tiles",
                    "Ceiling tiles",
                    "Wrap on heating pipes",
                ],
                ask: null,
            },
        ],
    },
];

const STATUS_OPTS = {
    PASS: "pass",
    FAIL: "fail",
    QUESTION: "question",
    NONE: null,
};

// --- Components ---

const StatusBadge = ({ status }) => {
    if (status === STATUS_OPTS.PASS)
        return (
            <span className="inline-flex items-center text-green-700 print:text-black font-bold">
                ✅ Pass
            </span>
        );
    if (status === STATUS_OPTS.FAIL)
        return (
            <span className="inline-flex items-center text-red-700 print:text-black font-bold">
                ❌ Fail
            </span>
        );
    if (status === STATUS_OPTS.QUESTION)
        return (
            <span className="inline-flex items-center text-amber-700 print:text-black font-bold">
                ❓ Check
            </span>
        );
    return <span className="text-gray-400">Not checked</span>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default function HomeTourApp() {
    // --- State ---
    const [metadata, setMetadata] = useState({
        address: "",
        centrisId: "",
        legalWarranty: "yes", // 'yes' | 'no'
        generalNotes: "",
    });

    const [checklistState, setChecklistState] = useState({});
    const [expandedItems, setExpandedItems] = useState({});
    const [showClearModal, setShowClearModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // --- Persistence ---

    useEffect(() => {
        const savedData = localStorage.getItem("homeTourData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setMetadata(
                    parsed.metadata || {
                        address: "",
                        centrisId: "",
                        legalWarranty: "yes",
                        generalNotes: "",
                    },
                );
                setChecklistState(parsed.checklistState || {});
            } catch (e) {
                console.error("Failed to load data", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "homeTourData",
            JSON.stringify({ metadata, checklistState }),
        );
    }, [metadata, checklistState]);

    // --- Handlers ---

    const handleMetadataChange = (field, value) => {
        setMetadata((prev) => ({ ...prev, [field]: value }));
    };

    const toggleItemStatus = (itemId) => {
        setChecklistState((prev) => {
            const current = prev[itemId]?.status;
            let next;
            if (current === STATUS_OPTS.PASS) next = STATUS_OPTS.FAIL;
            else if (current === STATUS_OPTS.FAIL) next = STATUS_OPTS.QUESTION;
            else if (current === STATUS_OPTS.QUESTION) next = STATUS_OPTS.NONE;
            else next = STATUS_OPTS.PASS;

            return {
                ...prev,
                [itemId]: { ...prev[itemId], status: next },
            };
        });
    };

    const handleItemNoteChange = (itemId, note) => {
        setChecklistState((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], note },
        }));
    };

    const toggleExpand = (itemId) => {
        setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const clearForm = () => {
        setMetadata({
            address: "",
            centrisId: "",
            legalWarranty: "yes",
            generalNotes: "",
        });
        setChecklistState({});
        setExpandedItems({});
        setShowClearModal(false);
        window.scrollTo(0, 0);
    };

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
                let statusIcon = "[ ]"; // Default
                if (state.status === STATUS_OPTS.PASS) statusIcon = "[x]"; // Use standard md check for pass? Or emoji? User template used [?] but description said Check/X. Let's stick to standard markdown checkboxes but maybe emojis for clarity if preferred. User template had `[?]` actually.
                // Let's use Emojis to match the users visual style in the template description: "Items that are Checked are good / pass, items with an X are bad / fails"
                // But the template list used `- [?] **Foundation:**`.
                // I will output a clean format.

                let visualMark = "[ ]";
                if (state.status === STATUS_OPTS.PASS) visualMark = "[x]";
                if (state.status === STATUS_OPTS.FAIL) visualMark = "[-]";
                if (state.status === STATUS_OPTS.QUESTION) visualMark = "[?]";

                md += `- ${visualMark} **${item.label}**\n`;
                if (state.note) {
                    md += `    - **Note:** ${state.note}\n`;
                }
                // Add static context details only if useful or just the results?
                // User asked for return format matching template.
                // The template has look for/ask bullets. I will leave them out to keep the export clean "result" oriented,
                // OR include them if unchecked?
                // Let's keep the export focused on the findings.
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

    // --- Render Helpers ---

    const getStatusColor = (status) => {
        switch (status) {
            case STATUS_OPTS.PASS:
                return "bg-green-100 border-green-300 text-green-800";
            case STATUS_OPTS.FAIL:
                return "bg-red-100 border-red-300 text-red-800";
            case STATUS_OPTS.QUESTION:
                return "bg-amber-100 border-amber-300 text-amber-800";
            default:
                return "bg-white border-gray-200 text-gray-600";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-40 print:hidden">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Home className="h-6 w-6" />
                        <h1 className="text-lg font-bold">Home Evaluator</h1>
                    </div>
                    <button
                        onClick={() => setShowClearModal(true)}
                        className="text-xs bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded flex items-center space-x-1 border border-blue-700 transition-colors"
                    >
                        <Trash2 size={14} />
                        <span>Reset</span>
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-4 space-y-6">
                {/* Metadata Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4 print:shadow-none print:border-none print:p-0">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        Property Details
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={metadata.address}
                                    onChange={(e) =>
                                        handleMetadataChange(
                                            "address",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="123 Maple Street, Montreal"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Centris / Listing ID
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={metadata.centrisId}
                                        onChange={(e) =>
                                            handleMetadataChange(
                                                "centrisId",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="12345678"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Legal Warranty
                                </label>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() =>
                                            handleMetadataChange(
                                                "legalWarranty",
                                                "yes",
                                            )
                                        }
                                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${metadata.legalWarranty === "yes" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"}`}
                                    >
                                        ✅ Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleMetadataChange(
                                                "legalWarranty",
                                                "no",
                                            )
                                        }
                                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${metadata.legalWarranty === "no" ? "bg-white text-red-700 shadow-sm" : "text-gray-500"}`}
                                    >
                                        ❌ No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checklist Sections */}
                {INITIAL_SECTIONS.map((section) => (
                    <div key={section.id} className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide px-1 pt-2">
                            {section.title}
                        </h3>

                        {section.items.map((item) => {
                            const state = checklistState[item.id] || {};
                            const status = state.status || STATUS_OPTS.NONE;
                            const isExpanded =
                                expandedItems[item.id] ||
                                status === STATUS_OPTS.NONE; // Auto expand if unchecked? Or maybe just manual. Let's allow manual.

                            return (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${getStatusColor(status)}`}
                                >
                                    {/* Item Header / Toolbar */}
                                    <div className="p-4 flex items-start justify-between gap-3">
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() =>
                                                toggleExpand(item.id)
                                            }
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
                                            onClick={() =>
                                                toggleItemStatus(item.id)
                                            }
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
                                            {status ===
                                                STATUS_OPTS.QUESTION && (
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
                                    {(expandedItems[item.id] ||
                                        status !== STATUS_OPTS.NONE) && (
                                        <div className="bg-white/50 border-t border-black/5 px-4 py-3 space-y-3">
                                            {/* Look For & Ask Lists */}
                                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                                                {item.lookFor && (
                                                    <div>
                                                        <span className="font-bold text-gray-900 block mb-1">
                                                            👀 Look for:
                                                        </span>
                                                        <ul className="list-disc list-outside ml-4 space-y-1">
                                                            {item.lookFor.map(
                                                                (lf, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        {lf}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {item.ask && (
                                                    <div>
                                                        <span className="font-bold text-gray-900 block mb-1">
                                                            🗣 Ask:
                                                        </span>
                                                        <p className="italic">
                                                            {item.ask}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Notes Input */}
                                            <div className="pt-2">
                                                <textarea
                                                    placeholder={`Add notes for ${item.label}...`}
                                                    className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[80px]"
                                                    value={state.note || ""}
                                                    onChange={(e) =>
                                                        handleItemNoteChange(
                                                            item.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Expand/Collapse Toggle Footer for styling */}
                                    <button
                                        onClick={() => toggleExpand(item.id)}
                                        className="w-full flex justify-center items-center py-1 bg-black/5 hover:bg-black/10 text-gray-500 text-xs uppercase font-bold tracking-wider"
                                    >
                                        {expandedItems[item.id] ? (
                                            <ChevronUp size={14} />
                                        ) : (
                                            <ChevronDown size={14} />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* General Notes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-2 print:border-none print:shadow-none print:p-0">
                    <h3 className="font-bold text-gray-800">
                        General Notes / Thoughts
                    </h3>
                    <textarea
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                        placeholder="Overall impressions, neighborhood vibe, etc."
                        value={metadata.generalNotes}
                        onChange={(e) =>
                            handleMetadataChange("generalNotes", e.target.value)
                        }
                    />
                </div>
            </main>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 print:hidden">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Printer size={20} />
                        <span className="hidden sm:inline">Print</span>
                    </button>
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                    >
                        <Download size={20} />
                        <span>Export Markdown</span>
                    </button>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Clear Confirmation Modal */}
            <Modal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                title="Start Fresh?"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to clear all data? This action
                        cannot be undone. All checks and notes for the current
                        home will be erased.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowClearModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={clearForm}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm"
                        >
                            Yes, Clear All
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Export Modal */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
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
                                <Clipboard
                                    size={16}
                                    className="text-gray-600"
                                />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => setShowExportModal(false)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                    >
                        Done
                    </button>
                </div>
            </Modal>
        </div>
    );
}
