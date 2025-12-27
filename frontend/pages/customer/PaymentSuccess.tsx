import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/api';
import { useCart } from '../../context/CartContext';

const PaymentSuccess: React.FC = () => {
  const { tableNumber } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLastOrder = async () => {
      if (!tableNumber) {
        setOrder(null);
        return;
      }

      try {
        const res = await orderService.getAll({
          tableNumber,
          limit: 1,
        });

        const last = res.data?.[0];
        if (!cancelled) {
          setOrder(last || null);
        }
      } catch {
        if (!cancelled) setOrder(null);
      }
    };

    loadLastOrder();
    return () => {
      cancelled = true;
    };
  }, [tableNumber]);

  /* --------------------------------------------------
     CASE 1: CUSTOMER JUST ARRIVED (NO ORDER)
  -------------------------------------------------- */
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-6 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-4xl shadow-xl">
          <i className="fas fa-utensils"></i>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">
            Welcome!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto text-sm font-medium">
            Welcome to our restaurant 🍽️  
            Please place your order first.
          </p>
        </div>

        <Link
          to="/"
          className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-[10px] transition transform active:scale-95"
        >
          Start Ordering
        </Link>
      </div>
    );
  }

  /* --------------------------------------------------
     CASE 2: ORDER EXISTS → SHOW BILL
  -------------------------------------------------- */
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-6 animate-in fade-in duration-700">

      {/* SUCCESS ICON */}
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-xl">
        <i className="fas fa-check"></i>
      </div>

      {/* TITLE */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">
          Order Confirmed
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto text-sm font-medium">
          Please pay at the counter and enjoy your meal 🍽️
        </p>
      </div>

      {/* BILL CARD */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-lg p-6 text-left space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">
            Bill Summary
          </span>
          <span className="text-xs font-mono text-orange-500">
            #{order._id?.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* TABLE NUMBER */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-gray-500">Table No.</span>
          <span className="text-gray-900 dark:text-white">
            {order.tableNumber}
          </span>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Order Items
          </p>

          <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => {
                const qty = Number(item.qty ?? item.quantity ?? 1);
                const price = Number(item.price ?? item.cost ?? 0);

                return (
                  <li
                    key={index}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {item.name || item.title}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Qty: {qty} × ₹{price}
                      </span>
                    </div>

                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{qty * price}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gray-400 text-center">
                No items found
              </li>
            )}
          </ul>
        </div>

        <hr className="border-dashed border-gray-200 dark:border-gray-700" />

        {/* TOTAL */}
        <div className="flex justify-between items-center text-lg font-black">
          <span>Total Amount</span>
          <span className="text-orange-500">
            ₹{order.totalAmount}
          </span>
        </div>

        {/* PAYMENT MODE */}
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest pt-2">
          <span className="text-gray-400">Payment Mode</span>
          <span className="text-red-500">Pay at Counter</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full space-y-3 px-4 max-w-sm">
        <Link
          to={`/track/${order._id}`}
          className="block w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-[10px] transition transform active:scale-95"
        >
          Track Order Live
        </Link>

        <Link
          to="/"
          className="block w-full text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-[9px] py-2"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
