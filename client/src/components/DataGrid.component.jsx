import React from 'react';

const DataGridComponent = ({ columns, rows }) => {
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                  {row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Default Props
DataGridComponent.defaultProps = {
  columns: [],
  rows: []
};

export default DataGridComponent;
