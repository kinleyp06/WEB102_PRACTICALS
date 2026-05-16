"use client";

import { useEffect, useState } from "react";

import { getUsers, followUser } from "@/services/userService";

export default function ExploreUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (id) => {
    try {
      await followUser(id);

      alert("User followed");
    } catch (error) {
      alert("Follow failed");
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Explore Users</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <div>
              <h2 className="text-xl font-bold">{user.username}</h2>

              <p>{user.email}</p>
            </div>

            <button
              onClick={() => handleFollow(user.id)}
              className="rounded bg-pink-500 px-4 py-2 text-white"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
