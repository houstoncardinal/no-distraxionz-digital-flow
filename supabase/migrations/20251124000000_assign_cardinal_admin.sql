-- Assign cardinal.hunain@gmail.com to admin role

INSERT INTO public.user_roles (user_id, role)
VALUES (
  '5058d6e9-9438-4606-956e-f2e7c856d155',
  'admin'
)
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
