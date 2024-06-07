"use client";
import EditableImage from "@/components/layout/EditableImage";
import InfoBox from "@/components/layout/InfoBox";
import SuccessBox from "@/components/layout/SuccessBox";
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCourier, setIsCourier] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [user, setUser] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const { status } = session;

  useEffect(() => {
    if (status === "authenticated") {
      fetch("http://localhost:8080/profile?email=" + session.data.user.email).then((response) => {
        response.json().then((data) => {
          console.log("response", data);
          setUser(data);
          setIsAdmin(data.role === "Admin");
          setProfileFetched(true);
          setIsCourier(data.role === "Carrier");
          setIsRestaurant(data.role === "Restaurant");
        });
      });
    }
  }, [session, status]);

  if (status === "loading" || !profileFetched) {
    return "Loading...";
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <section className="mt-8">
      <UserTabs
        isAdmin={isAdmin}
        isCourier={isCourier}
        isRestaurant={isRestaurant}
      />
      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={user} />
      </div>
    </section>
  );
}
