import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  deletePost,
  fetchAuthStatus,
  fetchPosts,
  updatePost,
} from "../services/queries";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
}

interface HomeProps {
  onError: (error: any) => void;
}

const Home: React.FC<HomeProps> = ({ onError }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetchAuthStatus();
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      onError(error);
    }
  }, [onError]);

  const fetchPostsFront = useCallback(async () => {
    try {
      const response = await fetchPosts();
      setPosts(response.data);
    } catch (error) {
      onError(error);
    }
  }, [onError]);

  useEffect(() => {
    fetchPostsFront();
    checkAuthStatus();
  }, [fetchPostsFront, checkAuthStatus]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleDelete = (post: Post) => {
    setDeleteConfirmPost(post);
  };

  const confirmDelete = async () => {
    if (deleteConfirmPost) {
      try {
        await deletePost(deleteConfirmPost._id);
        fetchPostsFront();
        setDeleteConfirmPost(null);
      } catch (error) {
        onError(error);
      }
    }
  };

  const handleUpdate = async () => {
    if (editingPost) {
      try {
        await updatePost(editingPost._id, editTitle, editContent);
        fetchPostsFront();
        setEditingPost(null);
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Latest Posts
      </Typography>
      {posts.map((post) => (
        <Card key={post._id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              By {post.author.username}
            </Typography>
            <Typography variant="body2" component="p">
              {post.content}
            </Typography>
            {isLoggedIn && (
              <>
                <Button onClick={() => handleEdit(post)}>Edit</Button>
                <Button onClick={() => handleDelete(post)}>Delete</Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      <Dialog open={editingPost !== null} onClose={() => setEditingPost(null)}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingPost(null)}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmPost !== null}
        onClose={() => setDeleteConfirmPost(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmPost(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
