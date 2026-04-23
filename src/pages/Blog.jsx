import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPosts(data);

      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!posts.length) return <p>No posts yet</p>;

  return (
    <div>
      <h1>Blog</h1>

      {posts.map((post) => (
        <div key={post.id}>
          <h2>
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}