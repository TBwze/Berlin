import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const DataGridComponent = ({ columns = [], rows = [], rowsPerPageOptions = [5, 10, 20] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const currentRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Rows per page selector */}
      <div className="flex items-center justify-end space-x-2">
        <label htmlFor="rowsPerPage" className="text-sm text-gray-600">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="form-select rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition-colors hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
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

      {/* Enhanced Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center justify-between sm:hidden">
          {/* Mobile pagination */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || rows.length === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || rows.length === 0}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>

        {/* Desktop pagination */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {rows.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {rows.length > 0 ? Math.min(currentPage * rowsPerPage, rows.length) : 0}
              </span>{" "}
              of <span className="font-medium">{rows.length}</span> results
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || rows.length === 0}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50">
              <FaChevronLeft className="h-4 w-4" />
              <span className="ml-1">Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                  return false;
                })
                .map((page, i, array) => {
                  if (i > 0 && array[i - 1] !== page - 1) {
                    return [
                      <span key={`ellipsis-${page}`} className="px-2 text-black">
                        ...
                      </span>,
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-[#2E6950] text-white"
                            : "text-black hover:bg-gray-50"
                        } rounded-md`}>
                        {page}
                      </button>
                    ];
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-[#2E6950] text-white"
                          : "text-black hover:bg-gray-50"
                      } rounded-md`}>
                      {page}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || rows.length === 0}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50">
              <span className="mr-1">Next</span>
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGridComponent;
