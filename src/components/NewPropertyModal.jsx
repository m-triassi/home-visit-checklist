import { useState } from "react";
import { Modal } from "./Modal";

export const NewPropertyModal = ({ isOpen, onClose, onAddProperty }) => {
    const [address, setAddress] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (address.trim() || address === "") {
            onAddProperty(address.trim());
            setAddress("");
            onClose();
        }
    };

    const handleClose = () => {
        setAddress("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Property"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Address (Optional)
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g., 123 Main Street, Montreal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Leave blank to name the property automatically
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm"
                    >
                        Add Property
                    </button>
                </div>
            </form>
        </Modal>
    );
};