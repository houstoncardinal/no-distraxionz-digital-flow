-- Assign nodistraxionz@gmail.com to admin role

INSERT INTO public.user_roles (user_id, role)
VALUES (
  'a57f07bb-9a58-472d-870a-65002b6750a2',
  'admin'
)
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
