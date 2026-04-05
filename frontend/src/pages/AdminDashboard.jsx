import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reels, setReels] = useState([]);

  // Form States
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', categoryId: '' });
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', deliveryCharge: '', stock: '', categoryId: '', subcategoryId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [newReel, setNewReel] = useState({ productId: '' });
  const [reelVideoFile, setReelVideoFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, userRes, orderRes, reelRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/products?limit=100`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/reels`)
      ]);
      setProducts(prodRes.data.data.products || []);
      setCategories(catRes.data.data || []);
      setUsers(userRes.data.data || []);
      setOrders(orderRes.data.data?.orders || []);
      setReels(reelRes.data.data || []);
    } catch (error) {
      console.error('Error fetching admin data', error);
      alert(error.response?.data?.message || 'Error fetching data. Please refresh.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      if (categoryImage) formData.append('image', categoryImage);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        } 
      });
      fetchData();
      setNewCategory({ name: '' });
      setCategoryImage(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newSubcategory.name);
      if (subcategoryImage) formData.append('image', subcategoryImage);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories/${newSubcategory.categoryId}/subcategories`, formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        } 
      });
      fetchData();
      setNewSubcategory({ name: '', categoryId: '' });
      setSubcategoryImage(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add subcategory');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure? This will also delete all associated subcategories.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/subcategories/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
      if (imageFile) {
        formData.append('images', imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      };

      if (editingProductId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingProductId}`, formData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, config);
      }

      fetchData();
      setNewProduct({ name: '', description: '', price: '', deliveryCharge: '', stock: '', categoryId: '', subcategoryId: '' });
      setImageFile(null);
      setEditingProductId(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || `Failed to ${editingProductId ? 'update' : 'add'} product`);
    }
  };

  const handleEditProduct = (p) => {
    setEditingProductId(p.id);
    setNewProduct({
      name: p.name,
      description: p.description,
      price: p.price,
      deliveryCharge: p.deliveryCharge,
      stock: p.stock,
      categoryId: p.categoryId || '',
      subcategoryId: p.subcategoryId || ''
    });
    window.scrollTo(0, 0);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleAddReel = async (e) => {
    e.preventDefault();
    if (!reelVideoFile) return alert('Please attach a video file.');
    try {
      const formData = new FormData();
      formData.append('productId', newReel.productId);
      formData.append('video', reelVideoFile);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/reels`, formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        } 
      });
      fetchData();
      setNewReel({ productId: '' });
      setReelVideoFile(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add reel');
    }
  };

  const handleDeleteReel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reels/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete reel');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const tabs = ['products', 'categories', 'reels', 'users', 'orders'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex space-x-4 mb-6 border-b pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-medium ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-4 rounded border">
              <h2 className="text-xl font-semibold mb-4">Add Category</h2>
              <form onSubmit={handleAddCategory} className="flex gap-4">
                <input required type="text" placeholder="Category Name" value={newCategory.name} onChange={e => setNewCategory({ name: e.target.value })} className="border p-2 rounded flex-1" />
                <input type="file" accept="image/*" onChange={e => setCategoryImage(e.target.files[0])} className="border p-2 rounded flex-1" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add</button>
              </form>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>
              <form onSubmit={handleAddSubcategory} className="flex gap-4">
                <select required value={newSubcategory.categoryId} onChange={e => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })} className="border p-2 rounded flex-1">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input required type="text" placeholder="Subcategory Name" value={newSubcategory.name} onChange={e => setNewSubcategory({ ...newSubcategory, name: e.target.value })} className="border p-2 rounded flex-1" />
                <input type="file" accept="image/*" onChange={e => setSubcategoryImage(e.target.files[0])} className="border p-2 rounded flex-1" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add</button>
              </form>
            </div>

            <div>
              <h3 className="font-bold mb-2">Existing Categories:</h3>
              <ul className="list-disc pl-5">
                {categories.map(c => (
                  <li key={c.id} className="mb-4">
                    <div className="flex items-center gap-4">
                      {c.image ? <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded shadow" /> : <div className="w-10 h-10 bg-gray-200 rounded"></div>}
                      <span className="font-semibold text-lg">{c.name}</span>
                      {!['sarees', 'lehengas', 'unstitched-suits-suits', 'girls-ethnic-wear', 'wedding-collection', 'festive-collection'].includes(c.slug) && (
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete Category</button>
                      )}
                    </div>
                    <ul className="list-circle pl-5 text-gray-600 mt-1">
                      {c.subcategories?.map(sc => (
                        <li key={sc.id} className="flex items-center gap-3 mb-1">
                          {sc.image ? <img src={sc.image} alt={sc.name} className="w-6 h-6 object-cover rounded-full" /> : <div className="w-6 h-6 bg-gray-200 rounded-full"></div>}
                          <span>{sc.name}</span>
                          <button onClick={() => handleDeleteSubcategory(sc.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Delete Subcategory</button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{editingProductId ? 'Update Product' : 'Add Product'}</h2>
                {editingProductId && (
                  <button type="button" onClick={() => { setEditingProductId(null); setNewProduct({ name: '', description: '', price: '', deliveryCharge: '', stock: '', categoryId: '', subcategoryId: '' }); }} className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">Cancel Edit</button>
                )}
              </div>
              <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded" />
                <input required type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="border p-2 rounded" />
                <input required type="number" placeholder="Delivery Charge" value={newProduct.deliveryCharge} onChange={e => setNewProduct({ ...newProduct, deliveryCharge: e.target.value })} className="border p-2 rounded" />
                <input required type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="border p-2 rounded" />

                <select required value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value, subcategoryId: '' })} className="border p-2 rounded">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select
                  required={categories.find(c => c.id === newProduct.categoryId)?.subcategories?.length > 0}
                  value={newProduct.subcategoryId}
                  onChange={e => setNewProduct({ ...newProduct, subcategoryId: e.target.value })}
                  className="border p-2 rounded"
                >
                  <option value="">Select Subcategory {categories.find(c => c.id === newProduct.categoryId)?.subcategories?.length > 0 ? '' : '(Optional)'}</option>
                  {categories.find(c => c.id === newProduct.categoryId)?.subcategories?.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>

                <textarea required placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="border p-2 rounded col-span-2" rows="3"></textarea>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Product Image {editingProductId && '(Leave empty to keep existing)'}</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="flex-1 border p-2 rounded" />
                    {editingProductId && !imageFile && products.find(p => p.id === editingProductId)?.images?.[0] && (
                      <img src={products.find(p => p.id === editingProductId).images[0]} alt="Current" className="w-12 h-12 object-cover rounded shadow border" />
                    )}
                  </div>
                </div>

                <button type="submit" className="bg-primary text-white px-4 py-2 rounded col-span-2">{editingProductId ? 'Update Product' : 'Add Product'}</button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Image</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Delivery Charge</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b">
                      <td className="p-2">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                        )}
                      </td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">₹{p.price}</td>
                      <td className="p-2">₹{p.deliveryCharge || 0}</td>
                      <td className="p-2">{p.category?.name}</td>
                      <td className="p-2 space-x-4">
                        <button onClick={() => handleEditProduct(p)} className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Joined</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.map(o => (
              <div key={o.id} className="bg-white border rounded-lg p-5 shadow-sm">
                <div className="flex flex-wrap justify-between items-start border-b pb-4 border-gray-100 mb-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-mono mb-1">Order #{o.id}</p>
                    <p className="font-semibold text-lg hover:text-primary transition-colors cursor-default">{o.user?.name || 'Guest User'}</p>
                    <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary mb-1">₹{o.totalAmount}</p>
                    <div className="flex gap-2 justify-end">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded uppercase font-semibold">
                        {o.paymentMethod === 'ONLINE' ? 'Paid Online' : 'COD'}
                      </span>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className={`px-2 py-1 border rounded text-xs font-semibold uppercase outline-none cursor-pointer ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 border-b pb-1">Items</h4>
                    <div className="space-y-3">
                      {o.orderItems?.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium text-gray-800">{item.product?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.product?.category?.name || '-'} {item.product?.subcategory?.name ? `> ${item.product.subcategory.name}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.price} x {item.quantity}</p>
                            <p className="text-xs text-gray-500 font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {!o.orderItems || o.orderItems.length === 0 ? <p className="text-xs text-gray-400">No items visible</p> : null}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 border-b pb-1">Shipping Address</h4>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <p className="font-medium">{o.addressInfo?.firstName || 'N/A'} {o.addressInfo?.lastName || ''}</p>
                      <p className="mt-1">{o.addressInfo?.street || 'N/A'}, {o.addressInfo?.city || ''}</p>
                      <p>{o.addressInfo?.state || ''}, {o.addressInfo?.country || ''} - {o.addressInfo?.zip || ''}</p>

                      <div className="mt-3 space-y-1">
                        <p className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {o.addressInfo?.phone || 'N/A'}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {o.addressInfo?.email || o.user?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-500 text-center py-8">No orders found.</p>}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-4 rounded border">
              <h2 className="text-xl font-semibold mb-4">Add Reel Video (Max 3)</h2>
              {reels.length >= 3 ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium">You have reached the maximum limit of 3 reels. Please delete an existing reel to upload a new one.</div>
              ) : (
                <form onSubmit={handleAddReel} className="flex flex-col sm:flex-row gap-4">
                  <select required value={newReel.productId} onChange={e => setNewReel({ productId: e.target.value })} className="border p-2 rounded flex-auto">
                    <option value="">Link to Product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input required type="file" accept="video/*" onChange={e => setReelVideoFile(e.target.files[0])} className="border p-2 rounded flex-auto" />
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Upload Video</button>
                </form>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-4">Existing Reels ({reels.length} / 3)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reels.map(r => (
                  <div key={r.id} className="bg-white border rounded-xl overflow-hidden shadow-sm relative group">
                    <div className="aspect-[9/16] bg-black">
                      <video src={r.videoUrl} className="w-full h-full object-cover" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                    </div>
                    <div className="p-3 text-center border-t border-gray-100 bg-ivory">
                      <p className="text-sm font-semibold truncate mb-2">{r.productId?.name || 'Unknown Product'}</p>
                      <button onClick={() => handleDeleteReel(r.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-full shadow-sm transition-colors uppercase tracking-widest font-bold w-full">Delete Reel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
