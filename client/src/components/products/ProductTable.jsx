export default function ProductTable({ products, onEdit, onDelete }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Unit Price</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="p-2">
                <img src={API_BASE_URL + product.image} alt="" className="w-10 h-10 object-cover rounded" />
              </td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">₱{product.unitPrice}</td>
              <td className="p-2">₱{product.price}</td>
              <td className="p-2">{product.category}</td>
              <td className="p-2">{product.description}</td>
              <td className="p-2">{new Date(product.dateCreated).toLocaleString()}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => onEdit(product)} className="text-white bg-blue-600 rounded-lg p-2">Edit</button>
                <button onClick={() => onDelete(product.id)} className="bg-red-600 text-whites rounded-lg p-2 ">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
