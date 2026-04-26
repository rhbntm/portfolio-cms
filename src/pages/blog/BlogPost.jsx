import { useParams } from "react-router-dom";
import { usePost } from "../../hooks/posts/usePost";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = usePost(slug);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Blog post not found</p>;

  return (
    <div>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }} />
      )}
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}