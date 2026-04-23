import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setProjects(data);
    }

    fetchProjects();
  }, []);

  return (
    <div>
      {projects.map(p => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}