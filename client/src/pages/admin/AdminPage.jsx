import { getAllUsers } from "../../api/User/getAllUser.api";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await getApiInstance().delete(`/user/delete/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="text-left py-2 px-4 border">Username</th>
          <th className="text-left py-2 px-4 border">Profile Picture</th>
          <th className="text-left py-2 px-4 border">Email</th>
          <th className="text-left py-2 px-4 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td className="py-2 px-4 border">{user.username}</td>
            <td className="py-2 px-4 border">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            </td>
            <td className="py-2 px-4 border">{user.email}</td>
            <td className="py-2 px-4 border">
              <button
                onClick={() => handleDelete(user._id)}
                className="text-red-600 border-2 border-red-500 rounded-lg p-1"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Admin;
