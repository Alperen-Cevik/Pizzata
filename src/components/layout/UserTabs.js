"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserTabs({ isAdmin, isCourier, isRestaurant }) {
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link className={path === "/profile" ? "active" : ""} href={"/profile"}>
        Profile
      </Link>
      {isAdmin && (
        <>
          <Link
            href={"/bans"}
            className={path.includes("bans") ? "active" : ""}
          >
            Bans
          </Link>
          <Link className={path === "/orders" ? "active" : ""} href={"/orders"}>
            Orders
          </Link>
        </>
      )}
      {isCourier && (
        <>
          <Link
            href={"/incoming-orders"}
            className={path === "/incoming-orders" ? "active" : ""}
          >
            Incoming Orders
          </Link>
          <Link
            href={"/ongoing-orders"}
            className={path.includes("ongoing-orders") ? "active" : ""}
          >
            Ongoing Orders
          </Link>
          <Link
            href={"/delivered-orders"}
            className={path.includes("delivered-orders") ? "active" : ""}
          >
            Delivered Orders
          </Link>
        </>
      )}
      {isRestaurant && (
        <>
          <Link
            href={"/categories"}
            className={path === "/categories" ? "active" : ""}
          >
            Categories
          </Link>
          <Link
            href={"/menu-items"}
            className={path.includes("menu-items") ? "active" : ""}
          >
            Menu Items
          </Link>
          <Link className={path === "/orders" ? "active" : ""} href={"/orders"}>
            Orders
          </Link>
        </>
      )}
      {!isAdmin && !isCourier && !isRestaurant && (
        <Link className={path === "/orders" ? "active" : ""} href={"/orders"}>
          Orders
        </Link>
      )}
    </div>
  );
}
