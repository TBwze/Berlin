import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DataGridComponent = ({
  columns = [],
  rows = [],
  page = 0,
  limit = 10,
  totalPages = 1,
  rowsPerPageOptions = [1, 10, 20, 50],
  handleChangePage,
  handleChangeLimit
}) => {
  return (
    <div className="space-y-4 w-full">
      {/* Table */}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="table">
          <thead className="bg-gray-100 font-medium uppercase tracking-wider text-black text-center">
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`${column.className || ""}`} // Apply the className dynamically
                    >
                      {row[column.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-600">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-600 text-nowrap">
              Baris per halaman:
            </label>
            <select
              id="rowsPerPage"
              value={limit}
              onChange={(e) => handleChangeLimit(Number(e.target.value))}
              className="form-select rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 border">
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
            <FaChevronLeft className="h-4 w-4" />
            <span className="ml-1">Sebelumnya</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => handleChangePage(p)}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                  page === p ? "z-10 bg-[#2E6950] text-white" : "text-black hover:bg-gray-50"
                } rounded-md`}>
                {p + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages - 1 || totalPages === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
            <span className="mr-1">Selanjutnya</span>
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGridComponent;
