import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndrdaembejcfyfjaifze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcmRhZW1iZWpjZnlmamFpZnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDU4NTAsImV4cCI6MjA1OTc4MTg1MH0.usrDPhv9Cu5KjLM56YxVX0_DY2BS2zAl1PG-2K-C9UQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
