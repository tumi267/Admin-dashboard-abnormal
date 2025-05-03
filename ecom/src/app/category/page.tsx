import React from 'react'
import CaregoryCard from '../components/CategoryCard/CategoryCard';

function page() {
  const categories = [
    {
      id: 'cat001',
      title: 'Fruit',
      description: 'Fresh and seasonal fruits packed with nutrients.',
      image: 'https://example.com/images/categories/fruit.jpg'
    },
    {
      id: 'cat002',
      title: 'Vegetables',
      description: 'Organic and locally-sourced vegetables.',
      image: 'https://example.com/images/categories/vegetables.jpg'
    },
    {
      id: 'cat003',
      title: 'Meat',
      description: 'Premium cuts of beef, chicken, pork, and more.',
      image: 'https://example.com/images/categories/meat.jpg'
    },
    {
      id: 'cat004',
      title: 'Dairy',
      description: 'Milk, cheese, yogurt, and more from trusted dairies.',
      image: 'https://example.com/images/categories/dairy.jpg'
    },
    {
      id: 'cat005',
      title: 'Bakery',
      description: 'Freshly baked bread, pastries, and cakes.',
      image: 'https://example.com/images/categories/bakery.jpg'
    },
    {
      id: 'cat006',
      title: 'Seafood',
      description: 'Fresh and frozen fish, shrimp, and shellfish.',
      image: 'https://example.com/images/categories/seafood.jpg'
    },
    {
      id: 'cat007',
      title: 'Beverages',
      description: 'Juices, soft drinks, water, and energy drinks.',
      image: 'https://example.com/images/categories/beverages.jpg'
    },
    {
      id: 'cat008',
      title: 'Snacks',
      description: 'Chips, crackers, and other delicious treats.',
      image: 'https://example.com/images/categories/snacks.jpg'
    },
    {
      id: 'cat009',
      title: 'Grains',
      description: 'Rice, quinoa, oats, and other healthy grains.',
      image: 'https://example.com/images/categories/grains.jpg'
    },
    {
      id: 'cat010',
      title: 'Spices',
      description: 'Aromatic spices to flavor every dish.',
      image: 'https://example.com/images/categories/spices.jpg'
    },
    {
      id: 'cat011',
      title: 'Frozen Foods',
      description: 'Convenient and tasty frozen meals and veggies.',
      image: 'https://example.com/images/categories/frozen.jpg'
    },
    {
      id: 'cat012',
      title: 'Canned Goods',
      description: 'Soups, beans, vegetables, and fruits in cans.',
      image: 'https://example.com/images/categories/canned.jpg'
    },
    {
      id: 'cat013',
      title: 'Condiments',
      description: 'Ketchup, mustard, and other meal enhancers.',
      image: 'https://example.com/images/categories/condiments.jpg'
    },
    {
      id: 'cat014',
      title: 'Sauces',
      description: 'Savory and sweet sauces for cooking or dipping.',
      image: 'https://example.com/images/categories/sauces.jpg'
    },
    {
      id: 'cat015',
      title: 'Pasta',
      description: 'A variety of pasta types for classic and modern recipes.',
      image: 'https://example.com/images/categories/pasta.jpg'
    },
    {
      id: 'cat016',
      title: 'Breakfast Foods',
      description: 'Cereal, eggs, and more to start your day right.',
      image: 'https://example.com/images/categories/breakfast.jpg'
    },
    {
      id: 'cat017',
      title: 'Desserts',
      description: 'Cakes, ice cream, and other sweet indulgences.',
      image: 'https://example.com/images/categories/desserts.jpg'
    },
    {
      id: 'cat018',
      title: 'Nuts',
      description: 'Healthy and tasty nuts for snacking or cooking.',
      image: 'https://example.com/images/categories/nuts.jpg'
    },
    {
      id: 'cat019',
      title: 'Seeds',
      description: 'Nutritious seeds like chia, flax, and sunflower.',
      image: 'https://example.com/images/categories/seeds.jpg'
    },
    {
      id: 'cat020',
      title: 'Oils',
      description: 'Cooking oils including olive, canola, and more.',
      image: 'https://example.com/images/categories/oils.jpg'
    },
    {
      id: 'cat021',
      title: 'Herbs',
      description: 'Fresh and dried herbs for flavor and health.',
      image: 'https://example.com/images/categories/herbs.jpg'
    },
    {
      id: 'cat022',
      title: 'Baby Food',
      description: 'Nutritious meals and snacks for your little one.',
      image: 'https://example.com/images/categories/babyfood.jpg'
    },
    {
      id: 'cat023',
      title: 'Pet Food',
      description: 'Healthy food options for dogs, cats, and more.',
      image: 'https://example.com/images/categories/petfood.jpg'
    }
  ];
  
  return (
    <div>
    <CaregoryCard
    products={categories}
    />
    </div>
  )
}

export default page