"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Popup from "@/components/menu/Popup";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrdersList from "@/components/menu/OrdersList";

export default function OrdersPage() {
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
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isCourier={profile.role === "Courier"} />
      <OrdersList state="Preparing" />
    </section>
  );
}
