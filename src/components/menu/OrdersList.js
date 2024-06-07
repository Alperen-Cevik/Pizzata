"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Popup from "@/components/menu/Popup";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage({
  isAdmin,
  isCourier,
  isRestaurant,
  state,
}) {
  const [popup, setPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((orders) => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
    });
  }
  return (
    <div className="mt-8">
      {loadingOrders && <div>Loading orders...</div>}
      {orders?.length > 0 &&
        (state ? orders.filter((order) => order.state === state) : orders).map(
          (order) => (
            <div
              key={order._id}
              className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row justify-center items-center gap-6"
            >
              <div
                className="display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 6px;
                width: 100%;
                padding: 4px;
                margin-bottom: 2px;
                background-color: #f3f3f3;
                border-radius: 8px;"
              >
                <div>
                  <div
                    className={
                      order.state === "Delivered"
                        ? "text-green-500 font-bold"
                        : order.state === "Preparing"
                        ? "text-blue-500 font-bold"
                        : order.state === "On the Way"
                        ? "text-yellow-500 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    {order.state}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex gap-3 items-center mb-1">
                    <div className="grow">{order.userEmail}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <Link
                  href={"/orders/" + order._id}
                  className="button hover:bg-green-600 hover:text-white"
                >
                  Show order
                </Link>
                {profile.role !== "Admin" &&
                  profile.role !== "Courier" &&
                  profile.role !== "Restaurant" && (
                    <button
                      onClick={() => setPopup(!popup)}
                      className="button hover:bg-green-600 hover:text-white"
                    >
                      Rate order
                    </button>
                  )}
                {profile.role === "Courier" && state !== "Delivered" && (
                  <button className="button hover:bg-green-600 hover:text-white">
                    {profile.role === "Courier" &&
                      (state === "Preparing"
                        ? "Accept Order"
                        : state === "On the Way"
                        ? "Confirm Delivery"
                        : "")}
                  </button>
                )}
              </div>
            </div>
          )
        )}
    </div>
  );
}
