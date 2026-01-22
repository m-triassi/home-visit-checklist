import { STATUS_OPTS } from '../constants/checklist';

export const StatusBadge = ({ status }) => {
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