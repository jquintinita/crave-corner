import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filter, setFilter] = useState('all');
  const [range, setRange] = useState({ from: '', to: '' });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/transactions/details`);
        const data = await res.json();
        setSales(data);
        setFilteredSales(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    const now = dayjs();
    let filtered = [...sales];

    if (filter === 'today') {
      filtered = filtered.filter(s => dayjs(s.created_at).isSame(now, 'day'));
    } else if (filter === 'week') {
      const currentWeek = now.week();
      const currentYear = now.year();
      filtered = filtered.filter(s => {
        const date = dayjs(s.created_at);
        return date.week() === currentWeek && date.year() === currentYear;
      });
    } else if (filter === 'month') {
      filtered = filtered.filter(s => dayjs(s.created_at).isSame(now, 'month'));
    } else if (filter === 'range' && range.from && range.to) {
      const fromDate = dayjs(range.from);
      const toDate = dayjs(range.to);
      filtered = filtered.filter(s =>
        dayjs(s.created_at).isSameOrAfter(fromDate.startOf('day')) &&
        dayjs(s.created_at).isSameOrBefore(toDate.endOf('day'))
      );
    }

    setFilteredSales(filtered);
  }, [filter, range, sales]);

  const toggleExpand = (id) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Sales Transactions</h2>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {['all', 'today', 'week', 'month'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={range.from}
            onChange={(e) => {
              setRange((prev) => ({ ...prev, from: e.target.value }));
              setFilter('range');
            }}
            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
          />
          <span className="text-gray-600 dark:text-gray-300">to</span>
          <input
            type="date"
            value={range.to}
            onChange={(e) => {
              setRange((prev) => ({ ...prev, to: e.target.value }));
              setFilter('range');
            }}
            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
        <table className="w-full text-sm table-auto border-separate border-spacing-y-2">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
            <tr>
              <th></th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Total</th>
              <th className="text-left px-4 py-2">Payment</th>
              <th className="text-left px-4 py-2">Cashier</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <React.Fragment key={`sale-${sale.id}`}>
                <tr
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded cursor-pointer"
                  onClick={() => toggleExpand(sale.id)}
                >
                  <td className="px-4 py-2">
                    {expandedRow === sale.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(sale.created_at).toLocaleString('en-PH', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Asia/Manila',
                    })}
                  </td>
                  <td className="px-4 py-2 font-medium text-green-600 dark:text-green-400">
                    ₱{sale.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 capitalize">{sale.payment_method || 'Cash'}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    User #{sale.user_id}
                  </td>
                </tr>

                {expandedRow === sale.id && sale.items?.length > 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 pb-4 pt-2 bg-gray-50 dark:bg-gray-800">
                      <table className="w-full text-xs">
                        <thead className="text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="text-left py-1">Item</th>
                            <th className="text-left py-1">Qty</th>
                            <th className="text-left py-1">Price</th>
                            <th className="text-left py-1">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items.map((item) => (
                            <tr key={`item-${sale.id}-${item.id}`} className="text-gray-700 dark:text-gray-200">
                              <td className="py-1">{item.name}</td>
                              <td className="py-1">{item.quantity}</td>
                              <td className="py-1">₱{item.price}</td>
                              <td className="py-1">₱{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
