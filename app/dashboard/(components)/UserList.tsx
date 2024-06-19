// components/UserList.tsx
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { changeUserRole, getAllUsers } from "@/actions/usersActions";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface User {
  id: string;
  email: string;
  user_id: string;
  role: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState("visitor");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    if (selectedUser) {
      await changeUserRole(selectedUser.user_id, role);
      setModalOpen(false);
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Search users by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setUsers(users.filter(user => user.email.includes(search)))}>Search</Button>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user.user_id} className="flex justify-between items-center m-2">
            <span>{user.email}</span>
            <Button onClick={() => { setSelectedUser(user); setModalOpen(true); }}>Change Role</Button>
          </li>
        ))}
      </ul>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <h2>Change Role for {selectedUser?.email}</h2>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="visitor">Visitor</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Button onClick={handleRoleChange}>Save</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserList;
