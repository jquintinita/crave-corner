// src/components/Products/ProductModal.jsx
const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: 0,
    price: 0,
    stock: 0,
    // ... other fields
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Modal content same as before */}
      </div>
    </div>
  ) : null;
};
