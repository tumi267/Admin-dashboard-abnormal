import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, variants, sku, category, status, onSale } = body;

    // Validate fields
    if (!title || !description || !price || !variants || !sku || !category || status === undefined || onSale === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const productsRef = collection(db, "products");

    // Check if product with the same SKU exists
    const skuQuery = query(productsRef, where("sku", "==", sku));
    const skuSnapshot = await getDocs(skuQuery);

    if (!skuSnapshot.empty) {
      return NextResponse.json({ msg: "Product with this SKU already exists" }, { status: 409 });
    }

    // Check for duplicate variant SKUs
    for (const variant of variants) {
      const potentialDuplicatesQuery = query(productsRef);
      const snapshot = await getDocs(potentialDuplicatesQuery);

      for (const doc of snapshot.docs) {
        const product = doc.data();
        const duplicate = product.variants?.find((v: any) => v.sku === variant.sku);
        if (duplicate) {
          return NextResponse.json({
            msg: `Variant SKU "${variant.sku}" already exists in another product`,
          }, { status: 409 });
        }
      }
    }

    // Create the product object
    const newProduct = {
      title,
      description,
      price,
      sku,
      category,
      status,   // Added 'status' (active/inactive)
      onSale,   // Added 'onSale' (sale/promotion)
      variants,
      createdAt: new Date(),
    };

    // Add the new product to the 'products' collection
    await addDoc(productsRef, newProduct);

    return NextResponse.json({
      msg: "Product created successfully",
      data: newProduct,
    }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /addProd:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
