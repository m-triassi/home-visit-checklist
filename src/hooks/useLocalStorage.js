import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    };

    return [storedValue, setValue];
};

export const usePropertyTabs = () => {
    const initialProperty = {
        id: "prop_" + Date.now(),
        name: "Property 1",
        metadata: {
            address: "",
            centrisId: "",
            legalWarranty: "yes",
            generalNotes: "",
        },
        checklistState: {},
        expandedItems: {},
    };

    const [propertiesData, setPropertiesData] = useLocalStorage(
        "homeTourTabs",
        {
            properties: [initialProperty],
            activePropertyId: initialProperty.id,
        },
    );

    // Legacy support for old data format
    useEffect(() => {
        const oldMetadata = localStorage.getItem("homeTourMetadata");
        const oldChecklistState = localStorage.getItem(
            "homeTourChecklistState",
        );
        const oldData = localStorage.getItem("homeTourData");

        if (oldMetadata || oldChecklistState || oldData) {
            try {
                let metadata, checklistState;

                if (oldData) {
                    const parsed = JSON.parse(oldData);
                    metadata = parsed.metadata;
                    checklistState = parsed.checklistState;
                } else {
                    metadata = oldMetadata ? JSON.parse(oldMetadata) : null;
                    checklistState = oldChecklistState
                        ? JSON.parse(oldChecklistState)
                        : null;
                }

                if (metadata || checklistState) {
                    const migratedProperty = {
                        id: "prop_" + Date.now(),
                        name: metadata?.address || "Property 1",
                        metadata: metadata || initialProperty.metadata,
                        checklistState: checklistState || {},
                        expandedItems: {},
                    };

                    setPropertiesData({
                        properties: [migratedProperty],
                        activePropertyId: migratedProperty.id,
                    });
                }

                // Clear old formats
                localStorage.removeItem("homeTourData");
                localStorage.removeItem("homeTourMetadata");
                localStorage.removeItem("homeTourChecklistState");
            } catch (e) {
                console.error("Failed to migrate old data format", e);
            }
        }
    }, [setPropertiesData, initialProperty.metadata]);

    const generatePropertyName = (address, propertyCount) => {
        if (address && address.trim()) {
            return address.trim();
        }
        return `Property ${propertyCount + 1}`;
    };

    const addProperty = (address = "") => {
        const newProperty = {
            id: "prop_" + Date.now() + Math.random(),
            name: generatePropertyName(
                address,
                propertiesData.properties.length,
            ),
            metadata: {
                address: address.trim(),
                centrisId: "",
                legalWarranty: "yes",
                generalNotes: "",
            },
            checklistState: {},
            expandedItems: {},
        };

        setPropertiesData((prev) => ({
            properties: [...prev.properties, newProperty],
            activePropertyId: newProperty.id,
        }));

        return newProperty;
    };

    const updateProperty = (propertyId, updates) => {
        setPropertiesData((prev) => ({
            ...prev,
            properties: prev.properties.map((prop) =>
                prop.id === propertyId ? { ...prop, ...updates } : prop,
            ),
        }));
    };

    const deleteProperty = (propertyId) => {
        if (propertiesData.properties.length <= 1) {
            console.warn("Cannot delete the last property");
            return false;
        }

        setPropertiesData((prev) => {
            const newProperties = prev.properties.filter(
                (prop) => prop.id !== propertyId,
            );
            const newActiveId =
                prev.activePropertyId === propertyId
                    ? newProperties[0].id
                    : prev.activePropertyId;

            return {
                properties: newProperties,
                activePropertyId: newActiveId,
            };
        });

        return true;
    };

    const setActiveProperty = (propertyId) => {
        setPropertiesData((prev) => ({
            ...prev,
            activePropertyId: propertyId,
        }));
    };

    const getActiveProperty = () => {
        return (
            propertiesData.properties.find(
                (prop) => prop.id === propertiesData.activePropertyId,
            ) || propertiesData.properties[0]
        );
    };

    const updateActiveProperty = (updates) => {
        const activeId = propertiesData.activePropertyId;
        updateProperty(activeId, updates);
    };

    const resetAllProperties = () => {
        const preservedPropertyCount = Math.max(1, propertiesData.properties.length);
        const resetProperties = Array.from({ length: preservedPropertyCount }, (_, index) => ({
            id: "prop_" + Date.now() + "_" + index,
            name: `Property ${index + 1}`,
            metadata: {
                address: "",
                centrisId: "",
                legalWarranty: "yes",
                generalNotes: "",
            },
            checklistState: {},
            expandedItems: {}
        }));

        setPropertiesData({
            properties: resetProperties,
            activePropertyId: resetProperties[0].id
        });
    };

    return {
        properties: propertiesData.properties,
        activePropertyId: propertiesData.activePropertyId,
        activeProperty: getActiveProperty(),
        addProperty,
        updateProperty,
        deleteProperty,
        setActiveProperty,
        updateActiveProperty,
        resetAllProperties,
    };
};

export const useHomeTourData = () => {
    const initialMetadata = {
        address: "",
        centrisId: "",
        legalWarranty: "yes",
        generalNotes: "",
    };

    const [metadata, setMetadata] = useLocalStorage(
        "homeTourMetadata",
        initialMetadata,
    );
    const [checklistState, setChecklistState] = useLocalStorage(
        "homeTourChecklistState",
        {},
    );

    return { metadata, setMetadata, checklistState, setChecklistState };
};
