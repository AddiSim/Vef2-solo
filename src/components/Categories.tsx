import React, { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
    
            const result = await response.json();
            if (!Array.isArray(result.rows)) {
                console.error('Data is not an array:', result);
                throw new Error('Expected an array of categories.');
            }
            setCategories(result.rows);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
  
    fetchCategories();
  }, []);
  

  const fetchCategories = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories`);
    const data = await response.json();
    setCategories(data);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCategoryName }),
    });
    if (response.ok) {
      fetchCategories(); // Refresh the list of categories
      setNewCategoryName(""); // Reset the input field
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}categories/${editingCategory.id}`, {
      method: 'PUT', // or PATCH if your API supports it
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editCategoryName }),
    });
    if (response.ok) {
      fetchCategories(); // Refresh the list
      setEditingCategory(null); // Exit editing mode
      setEditCategoryName(""); // Reset the input field
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}categories/${id}`, {
      method: 'DELETE',
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
