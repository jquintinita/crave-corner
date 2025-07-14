// src/components/POS/CheckoutModal.jsx
import { useState, useEffect } from 'react';

export default function CheckoutModal({ isOpen, onClose, totalAmount, onConfirm }) {
  const [cash, setCash] = useState('0');
  const [change, setChange] = useState(0);

  useEffect(() => {
    const changeCalc = parseFloat(cash) - totalAmount;
    setChange(changeCalc > 0 ? changeCalc : 0);
  }, [cash, totalAmount]);

   const handleQuickCash = (value) => {
    setCash(value.toFixed(2).toString());
  };


  const handleExact = () => {
    setCash(totalAmount.toFixed(2).toString());
  };

  const handeCancelSubmit = () => {
    setCash(0);
       onClose();
  }
  const handleSubmit = () => {
    if (parseFloat(cash) < totalAmount) {
      alert('Cash is less than total amount.');
      return;
    }
    onConfirm(parseFloat(cash), change);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Checkout</h2>
        
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700 dark:text-white">
            Total: ₱{totalAmount.toLocaleString()}
          </p>
        </div>

        <input
          type="number"
          placeholder="Enter Cash"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        />

        <div className="grid grid-cols-3 gap-2 mb-4">
            <button
                onClick={() => handleQuickCash(20)}
                className="p-2 rounded bg-green-100 hover:bg-green-200 text-green-800 font-medium"
            >
                ₱20
            </button>
            <button
                onClick={() => handleQuickCash(50)}
                className="p-2 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium"
            >
                ₱50
            </button>
            <button
                onClick={() => handleQuickCash(100)}
                className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
            >
                ₱100
            </button>
            <button
                onClick={() => handleQuickCash(200)}
                className="p-2 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
            >
                ₱200
            </button>
            <button
                onClick={() => handleQuickCash(500)}
                className="p-2 rounded bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium"
            >
                ₱500
            </button>
            <button
                onClick={() => handleQuickCash(1000)}
                className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-800 font-medium"
            >
                ₱1000
            </button>
            <button
                onClick={handleExact}
                className="col-span-3 bg-orange-100 text-orange-700 rounded p-2 hover:bg-orange-200 font-semibold"
            >
                Exact Amount
            </button>
            </div>


        <p className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Change: ₱{change.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={handeCancelSubmit} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
