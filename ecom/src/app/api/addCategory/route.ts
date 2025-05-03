import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // Validate fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name and description" },
        { status: 400 }
      );
    }

    const categoryRef = collection(db, "category");

    // Check if a category with the same name already exists
    const duplicateQuery = query(categoryRef, where("name", "==", name));
    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    // Create the new category object
    const newCategory = {
      name,
      description,
      createdAt: new Date(),
    };

    // Add to Firestore
    const docRef = await addDoc(categoryRef, newCategory);

    return NextResponse.json(
      {
        msg: "Category created successfully",
        data: { id: docRef.id, ...newCategory },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}