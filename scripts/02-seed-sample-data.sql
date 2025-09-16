-- Insert sample Romanian companies for testing
INSERT INTO companies (
  name, cui, registration_number, legal_form, share_capital,
  registered_address, phone, email, website, activity_code,
  activity_description, registration_date, status
) VALUES 
(
  'Tech Solutions SRL',
  'RO12345678',
  'J40/1234/2024',
  'SRL',
  20000.00,
  '{"street": "Calea Victoriei 123", "city": "București", "county": "București", "postal_code": "010065", "country": "România"}',
  '+40721234567',
  'contact@techsolutions.ro',
  'https://techsolutions.ro',
  '6201',
  'Activități de realizare a soft-ului la comandă',
  '2024-01-15',
  'active'
),
(
  'Green Energy SA',
  'RO87654321',
  'J12/5678/2023',
  'SA',
  500000.00,
  '{"street": "Strada Energiei 45", "city": "Cluj-Napoca", "county": "Cluj", "postal_code": "400001", "country": "România"}',
  '+40264123456',
  'info@greenenergy.ro',
  'https://greenenergy.ro',
  '3511',
  'Producerea energiei electrice',
  '2023-03-20',
  'active'
),
(
  'Consulting Pro PFA',
  'RO11223344',
  'F40/9876/2024',
  'PFA',
  0.00,
  '{"street": "Bulevardul Unirii 67", "city": "București", "county": "București", "postal_code": "030833", "country": "România"}',
  '+40722987654',
  'contact@consultingpro.ro',
  NULL,
  '7022',
  'Activități de consultanță pentru afaceri și management',
  '2024-02-10',
  'active'
);

-- Insert sample shareholders
INSERT INTO company_shareholders (company_id, name, type, identification, share_percentage, share_value)
SELECT 
  c.id,
  'Ion Popescu',
  'individual',
  '1234567890123',
  60.00,
  12000.00
FROM companies c WHERE c.cui = 'RO12345678';

INSERT INTO company_shareholders (company_id, name, type, identification, share_percentage, share_value)
SELECT 
  c.id,
  'Maria Ionescu',
  'individual',
  '2345678901234',
  40.00,
  8000.00
FROM companies c WHERE c.cui = 'RO12345678';

-- Insert sample administrators
INSERT INTO company_administrators (company_id, name, cnp, position, appointment_date, mandate_duration)
SELECT 
  c.id,
  'Ion Popescu',
  '1234567890123',
  'Administrator unic',
  '2024-01-15',
  4
FROM companies c WHERE c.cui = 'RO12345678';

INSERT INTO company_administrators (company_id, name, cnp, position, appointment_date, mandate_duration)
SELECT 
  c.id,
  'Alexandru Georgescu',
  '3456789012345',
  'Președinte Consiliu de Administrație',
  '2023-03-20',
  4
FROM companies c WHERE c.cui = 'RO87654321';

-- Insert sample financial data
INSERT INTO company_financial_data (company_id, year, revenue, profit, assets, liabilities, employees_count, submitted_date)
SELECT 
  c.id,
  2023,
  150000.00,
  25000.00,
  75000.00,
  30000.00,
  5,
  '2024-03-31'
FROM companies c WHERE c.cui = 'RO12345678';

INSERT INTO company_financial_data (company_id, year, revenue, profit, assets, liabilities, employees_count, submitted_date)
SELECT 
  c.id,
  2023,
  2500000.00,
  350000.00,
  1200000.00,
  600000.00,
  25,
  '2024-03-31'
FROM companies c WHERE c.cui = 'RO87654321';
