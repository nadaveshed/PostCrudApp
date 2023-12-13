import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostText, setEditPostText] = useState('');

  useEffect(() => {
    // Fetch posts from the API
    fetch('http://localhost:4000/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleCreatePost = () => {
    // Create a new post
    fetch('http://localhost:4000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newPost }),
    })
      .then((response) => response.json())
      .then((data) => setPosts([...posts, data]))
      .catch((error) => console.error('Error creating post:', error));

    setNewPost('');
  };

  const handleEditStart = (postId, currentTitle) => {
    setEditingPostId(postId);
    setEditPostText(currentTitle);
  };
  
  const handleEditSave = (postId) => {
    // Save the edited post
    fetch(`http://localhost:4000/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editPostText }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === data.id ? { ...post, title: data.title } : post))
        );
        setEditingPostId(null);
        setEditPostText('');
      })
      .catch((error) => console.error('Error editing post:', error));
  };
  
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditPostText('');
  };
  

  const handleDeletePost = (postId) => {
    // Delete a post
    fetch(`http://localhost:4000/api/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(() => setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)))
      .catch((error) => console.error('Error deleting post:', error));
  };

  return (
    <div className="App">
      <h1>Posts from API</h1>
      <ol>
        {posts.map((post) => (
          <li key={post.id}>
            {editingPostId === post.id ? (
              <>
                <input
                  type="text"
                  value={editPostText}
                  onChange={(e) => setEditPostText(e.target.value)}
                />
                <button onClick={() => handleEditSave(post.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {post.title}
                <button onClick={() => handleEditStart(post.id, post.title)}>Edit</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ol>
      <div>
        <input
          type="text"
          placeholder="New Post Title"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handleCreatePost}>Add Post</button>
      </div>
    </div>
  );
}

export default App;