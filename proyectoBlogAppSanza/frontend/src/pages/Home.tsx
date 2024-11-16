import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

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
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Home;
