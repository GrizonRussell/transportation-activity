'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [transports, setTransports] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    destination: '',
    price: '',
  });
  const [destinations, setDestinations] = useState([]);
  const [genders, setGenders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchRecords();
    fetchDestinations();
    fetchGenders();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost/transportation/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: 'getRecord' }),
      });
      const data = await response.json();
      setTransports(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch('http://localhost/transportation/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: 'getDestinations' }),
      });
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchGenders = async () => {
    try {
      const response = await fetch('http://localhost/transportation/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: 'getGenders' }),
      });
      const data = await response.json();
      setGenders(data);
    } catch (error) {
      console.error('Error fetching genders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.gender || !formData.destination || !formData.price) {
      alert('Please fill in all fields');
      return;
    }

    const genderId = genders.find(g => g.gender_name === formData.gender)?.gender_id;
    const destinationId = destinations.find(d => d.dest_name === formData.destination)?.dest_id;

    if (!genderId || !destinationId) {
      alert('Invalid gender or destination');
      return;
    }

    const operation = editIndex !== null ? 'updateRecord' : 'addRecord';

    try {
      const response = await fetch('http://localhost/transportation/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          pas_name: formData.name,
          pas_genderId: genderId,
          pas_destinationId: destinationId,
          pas_price: formData.price,
        }),
      });
      const data = await response.json();

      if (data.status === 1) {
        fetchRecords(); // Refresh records after add/update
        setFormData({ name: '', gender: '', destination: '', price: '' });
        setEditIndex(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting record:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-8 ml-8 text-left">Super 5ive</h1>
      <div className="flex justify-center space-x-4">
        <div className="w-1/3 bg-gray-800 p-4 rounded-lg"> {/* Adjusted width here */}
          <h2 className="text-2xl font-semibold mb-1" style={{ height: '50px', overflowY: 'fixed' }}>Add Transport</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Gender</label>
              <select
                className="w-full p-2 bg-gray-700 rounded-lg"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                {genders.map((gender) => (
                  <option key={gender.gender_id} value={gender.gender_name}>
                    {gender.gender_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Destination</label>
              <select
                className="w-full p-2 bg-gray-700 rounded-lg"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              >
                <option value="">Select Destination</option>
                {destinations.map((destination) => (
                  <option key={destination.dest_id} value={destination.dest_name}>
                    {destination.dest_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Price</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 rounded-lg"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {editIndex !== null ? 'Update' : 'Add'} Transport
            </button>
          </form>
        </div>
        <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Transport Records</h2>
          <table className="w-full bg-gray-700 rounded-lg">
            <thead>
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Gender</th>
                <th className="p-2 text-left">Destination</th>
                <th className="p-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((transport, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="p-2">{transport.pas_name}</td>
                  <td className="p-2">{transport.gender_name}</td>
                  <td className="p-2">{transport.dest_name}</td>
                  <td className="p-2">{transport.pas_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
