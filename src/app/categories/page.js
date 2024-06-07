"use client";
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
  
  function fetchCategories() {
    fetch("http://localhost:8080/categories").then((res) => {
      res.json().then((categories) => {
        setCategories(categories);
      });
    });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();

    if (editedCategory) {
      const res = await fetch("http://localhost:8080/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: editedCategory._id,
          name: categoryName,
        }),
      });

      if (res.status !== 200) {
        toast.error("Failed to update category");
        return;
      }

      const updatedCategory = await res.json();
      const updatedCategories = categories.map((c) => {
        if (c._id === updatedCategory._id) {
          return updatedCategory;
        }
        return c;
      });
      setCategories(updatedCategories);
      setEditedCategory(null);
      setCategoryName("");
      return;
    }
    else {
      const res = await fetch("http://localhost:8080/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
        }),
      });

      if (res.status !== 200) {
        toast.error("Failed to create category");
        return;
      }

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setCategoryName("");
    }
  }

  async function handleDeleteClick(_id) {
    const res = await fetch("http://localhost:8080/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
      }),
    });

    if (res.status !== 200) {
      toast.error("Failed to delete category");
      return;
    }

    const updatedCategories = categories.filter((c) => c._id !== _id);
    setCategories(updatedCategories);
  }

  if (profileLoading) {
    return "Loading user info...";
  }

  console.log("profileData", profileData);

  if (profileData.role !== "Restaurant") {
    return "Not a restaurant";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={false} isCourier={false} isRestaurant={true} />
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? "Update category" : "New category name"}
              {editedCategory && (
                <>
                  : <b>{editedCategory.name}</b>
                </>
              )}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(ev) => setCategoryName(ev.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 &&
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center"
            >
              <div className="grow">{c.name}</div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(c);
                    setCategoryName(c.name);
                  }}
                >
                  Edit
                </button>
                <DeleteButton
                  label="Delete"
                  onDelete={() => handleDeleteClick(c._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
