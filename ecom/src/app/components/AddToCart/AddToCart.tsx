'use client';
import React from 'react';

interface AddToCartProps {
  prodid: string | undefined;
}

function AddToCart({ prodid }: AddToCartProps) {

  const handlebuy =async () => {
    // use context api
    alert(prodid)
  }
  return (
   

        <button onClick={handlebuy}>Add to Cart </button>

  );
}

export default AddToCart;

