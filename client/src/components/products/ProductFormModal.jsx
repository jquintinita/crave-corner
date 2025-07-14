import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    unitPrice: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  console.log(initialData)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        image: null,
      });
      setPreview(initialData.image || null);
    } else {
      setFormData({
        name: "",
        unitPrice: "",
        price: "",
        category: "",
        description: "",
        image: null,
      });
      setPreview(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("unitPrice", formData.unitPrice);
  formDataToSend.append("price", formData.price);
  formDataToSend.append("category", formData.category);
  formDataToSend.append("description", formData.description);
  if (formData.image) {
    formDataToSend.append("image", formData.image);
  }

  const isUpdating = Boolean(initialData);
  const endpoint = isUpdating
    ? `${API_BASE_URL}/api/products/${initialData.id}`
    : `${API_BASE_URL}/api/products`;

  const method = isUpdating ? "put" : "post";

  try {
    const res = await axios({
      method,
      url: endpoint,
      data: formDataToSend,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Axios response:", res.data);

    setNotification({
      message: isUpdating
        ? "✅ Product updated successfully!"
        : "✅ Product created successfully!",
      type: "success",
    });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
      onSave();
      onClose();
    }, 1500);
  } catch (error) {
    console.error("❌ Axios error:", error);
    setNotification({
      message: "❌ Something went wrong. Please try again.",
      type: "error",
    });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  }
};





  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {initialData ? "Edit" : "Add"} Product
        </h2>
        {notification.message && (
          <div
            className={`p-2 mb-4 rounded text-sm ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.message}
          </div>
        )}
        <div className="space-y-3">
          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Unit Price"
            name="unitPrice"
            type="number"
            value={formData.unitPrice}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <textarea
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-1 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            />
            {preview && (
              <img
                src={typeof preview === "string" && !preview.startsWith("data:")
                  ? API_BASE_URL + preview
                  : preview}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded border border-gray-300 dark:border-gray-600"
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
