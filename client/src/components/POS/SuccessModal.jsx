export default function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Transaction Successful</h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">The sale has been recorded successfully.</p>
        <button
          className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
