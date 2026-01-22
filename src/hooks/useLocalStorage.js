import { useState, useEffect } from 'react';

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
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    };

    return [storedValue, setValue];
};

export const useHomeTourData = () => {
    const initialMetadata = {
        address: "",
        centrisId: "",
        legalWarranty: "yes",
        generalNotes: "",
    };

    const [metadata, setMetadata] = useLocalStorage("homeTourMetadata", initialMetadata);
    const [checklistState, setChecklistState] = useLocalStorage("homeTourChecklistState", {});

    // Legacy support for old data format
    useEffect(() => {
        const savedData = localStorage.getItem("homeTourData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.metadata && !localStorage.getItem("homeTourMetadata")) {
                    setMetadata(parsed.metadata);
                }
                if (parsed.checklistState && !localStorage.getItem("homeTourChecklistState")) {
                    setChecklistState(parsed.checklistState);
                }
                // Clear old format
                localStorage.removeItem("homeTourData");
            } catch (e) {
                console.error("Failed to migrate old data format", e);
            }
        }
    }, [setMetadata, setChecklistState]);

    return { metadata, setMetadata, checklistState, setChecklistState };
};