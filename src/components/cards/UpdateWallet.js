'use client';

import { useState } from 'react';

const UpdateWallet = () => {
    const [amount, setAmount] = useState('');
    return (
        <div className="w-full bg-white shadow-md rounded-xl p-4 flex items-center justify-between space-x-4">
            <div className="flex flex-col">
                <span className="text-sm text-gray-500">Wallet Balance</span>
                <span className="text-green-600 font-bold text-md"></span>
            </div>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-md shadow hover:opacity-90 transition-all">Update Balance</button>
        </div>
    );
}

export default UpdateWallet