import { usePosts } from "../../hooks/posts/usePosts";
import { Link } from "react-router-dom";

export default function Blog() {
  const { data: posts, loading, error } = usePosts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No posts yet</p>;

  return (
    <div>
      <h1>Blog</h1>

      {posts.map((post) => (
        <div key={post.id}>
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} style={{ width: "120px", height: "120px", objectFit: "cover", marginRight: "8px", verticalAlign: "middle" }} />
          ) : (
            <span style={{ display: "inline-block", width: "120px", height: "120px", background: "#eee", marginRight: "8px", verticalAlign: "middle" }} />
          )}
          <h2 style={{ display: "inline" }}>
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