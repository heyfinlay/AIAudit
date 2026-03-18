insert into industries (name, template_checks) values
('Mortgage Broker', '["Enquiry handling speed","Trust signals","Booking flow","Follow-up cadence"]'::jsonb),
('Accounting Firm', '["Consultation funnel","Authority content","Intake friction","Response expectations"]'::jsonb)
on conflict (name) do nothing;
