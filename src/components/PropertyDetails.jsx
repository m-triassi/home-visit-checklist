import { FileText, MapPin, Hash } from "lucide-react";

export const PropertyDetails = ({ metadata, onMetadataChange }) => {
    return (
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
                                onMetadataChange("address", e.target.value)
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
                                    onMetadataChange("centrisId", e.target.value)
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
                                    onMetadataChange("legalWarranty", "yes")
                                }
                                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${metadata.legalWarranty === "yes" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"}`}
                            >
                                ✅ Yes
                            </button>
                            <button
                                onClick={() =>
                                    onMetadataChange("legalWarranty", "no")
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
    );
};