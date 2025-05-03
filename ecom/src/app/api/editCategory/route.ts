import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;

    // Validate required fields
    if (!id || !name || !description) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const categoriesRef = collection(db, "category");
    const categoryRef = doc(db, "category", id);

    // Check if the category with the provided ID exists
    const categoryDoc = await getDoc(categoryRef);
    if (!categoryDoc.exists()) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check for duplicate name in other categories
    const duplicateQuery = query(categoriesRef, where("name", "==", name));
    const duplicateSnapshot = await getDocs(duplicateQuery);
    const duplicateExists = duplicateSnapshot.docs.some(docSnap => docSnap.id !== id);

    if (duplicateExists) {
      return NextResponse.json(
        { error: "Another category with this name already exists" },
        { status: 409 }
      );
    }

    // Prepare the update object
    const updatedCategory = {
      name,
      description,
      updatedAt: new Date(),
    };

    // Update the category document
    await updateDoc(categoryRef, updatedCategory);

    return NextResponse.json(
      {
        msg: "Category updated successfully",
        data: { id, ...updatedCategory },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

