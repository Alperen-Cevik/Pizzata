"use client";
import Left from "@/components/icons/Left";
import Right from "@/components/icons/Right";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewMenuItemPage() {
  const session = useSession();
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading, data } = useProfile();

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();

    console.log(session.data.user);
    data.restaurant_id = session.data.user._id;

    const res = await fetch("http://localhost:8080/menuitems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status !== 200) {
      toast.error("Failed to create menu item");
      return;
    }

    toast.success("Menu item created successfully");
  
  }

  if (redirectToItems) {
    return redirect("/menu-items");
  }

  if (loading) {
    return "Loading user info...";
  }

  if (data.role !== "Restaurant") {
    return "Not an restaurant.";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={false} isCourier={false} isRestaurant={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={"/menu-items"} className="button">
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}
