import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image } from 'cloudinary-react';

const Ziggy4 = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantImage, setNewRestaurantImage] = useState(null);
  const [newItemInputs, setNewItemInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ziggyback.onrender.com/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newRestaurantName);
    formData.append('file', newRestaurantImage);
    // console.log("resresd",formData)
    

    try {
      setLoading(true);
      const response = await axios.post('https://ziggyback.onrender.com/restaurants', formData);
      setRestaurants([...restaurants, response.data]);
      setNewRestaurantName('');
      setNewRestaurantImage(null);
      setNewItemInputs((prevInputs) => ({ ...prevInputs, [response.data._id]: {} }));
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError('Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleItemInputChange = (restaurantId, field, value) => {
    setNewItemInputs((prevInputs) => ({
      ...prevInputs,
      [restaurantId]: { ...prevInputs[restaurantId], [field]: value },
    }));
  };

//   const handleItemSubmit = async (e, restaurantId) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', newItemInputs[restaurantId]?.name || '');
//     formData.append('price', newItemInputs[restaurantId]?.price || '');
//     formData.append('file', newItemInputs[restaurantId]?.image || '');
//     console.log(newItemInputs[restaurantId].image)

//     try {
//       setLoading(true);
//       const response = await axios.post(`http://localhost:5000/restaurants/${restaurantId}/items`, formData);
      
//       setRestaurants((prevRestaurants) =>
//         prevRestaurants.map((restaurant) =>
//           restaurant._id === restaurantId
//             ? { ...restaurant, items: [...restaurant.items, response.data] }
//             : restaurant
//         )
//       );
//       setNewItemInputs((prevInputs) => ({
//         ...prevInputs,
//         [restaurantId]: { name: '', price: '', image: null },
//       }));
//     } catch (error) {
//       console.error('Error creating item:', error);
//       setError('Failed to create item');
//     } finally {
//       setLoading(false);
//     }
//   };

const handleItemSubmit = async (e, restaurantId) => {
    e.preventDefault();
    // console.log('newItemInputs:', newItemInputs);

  
    const formData = new FormData();
    formData.append('name', newItemInputs[restaurantId]?.name || '');
    formData.append('price', newItemInputs[restaurantId]?.price || '');
    // formData.append('file', newItemInputs[restaurantId]?.image || '');
    const imageFile = newItemInputs[restaurantId]?.image;
    // console.log('newItemInputs[restaurantId]',newItemInputs[restaurantId])
    // console.log('newItemInputs[restaurantId]formdata',formData)

if (imageFile) {
  formData.append('file', imageFile);
}
  
    try {
      setLoading(true);
    //   console.log('formData:', formData); // Log formData to check if it's correct
  
      const response = await axios.post(`https://ziggyback.onrender.com/restaurants/${restaurantId}/items`, formData);
  
    //   console.log('Response from server:', response.data); // Log the response to check what you're getting
  
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, items: [...restaurant.items, response.data] }
            : restaurant
        )
      );
  
      setNewItemInputs((prevInputs) => ({
        ...prevInputs,
        [restaurantId]: { name: '', price: '', image: null },
      }));
    } catch (error) {
      console.error('Error creating item:', error);
      setError('Failed to create item');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      setLoading(true);
      await axios.delete(`https://ziggyback.onrender.com/restaurants/${restaurantId}`);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant._id !== restaurantId)
      );
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setError('Failed to delete restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (restaurantId, itemId) => {
    try {
      setLoading(true);
      await axios.delete(`https://ziggyback.onrender.com/restaurants/${restaurantId}/items/${itemId}`);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, items: restaurant.items.filter((item) => item._id !== itemId) }
            : restaurant
        )
      );
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
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
            name="image"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Restaurant
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="border p-4">
            <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>

            <Image
              cloudName="dsmg4dxbj"
              publicId={restaurant.image}
              alt={restaurant.name}
              width="100%"
              height="auto"
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
                  name="image"
                />
              </label>
              <button type="submit" className="bg-green-500 text-white p-2 rounded">
                Add Item
              </button>
            </form>

            <button
              onClick={() => handleDeleteRestaurant(restaurant._id)}
              className="bg-red-500 text-white p-2 rounded"
              disabled={loading}
            >
              Delete Restaurant
            </button>

            <ul>
              {restaurant.items.map((item) => (
                <li key={item._id} className="border p-2 mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <Image
                    cloudName="dsmg4dxbj"
                    publicId={item.image}
                    alt={item.name}
                    width="100%"
                    height="auto"
                  />
                  <button
                    onClick={() => handleDeleteItem(restaurant._id, item._id)}
                    className="bg-red-500 text-white p-2 rounded"
                    disabled={loading}
                  >
                    Delete Item
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ziggy4;
