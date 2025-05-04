import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { app } from '../firebase'; // Adjust this import if your Firebase config is elsewhere

const db = getFirestore(app);
const promotionsCollection = collection(db, 'marketing_promotions');

// Fetch all promotions
export const getPromotions = async () => {
  const snapshot = await getDocs(promotionsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new promotion (Firestore auto-generates ID)
export const addPromotion = async (promotionData) => {
  const docRef = await addDoc(promotionsCollection, promotionData);
  return { id: docRef.id, ...promotionData };
};

// Update or overwrite a promotion (provide custom ID if needed)
export const setPromotion = async (id, promotionData) => {
  const docRef = doc(db, 'marketing_promotions', id);
  await setDoc(docRef, promotionData);
  return { id, ...promotionData };
};

// Delete a promotion
export const deletePromotion = async (id) => {
  const docRef = doc(db, 'marketing_promotions', id);
  await deleteDoc(docRef);
};