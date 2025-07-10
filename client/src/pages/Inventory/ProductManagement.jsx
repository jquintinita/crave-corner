import { useState } from "react";
import { createProduct } from "../../models/productModel";
import ProductTable from "../../components/ProductTable";
import ProductFormModal from "../../components/ProductFormModal";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleSave = data => {
    if (editingProduct) {
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? { ...p, ...data } : p))
      );
    } else {
      const newProduct = createProduct(data);
      setProducts(prev => [...prev, newProduct]);
    }
    setEditingProduct(null);
  };

  const handleDelete = id => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Product Management</h1>
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
