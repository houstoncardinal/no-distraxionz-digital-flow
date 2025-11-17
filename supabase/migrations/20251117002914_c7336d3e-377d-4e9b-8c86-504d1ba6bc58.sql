-- Create first admin user function
-- This is a one-time setup function to create the initial admin

CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email text,
  user_password text,
  user_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- This function should only be used for initial setup
  -- In production, you'd want additional security checks here
  
  -- Check if admin already exists
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Admin user already exists'
    );
  END IF;

  -- Create user in auth.users (this is a simplified version)
  -- In reality, you'd use Supabase auth API to create the user
  RETURN json_build_object(
    'success', true,
    'message', 'Please use Supabase Auth API or dashboard to create the first user, then run: INSERT INTO user_roles (user_id, role) VALUES (''USER_ID_HERE'', ''admin'');'
  );
END;
$$;

-- Helper function to make any existing user an admin
CREATE OR REPLACE FUNCTION public.make_user_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.make_user_admin IS 'Makes an existing user an admin. Usage: SELECT make_user_admin(''user-uuid-here'');';