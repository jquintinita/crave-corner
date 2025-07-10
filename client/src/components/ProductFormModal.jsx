import { useState, useEffect } from "react";

export default function ProductFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    unitPrice: "",
    price: "",
    category: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit" : "Add"} Product</h2>
        <div className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
          <input className="w-full p-2 border rounded" placeholder="Unit Price" name="unitPrice" value={formData.unitPrice} onChange={handleChange} />
          <input className="w-full p-2 border rounded" placeholder="Price" name="price" value={formData.price} onChange={handleChange} />
          <input className="w-full p-2 border rounded" placeholder="Category" name="category" value={formData.category} onChange={handleChange} />
          <input className="w-full p-2 border rounded" placeholder="Description" name="description" value={formData.description} onChange={handleChange} />
          <input className="w-full p-2 border rounded" placeholder="Image URL" name="image" value={formData.image} onChange={handleChange} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">{initialData ? "Update" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
