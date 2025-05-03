import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, price, variants, sku, category, status, onSale } = body;

    // Validate fields
    if (
      !id ||
      !title ||
      !description ||
      !price ||
      !variants ||
      !sku ||
      !category ||
      !status ||
      typeof onSale !== "boolean"
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const productsRef = collection(db, "products");
    const productRef = doc(db, "products", id);

    // Check if the product with the provided ID exists
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check for duplicate SKU in other products
    const skuQuery = query(productsRef, where("sku", "==", sku));
    const skuSnapshot = await getDocs(skuQuery);
    if (
      !skuSnapshot.empty &&
      skuSnapshot.docs.some((docSnap) => docSnap.id !== id)
    ) {
      return NextResponse.json({ msg: "Product with this SKU already exists" }, { status: 409 });
    }

    // Check for duplicate variant SKUs in other products
    const allProductsSnapshot = await getDocs(productsRef);
    for (const variant of variants) {
      for (const docSnap of allProductsSnapshot.docs) {
        if (docSnap.id === id) continue; // Skip current product

        const product = docSnap.data();
        const duplicate = product.variants?.find((v: any) => v.sku === variant.sku);
        if (duplicate) {
          return NextResponse.json(
            {
              msg: `Variant SKU "${variant.sku}" already exists in another product`,
            },
            { status: 409 }
          );
        }
      }
    }

    // Create the product object with updated fields
    const updatedProduct = {
      title,
      description,
      price,
      sku,
      category,
      status,
      onSale,
      variants,
      updatedAt: new Date(),
    };

    // Update the product document
    await updateDoc(productRef, updatedProduct);

    return NextResponse.json(
      {
        msg: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /editProd:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

