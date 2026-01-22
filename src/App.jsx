import React, { useState } from "react";
import { INITIAL_SECTIONS, STATUS_OPTS } from "./constants/checklist";
import { useHomeTourData } from "./hooks/useLocalStorage";

// Components
import { Header } from "./components/Header";
import { PropertyDetails } from "./components/PropertyDetails";
import { ChecklistSection } from "./components/ChecklistSection";
import { GeneralNotes } from "./components/GeneralNotes";
import { FloatingActionBar } from "./components/FloatingActionBar";
import { ClearModal } from "./components/ClearModal";
import { ExportModal } from "./components/ExportModal";

export default function HomeTourApp() {
    // --- State ---
    const { metadata, setMetadata, checklistState, setChecklistState } = useHomeTourData();
    const [expandedItems, setExpandedItems] = useState({});
    const [showClearModal, setShowClearModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

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
            <Header onReset={() => setShowClearModal(true)} />

            <main className="max-w-3xl mx-auto p-4 space-y-6">
                {/* Metadata Card */}
                <PropertyDetails 
                    metadata={metadata} 
                    onMetadataChange={handleMetadataChange} 
                />

                {/* Checklist Sections */}
                {INITIAL_SECTIONS.map((section) => (
                    <ChecklistSection
                        key={section.id}
                        section={section}
                        checklistState={checklistState}
                        expandedItems={expandedItems}
                        onToggleStatus={toggleItemStatus}
                        onToggleExpand={toggleExpand}
                        onNoteChange={handleItemNoteChange}
                        getStatusColor={getStatusColor}
                    />
                ))}

                {/* General Notes */}
                <GeneralNotes 
                    generalNotes={metadata.generalNotes}
                    onGeneralNotesChange={(value) => handleMetadataChange("generalNotes", value)}
                />
            </main>

            {/* Floating Action Bar */}
            <FloatingActionBar 
                onPrint={() => window.print()}
                onShowExportModal={() => setShowExportModal(true)}
            />

            {/* --- Modals --- */}

            {/* Clear Confirmation Modal */}
            <ClearModal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                onClear={clearForm}
            />

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                metadata={metadata}
                checklistState={checklistState}
                INITIAL_SECTIONS={INITIAL_SECTIONS}
                STATUS_OPTS={STATUS_OPTS}
            />
        </div>
    );
}