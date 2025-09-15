-- Seed basic foreign exchange rates
INSERT INTO fx_rates (from_currency, to_currency, rate, effective_date) VALUES
-- USD base rates
('USD', 'EUR', 0.92, CURRENT_DATE),
('USD', 'GBP', 0.79, CURRENT_DATE),
('USD', 'JPY', 149.50, CURRENT_DATE),
('USD', 'CAD', 1.35, CURRENT_DATE),

-- EUR base rates
('EUR', 'USD', 1.09, CURRENT_DATE),
('EUR', 'GBP', 0.86, CURRENT_DATE),
('EUR', 'JPY', 162.80, CURRENT_DATE),

-- GBP base rates
('GBP', 'USD', 1.27, CURRENT_DATE),
('GBP', 'EUR', 1.16, CURRENT_DATE),
('GBP', 'JPY', 189.20, CURRENT_DATE)

ON CONFLICT (from_currency, to_currency, effective_date) DO NOTHING;
