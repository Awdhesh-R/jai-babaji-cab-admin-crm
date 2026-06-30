'use client';
import React from 'react';
import Pagination from './Pagination';

const CustomerList = ({
  title,
  actions = [],
  entriesOptions = [10, 25, 50, 100],
  thead,
  tbody,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  return (
    <div className="flex flex-col w-full px-4 mt-4">
      {/* Title and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-left border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, i) =>
            action.isCustom ? (
              <div key={i}>{action.element}</div>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                className={`${action.customColor || `bg-${action.color}-600 hover:bg-${action.color}-700`} font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200 focus:outline-none border-none`}
              >
                {action.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Rows per page selector */}
      <div className="mb-4 flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Show</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="w-20 bg-white border border border-gray-400 dark:bg-gray-800 text-md text-gray-700 dark:text-white py-1.5 px-2 rounded-sm focus:outline-none"
        >
          {entriesOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Entries</span>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm w-full mt-4">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-t border-gray-200">
            {thead}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tbody}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default CustomerList;


