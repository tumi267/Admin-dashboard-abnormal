'use client'
import React, { useEffect, useState } from 'react'
import AddToCart from '../AddToCart/AddToCart'
import styles from './Slider.module.css'
import productData from '../../data/product.json'

function Slider() {
  const [currentProduct, setCurrentProduct] = useState<null | typeof productData[0]>(productData[0]);
  const [nextProduct, setNextProduct] = useState<null | typeof productData[1]>(productData[1]);
  const [animate, setAnimate] = useState(false); // 🔥 new

  const handleNextSlide = () => {
    if (!currentProduct) return;
    const currentIndex = productData.findIndex(item => item.id === currentProduct.id);
    const nextIndex = (currentIndex + 1) % productData.length;

    setCurrentProduct(productData[nextIndex]);
    setNextProduct(productData[(nextIndex + 1) % productData.length]);
    setAnimate(true); // trigger animation
  };

  const handlePrevSlide = () => {
    if (!currentProduct) return;
    const currentIndex = productData.findIndex(item => item.id === currentProduct.id);
    const prevIndex = (currentIndex - 1 + productData.length) % productData.length;

    setCurrentProduct(productData[prevIndex]);
    setNextProduct(productData[(prevIndex - 1 + productData.length) % productData.length]);
    setAnimate(true); // trigger animation
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentProduct]);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setAnimate(false), 3000); // Reset after animation
      return () => clearTimeout(timeout);
    }
  }, [animate]);

  return (
    <>
      <div className={styles.contain}>
        {currentProduct && (
          <div className={animate ? styles.fadeIn : ''}> {/* 🔥 add fadeIn class if animating */}
            <h2>{currentProduct.title}</h2>
            <h3>R {currentProduct.price}</h3>
            <p>{currentProduct.description}</p>
            <AddToCart prodid={currentProduct.id} />
          </div>
        )}

        <div className={styles.slidercontain}>
          <p key={currentProduct?.id} className={styles.slider}>Current ID: {currentProduct?.id}</p>
          <p key={nextProduct?.id} className={styles.slider}>Next ID: {nextProduct?.id}</p>
        </div>
      </div>

      <div className={styles.buttons}>
        <button onClick={handlePrevSlide} className={styles.button}>⬅️ Previous</button>
        <button onClick={handleNextSlide} className={styles.button}>Next ➡️</button>
      </div>
    </>
  )
}

export default Slider