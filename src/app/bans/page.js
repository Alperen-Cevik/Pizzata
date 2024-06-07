"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Popup from "@/components/menu/Popup";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pineapple from "../../../public/Pineapple.png";
import Users from "../../../public/db/users.json";

export default function OrdersPage() {
  const [popup, setPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    setLoadingUsers(true);
    fetch("http://localhost:8080/users").then((res) => {
      res.json().then((users) => {
        setUsers(users);
        setLoadingUsers(false);
      });
    });
  }

  async function changeBannedStatus(user) {
    const res = await fetch(`http://localhost:8080/ban?email=${user.email}`);

    if (res.status !== 200) {
      console.error("Failed to ban user");
      return;
    }

    const text = await res.text();

    try {
      const user = JSON.parse(text);
      console.log(user);
      const updatedUsers = users.map((u) => {
        if (u._id === user._id) {
          return user;
        }
        return u;
      });
      setUsers(updatedUsers);
    } catch (e) {
      console.error("Failed to parse JSON", e);
    }


  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={profile.role == "Admin"} />
      <div className="mt-8">
        {loadingUsers && <div>Loading Users...</div>}
        {users?.length > 0 &&
          users
            .filter((user) => user.role !== "Admin")
            .map((user) => (
              <div
                key={user._id}
                className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row justify-center items-center gap-6"
              >
                <div className="grow flex flex-col md:flex-row items-center gap-6">
                  <div>
                    <img
                      src="/pineapple.png"
                      alt="pineapple"
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="grow">
                    <div className="flex gap-3 items-center mb-1">
                      <div className="grow">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                  {user.banned ? (
                    <button 
                    onClick={() => changeBannedStatus(user)}
                    className="button hover:bg-red-600 hover:text-white">
                      Remove Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => changeBannedStatus(user)}
                      className="button hover:bg-green-600 hover:text-white"
                    >
                      Ban
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
