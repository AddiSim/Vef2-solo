import React, { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
  user_id: number;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}categories`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) throw new Error('Failed to fetch categories');
        
          const data = await response.json();
          console.log(data); 
            
          if (data.rows && Array.isArray(data.rows)) {
            setCategories(data.rows);
          } else {
            console.error("Fetched data is not as expected:", data);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      
  
    fetchCategories();
  }, []);
  

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (data.rows && Array.isArray(data.rows)) {
      setCategories(data.rows);
    } else {
      console.error("Fetched data is not as expected:", data);
      setCategories([]);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        name: newCategoryName,
        user_id: userId,
        }),
    });
    if (response.ok) {
      fetchCategories(); 
      setNewCategoryName(""); 
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories/${editingCategory.id}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editCategoryName }),
    });
    if (response.ok) {
      fetchCategories(); 
      setEditingCategory(null); 
      setEditCategoryName(""); 
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories/${id}`, {
      method: 'DELETE',
      headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (response.ok) {
      fetchCategories(); // Refresh the list of categories
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name} 
            <button onClick={() => { setEditingCategory(category); setEditCategoryName(category.name); }}>Edit</button>
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        {editingCategory ? (
          <form onSubmit={handleEditCategory}>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="Edit Category Name"
              required
            />
            <button type="submit">Update Category</button>
            <button onClick={() => setEditingCategory(null)}>Cancel</button>
          </form>
        ) : (
          <form onSubmit={handleAddCategory}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New Category Name"
              required
            />
            <button type="submit">Add Category</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Categories;
