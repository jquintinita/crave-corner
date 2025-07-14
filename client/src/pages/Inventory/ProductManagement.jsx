import { useState, useEffect } from "react";
import ProductTable from "../../components/products/ProductTable";
import ProductFormModal from "../../components/products/ProductFormModal";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);


  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Called after adding/editing a product
  const handleSave = () => {
    fetchProducts(); // reload updated list
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add Product
      </button>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProduct}
      />
    </div>
  );
}
