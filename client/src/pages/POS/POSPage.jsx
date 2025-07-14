import { useState, useEffect } from 'react';
import CheckoutModal from '../../components/POS/CheckoutModal';
import SuccessModal from '../../components/POS/SuccessModal';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const user_id = 1; // Replace this with logged-in user ID
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleQtyChange = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded  shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Products</h2>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-7 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activeCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className='w-full overflow-y-auto h-[45vh]  md:h-[76vh]'>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
              {products
                .filter(p => activeCategory === 'All' || p.category === activeCategory)
                .map((product) => (
                  <div
                    key={product.id}
                    className=" relative border rounded-2xl overflow-hidden dark:border-gray-600 hover:shadow cursor-pointer"
                    onClick={() => handleAddToCart(product)}
                  >
                    <img
                      src={API_BASE_URL + product.image}
                      alt={product.name}
                      className="w-[220px] h-[200px] object-cover  rounded"
                    />
                  <div className='w-full absolute bottom-0 z-1 p-3 bg-gradient-to-b from-gray-800/60 to-gray-800'>
                    <div className="font-medium text-gray-800 dark:text-gray-100">{product.name}</div>
                    <div className="text-sm text-green-600 font-bold dark:text-green-600">₱{product.price}</div>
                  </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Cart</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-2 border-b dark:border-gray-600">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 dark:text-white">{item.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ₱{item.price} × {item.quantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item.id, -1)}
                      className="w-7 h-7 text-sm bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, 1)}
                      className="w-7 h-7 text-sm bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 space-y-2">
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCASH</option>
            </select>

            <button
              disabled={cart.length === 0}
              onClick={() => setShowCheckout(true)}
              className={`w-full px-4 py-2 rounded ${
                cart.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Total - ₱{totalAmount.toLocaleString()}
            </button>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        totalAmount={totalAmount}
        onConfirm={async (cash, change) => {
          const payload = {
            items: cart,
            total: totalAmount,
            cash,
            change,
            user_id,
             payment_method: paymentMethod // ✅ include this
          };

          try {
            const res = await fetch(`${API_BASE_URL}/api/transactions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
              console.log('✅ Transaction saved:', data);
              setCart([]);
              setShowCheckout(false);
              setShowSuccess(true);
            } else {
              console.error('❌ Save failed:', data.error || 'Unknown error');
            }
          } catch (err) {
            console.error('❌ Error saving transaction:', err);
          }
        }}
      />

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
