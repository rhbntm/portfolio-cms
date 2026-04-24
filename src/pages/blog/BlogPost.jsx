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
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}