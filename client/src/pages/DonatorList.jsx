// CampaignDonatorsGrid.jsx
import React from "react";
import DataGridComponent from "./DataGridComponent";

const CampaignDonatorsGrid = ({ campaignId }) => {
  const [gridData, setGridData] = React.useState({
    rows: [],
    page: 0,
    limit: 10,
    totalPages: 0,
    totalRows: 0
  });

  // Define columns for the grid
  const columns = [
    {
      field: "tier",
      headerName: "Tier",
      className: "font-semibold"
    },
    {
      field: "address",
      headerName: "Wallet Address",
      className: "font-mono" // Monospace font for addresses
    },
    {
      field: "amount",
      headerName: "Amount (ETH)",
      className: "text-right" // Right align numbers
    }
  ];

  const fetchDonators = async (page, limit) => {
    try {
      const response = await getCampaignDonators(campaignId, page, limit);

      // Transform the tiered response into flat rows
      const flatRows = response.data.flatMap((tierGroup) =>
        tierGroup.addresses.map((address, index) => ({
          tier: tierGroup.tier,
          address: address,
          amount: `${Number(tierGroup.amounts[index]).toFixed(2)} ETH`
        }))
      );

      setGridData({
        rows: flatRows,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.total_pages,
        totalRows: response.pagination.total_rows
      });
    } catch (error) {
      console.error("Error fetching donators:", error);
      // Handle error state here
    }
  };

  // Handle page change
  const handleChangePage = (newPage) => {
    fetchDonators(newPage, gridData.limit);
  };

  // Handle rows per page change
  const handleChangeLimit = (newLimit) => {
    fetchDonators(0, newLimit); // Reset to first page when changing limit
  };

  // Initial fetch
  React.useEffect(() => {
    fetchDonators(0, 10);
  }, [campaignId]);

  return (
    <DataGridComponent
      columns={columns}
      rows={gridData.rows}
      page={gridData.page}
      limit={gridData.limit}
      totalPages={gridData.totalPages}
      totalRows={gridData.totalRows}
      handleChangePage={handleChangePage}
      handleChangeLimit={handleChangeLimit}
      rowsPerPageOptions={[3, 5, 10, 20]}
    />
  );
};

export default CampaignDonatorsGrid;
