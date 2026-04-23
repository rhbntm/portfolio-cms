import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
        setProject(null);
      } else {
        setProject(data);
      }

      setLoading(false);
    }

    fetchProject();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return <h1>{project.title}</h1>;
}
