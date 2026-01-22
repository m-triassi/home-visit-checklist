import React, { useState } from "react";
import { INITIAL_SECTIONS, STATUS_OPTS } from "./constants/checklist";
import { usePropertyTabs } from "./hooks/useLocalStorage";

// Components
import { Header } from "./components/Header";
import { PropertySelector } from "./components/PropertySelector";
import { PropertyDetails } from "./components/PropertyDetails";
import { ChecklistSection } from "./components/ChecklistSection";
import { GeneralNotes } from "./components/GeneralNotes";
import { FloatingActionBar } from "./components/FloatingActionBar";
import { ClearModal } from "./components/ClearModal";
import { ExportModal } from "./components/ExportModal";
import { NewPropertyModal } from "./components/NewPropertyModal";

export default function HomeTourApp() {
    // --- State ---
    const {
        properties,
        activePropertyId,
        activeProperty,
        addProperty,
        deleteProperty,
        setActiveProperty,
        updateActiveProperty,
        resetAllProperties,
    } = usePropertyTabs();

    const [showClearModal, setShowClearModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);

    // --- Handlers ---

    const handleMetadataChange = (field, value) => {
        updateActiveProperty({
            metadata: {
                ...activeProperty.metadata,
                [field]: value,
            },
        });

        // Update property name if address changed and name was based on address
        if (field === "address" && activeProperty.name === activeProperty.metadata.address) {
            updateActiveProperty({
                name:
                    value.trim() ||
                    `Property ${properties.findIndex((p) => p.id === activePropertyId) + 1}`,
            });
        }
    };

    const handleItemNoteChange = (itemId, note) => {
        updateActiveProperty({
            checklistState: {
                ...activeProperty.checklistState,
                [itemId]: { ...activeProperty.checklistState[itemId], note },
            },
        });
    };

    const toggleItemStatus = (itemId) => {
        const current = activeProperty.checklistState[itemId]?.status;
        let next;
        if (current === STATUS_OPTS.PASS) next = STATUS_OPTS.FAIL;
        else if (current === STATUS_OPTS.FAIL) next = STATUS_OPTS.QUESTION;
        else if (current === STATUS_OPTS.QUESTION) next = STATUS_OPTS.NONE;
        else next = STATUS_OPTS.PASS;

        updateActiveProperty({
            checklistState: {
                ...activeProperty.checklistState,
                [itemId]: { ...activeProperty.checklistState[itemId], status: next },
            },
        });
    };

    const toggleExpand = (itemId) => {
        updateActiveProperty({
            expandedItems: {
                ...activeProperty.expandedItems,
                [itemId]: !activeProperty.expandedItems[itemId],
            },
        });
    };

    const resetAll = () => {
        resetAllProperties();
        setShowClearModal(false);
        window.scrollTo(0, 0);
    };

    const handleAddProperty = (address = "") => {
        addProperty(address);
        setShowNewPropertyModal(false);
    };

    const handleDeleteProperty = (propertyId) => {
        if (properties.length > 1) {
            deleteProperty(propertyId);
        }
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

    if (!activeProperty) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
            {/* Header */}
            <Header
                onReset={() => setShowClearModal(true)}
            />

            <main className="max-w-3xl mx-auto p-4 space-y-6">
                {/* Property Selector */}
                <PropertySelector
                    properties={properties}
                    activePropertyId={activePropertyId}
                    onSelectProperty={setActiveProperty}
                    onDeleteProperty={handleDeleteProperty}
                    onAddProperty={() => setShowNewPropertyModal(true)}
                />

                {/* Metadata Card */}
                <PropertyDetails
                    metadata={activeProperty.metadata}
                    onMetadataChange={handleMetadataChange}
                />

                {/* Checklist Sections */}
                {INITIAL_SECTIONS.map((section) => (
                    <ChecklistSection
                        key={section.id}
                        section={section}
                        checklistState={activeProperty.checklistState}
                        expandedItems={activeProperty.expandedItems}
                        onToggleStatus={toggleItemStatus}
                        onToggleExpand={toggleExpand}
                        onNoteChange={handleItemNoteChange}
                        getStatusColor={getStatusColor}
                    />
                ))}

                {/* General Notes */}
                <GeneralNotes
                    generalNotes={activeProperty.metadata.generalNotes}
                    onGeneralNotesChange={(value) =>
                        handleMetadataChange("generalNotes", value)
                    }
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
                onClear={resetAll}
            />

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                properties={properties}
                INITIAL_SECTIONS={INITIAL_SECTIONS}
                STATUS_OPTS={STATUS_OPTS}
            />

            {/* New Property Modal */}
            <NewPropertyModal
                isOpen={showNewPropertyModal}
                onClose={() => setShowNewPropertyModal(false)}
                onAddProperty={handleAddProperty}
            />
        </div>
    );
}