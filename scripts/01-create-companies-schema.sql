-- Create companies table for Romanian company management
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cui VARCHAR(20) UNIQUE NOT NULL, -- Romanian tax identification number
  registration_number VARCHAR(50) UNIQUE NOT NULL, -- J40/123/2024 format
  legal_form VARCHAR(100) NOT NULL, -- SRL, SA, PFA, etc.
  share_capital DECIMAL(15,2),
  registered_address JSONB NOT NULL, -- Full address details
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  activity_code VARCHAR(10), -- CAEN code
  activity_description TEXT,
  registration_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, dissolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create company_shareholders table
CREATE TABLE IF NOT EXISTS company_shareholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- individual, company
  identification VARCHAR(50) NOT NULL, -- CNP for individuals, CUI for companies
  share_percentage DECIMAL(5,2) NOT NULL,
  share_value DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_administrators table
CREATE TABLE IF NOT EXISTS company_administrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  cnp VARCHAR(13), -- Romanian personal identification number
  position VARCHAR(100) NOT NULL, -- administrator, manager, etc.
  appointment_date DATE,
  mandate_duration INTEGER, -- in years
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_documents table
CREATE TABLE IF NOT EXISTS company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- certificate, balance_sheet, etc.
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_financial_data table
CREATE TABLE IF NOT EXISTS company_financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  revenue DECIMAL(15,2),
  profit DECIMAL(15,2),
  assets DECIMAL(15,2),
  liabilities DECIMAL(15,2),
  employees_count INTEGER,
  submitted_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, year)
);

-- Create user_company_access table for permissions
CREATE TABLE IF NOT EXISTS user_company_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  access_level VARCHAR(50) NOT NULL, -- owner, admin, viewer
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, company_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_cui ON companies(cui);
CREATE INDEX IF NOT EXISTS idx_companies_registration_number ON companies(registration_number);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);
CREATE INDEX IF NOT EXISTS idx_company_shareholders_company_id ON company_shareholders(company_id);
CREATE INDEX IF NOT EXISTS idx_company_administrators_company_id ON company_administrators(company_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_company_id ON company_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_type ON company_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_company_financial_data_company_id ON company_financial_data(company_id);
CREATE INDEX IF NOT EXISTS idx_company_financial_data_year ON company_financial_data(year);
CREATE INDEX IF NOT EXISTS idx_user_company_access_user_id ON user_company_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_company_access_company_id ON user_company_access(company_id);

-- Add RLS policies for security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_shareholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_company_access ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view companies they have access to" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can insert companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update companies they own or admin" ON companies
  FOR UPDATE USING (
    id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND access_level IN ('owner', 'admin') AND is_active = true
    )
  );

-- Company shareholders policies
CREATE POLICY "Users can view shareholders of accessible companies" ON company_shareholders
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage shareholders of owned/admin companies" ON company_shareholders
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND access_level IN ('owner', 'admin') AND is_active = true
    )
  );

-- Company administrators policies
CREATE POLICY "Users can view administrators of accessible companies" ON company_administrators
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage administrators of owned/admin companies" ON company_administrators
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND access_level IN ('owner', 'admin') AND is_active = true
    )
  );

-- Company documents policies
CREATE POLICY "Users can view documents of accessible companies" ON company_documents
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage documents of owned/admin companies" ON company_documents
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND access_level IN ('owner', 'admin') AND is_active = true
    )
  );

-- Company financial data policies
CREATE POLICY "Users can view financial data of accessible companies" ON company_financial_data
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage financial data of owned/admin companies" ON company_financial_data
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND access_level IN ('owner', 'admin') AND is_active = true
    )
  );

-- User company access policies
CREATE POLICY "Users can view their own company access" ON user_company_access
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Company owners can manage access" ON user_company_access
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_company_access 
      WHERE user_id = auth.uid() AND access_level = 'owner' AND is_active = true
    )
  );
