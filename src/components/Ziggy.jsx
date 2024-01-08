import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ziggy = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantImage, setNewRestaurantImage] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newRestaurantName);
    formData.append('image', newRestaurantImage);

    try {
      const response = await axios.post('http://localhost:5000/restaurants', formData);
      setRestaurants([...restaurants, response.data]);
      setNewRestaurantName('');
      setNewRestaurantImage(null);
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  const handleItemSubmit = async (e,restaurantId) => {

    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newItemName);
    formData.append('price', newItemPrice);
    formData.append('image', newItemImage);

    try {
      const response = await axios.post(`http://localhost:5000/restaurants/${restaurantId}/items`, formData);

      // Update the specific restaurant's items state
      setRestaurants((prevRestaurants) => {
        return prevRestaurants.map((restaurant) => {
          if (restaurant._id === restaurantId) {
            return {
              ...restaurant,
              items: [...restaurant.items, response.data],
            };
          }
          return restaurant;
        });
      });

      // Clear the item input fields for the specific restaurant
      setNewItemName('');
      setNewItemPrice('');
      setNewItemImage(null);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Restaurant App</h1>

      <form onSubmit={handleRestaurantSubmit} className="mb-8">
        <label className="block mb-2">
          Restaurant Name:
          <input
            type="text"
            value={newRestaurantName}
            onChange={(e) => setNewRestaurantName(e.target.value)}
            className="border p-2 w-full sm:w-1/2"
          />
        </label>
        <label className="block mb-2">
          Restaurant Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewRestaurantImage(e.target.files[0])}
            className="mt-2"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Restaurant
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="border p-4">
            <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
            <img
              src={`http://localhost:5000/uploads/${restaurant.image}`}
              alt={restaurant.name}
              className="w-full h-40 object-cover mb-2"
            />

            <form onSubmit={(e) => handleItemSubmit(e,restaurant._id)} className="mb-4">
              <label className="block mb-2">
                Item Name:
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Item Price:
                <input
                  type="text"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Item Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewItemImage(e.target.files[0])}
                  className="mt-2"
                />
              </label>
              <button type="submit" className="bg-green-500 text-white p-2 rounded">
                Add Item
              </button>
            </form>

            <ul>
              {restaurant.items.map((item) => (
                <li key={item._id} className="border p-2 mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-full h-20 object-cover mt-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ziggy;
