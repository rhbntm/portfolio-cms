import { useParams } from "react-router-dom";
import { usePost } from "../../hooks";
import { Loading, ErrorMessage } from "../../components";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = usePost(slug);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
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