import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ziggy2 = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantImage, setNewRestaurantImage] = useState(null);
  const [newItemInputs, setNewItemInputs] = useState({});

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('https://ziggyback.onrender.com/restaurants');
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
      const response = await axios.post('https://ziggyback.onrender.com/restaurants', formData);
      setRestaurants([...restaurants, response.data]);
      setNewRestaurantName('');
      setNewRestaurantImage(null);
      setNewItemInputs((prevInputs) => ({ ...prevInputs, [response.data._id]: {} }));
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  const handleItemInputChange = (restaurantId, field, value) => {
    setNewItemInputs((prevInputs) => ({
      ...prevInputs,
      [restaurantId]: { ...prevInputs[restaurantId], [field]: value },
    }));
  };

  const handleItemSubmit = async (e, restaurantId) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newItemInputs[restaurantId]?.name || '');
    formData.append('price', newItemInputs[restaurantId]?.price || '');
    formData.append('image', newItemInputs[restaurantId]?.image || '');

    try {
      const response = await axios.post(`https://ziggyback.onrender.com/restaurants/${restaurantId}/items`, formData);

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

      setNewItemInputs((prevInputs) => ({
        ...prevInputs,
        [restaurantId]: { name: '', price: '', image: null },
      }));
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
              src={`https://ziggyback.onrender.com/uploads/${restaurant.image}`}
              alt={restaurant.name}
              className="w-full h-40 object-cover mb-2"
            />

            <form onSubmit={(e) => handleItemSubmit(e, restaurant._id)} className="mb-4">
              <label className="block mb-2">
                Item Name:
                <input
                  type="text"
                  value={newItemInputs[restaurant._id]?.name || ''}
                  onChange={(e) => handleItemInputChange(restaurant._id, 'name', e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Item Price:
                <input
                  type="text"
                  value={newItemInputs[restaurant._id]?.price || ''}
                  onChange={(e) => handleItemInputChange(restaurant._id, 'price', e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Item Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleItemInputChange(restaurant._id, 'image', e.target.files[0])}
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
                   src={`https://ziggyback.onrender.com/uploads/${item.image}`}
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

export default Ziggy2;
