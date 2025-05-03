import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"

export async function POST(request: Request) {
  const body = await request.json()


  const docId = body

  if (!docId) {
    return NextResponse.json({ msg: "Document ID is required" }, { status: 400 })
  }

  try {
    // Get a reference to the document in the 'products' collection
    const docRef = doc(db, "category", docId)

    // Delete the document
    await deleteDoc(docRef)

    // Return a success response
    return NextResponse.json({ msg: "Document deleted successfully" })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ msg: "Error deleting document", error }, { status: 500 })
  }
}