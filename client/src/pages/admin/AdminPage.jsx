import { getAllUsers } from "../../api/User/getAllUser.api";
import React, { useEffect, useState } from "react";
import PageLoad from "../../components/Loading.component";
import DataGridComponent from "../../components/DataGrid.component";
import { deleteUser } from "../../api/User/deleteUser.api";
import { FaTrashCan } from "react-icons/fa6";
import SearchBarComponent from "../../components/SearchBar.component";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // New state for filtered users
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshGrid();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const refreshGrid = async () => {
    setIsLoading(true);
    getAllUsers()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        alert(error.message);
      });
    setIsLoading(false);
  };

  const handleDelete = async (userId) => {
    setIsLoading(true);
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
        .then(() => {
          refreshGrid();
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    setIsLoading(false);
  };

  const columns = [
    { headerName: "Profile Picture", field: "profilePicture" },
    { headerName: "Username", field: "username" },
    { headerName: "Email", field: "email" },
    { headerName: "Actions", field: "actions" }
  ];

  const rows = filteredUsers.map((user) => ({
    username: user.username,
    profilePicture: (
      <img src={user.profilePicture} alt="Profile" className="h-10 w-10 rounded-full" />
    ),
    email: user.email,
    actions: (
      <button
        onClick={() => handleDelete(user._id)}
        className="text-red-600 rounded-lg p-1 flex items-center justify-center">
        <FaTrashCan className="w-5 h-5" />
      </button>
    )
  }));

  return (
    <div className="flex flex-col justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />
      {/* Search Bar */}
      <div className="mb-4">
        <SearchBarComponent 
          onSearch={handleSearch}
          placeholder="Search by username or email..."
        />
      </div>
      {/* Data Grid */}
      <DataGridComponent columns={columns} rows={rows} />
    </div>
  );
};

export default Admin;
