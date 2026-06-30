'use client';
import React from 'react';

const BasicTable = ({ title, actions = [], subtitle = [], thead, tbody, getDetail }) => {
  return (
    <div className="flex flex-col w-full px-4 mt-4">
      {/* Header */}
      <div className="w-full mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="text-left border-l-4 border-blue-500 pl-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <div className="flex flex-wrap gap-2">
            {subtitle.map((action, i) => (
              <span key={i} className="text-gray-500 dark:text-gray-300">
                {action.label} : {action.value}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, i) =>
            action.isCustom ? (
              <div key={i}>{action.element}</div>
            ) : (
              <button key={i} className="font-medium">
                <span className="text-gray-500 dark:text-gray-300">{action.label} : {action.value}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm w-full mt-4">
        <table className="w-full table-auto text-sm text-left min-w-[600px]">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-t border-gray-200">
            {thead}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tbody}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicTable;
