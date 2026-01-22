import { Modal } from './Modal';

export const ClearModal = ({ isOpen, onClose, onClear }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClear}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm"
                    >
                        Yes, Clear All
                    </button>
                </div>
            </div>
        </Modal>
    );
};