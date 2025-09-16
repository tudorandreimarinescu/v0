-- Create user_carts table for storing authenticated user cart data
CREATE TABLE IF NOT EXISTS user_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_data JSONB NOT NULL DEFAULT '{"items": [], "lastUpdated": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cart" ON user_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart" ON user_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON user_carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart" ON user_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_carts_updated_at ON user_carts(updated_at);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_carts_updated_at
  BEFORE UPDATE ON user_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_carts_updated_at();
