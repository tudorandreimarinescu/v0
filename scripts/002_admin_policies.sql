-- Admin policies for managing the SaaS platform
-- First, let's add an admin role to profiles if it doesn't exist
DO $$
BEGIN
    -- Check if role column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Update existing profiles to have user role if null
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- Create admin policies for subscription_plans
CREATE POLICY "subscription_plans_admin_all" ON subscription_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create admin policies for user_subscriptions (admins can view/manage all)
CREATE POLICY "user_subscriptions_admin_select" ON user_subscriptions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "user_subscriptions_admin_update" ON user_subscriptions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create admin policies for user_projects
CREATE POLICY "user_projects_admin_select" ON user_projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create admin policies for usage_tracking
CREATE POLICY "usage_tracking_admin_select" ON usage_tracking FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create admin policies for notifications (admins can create notifications for any user)
CREATE POLICY "notifications_admin_insert" ON notifications FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "notifications_admin_select" ON notifications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create a view for admin dashboard analytics
CREATE OR REPLACE VIEW admin_analytics AS
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'user') as total_users,
  (SELECT COUNT(*) FROM user_subscriptions WHERE status = 'active') as active_subscriptions,
  (SELECT COUNT(*) FROM user_projects) as total_projects,
  (SELECT SUM(sp.price_monthly) FROM user_subscriptions us JOIN subscription_plans sp ON us.plan_id = sp.id WHERE us.status = 'active') as monthly_revenue,
  (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d;

-- Grant access to admin analytics view
GRANT SELECT ON admin_analytics TO authenticated;

-- Create RLS policy for admin analytics view
CREATE POLICY "admin_analytics_admin_only" ON admin_analytics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
