-- Row-level security rules for the portfolio CMS.
-- Run in the Supabase SQL Editor after replacing YOUR-USER-ID (5 places) with the
-- admin's ID from Authentication > Users. An unreplaced placeholder fails with a
-- uuid error, and the transaction then leaves everything unchanged.

begin;

-- Posts: the public reads published posts only; the owner can do everything
drop policy "Allow authenticated full access on posts" on public.posts;
drop policy "Allow anon read published posts" on public.posts; -- duplicate of "Public read posts"

create policy "Owner full access on posts" on public.posts
for all to authenticated
using ((select auth.uid()) = 'YOUR-USER-ID');

-- Projects: public read; the owner can do everything
drop policy "Allow authenticated full access on projects" on public.projects;
drop policy "Allow anon read projects" on public.projects; -- duplicate of "Public read projects"

create policy "Owner full access on projects" on public.projects
for all to authenticated
using ((select auth.uid()) = 'YOUR-USER-ID');

-- Storage: only the owner can upload or remove images. The bucket is public, so
-- image URLs keep working without a select rule for visitors.
drop policy "Allow authenticated uploads 1ffg0oo_0" on storage.objects;

create policy "Owner can upload images" on storage.objects
for insert to authenticated
with check (bucket_id = 'images' and (select auth.uid()) = 'YOUR-USER-ID');

-- Removing a file needs both select and delete
create policy "Owner can read images" on storage.objects
for select to authenticated
using (bucket_id = 'images' and (select auth.uid()) = 'YOUR-USER-ID');

create policy "Owner can delete images" on storage.objects
for delete to authenticated
using (bucket_id = 'images' and (select auth.uid()) = 'YOUR-USER-ID');

-- Matches MAX_FILE_SIZE in src/lib/validation.js. SVG is left out because it can contain scripts.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
where id = 'images';

commit;
