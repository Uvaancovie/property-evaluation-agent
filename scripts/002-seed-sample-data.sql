-- Insert sample properties for testing
INSERT INTO properties (address, bedrooms, bathrooms, area, status) VALUES
('123 Oak Street, Cape Town', 3, 2, 150.5, 'NEW'),
('456 Pine Avenue, Johannesburg', 4, 3, 220.0, 'NEW'),
('789 Maple Drive, Durban', 2, 1, 95.0, 'NEW'),
('321 Cedar Lane, Pretoria', 5, 4, 350.0, 'NEW')
ON CONFLICT DO NOTHING;
