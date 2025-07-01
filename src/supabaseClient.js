
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lidyjcugeqkrsnpwipmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZHlqY3VnZXFrcnNucHdpcG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDkxNjUsImV4cCI6MjA2NjU4NTE2NX0.Q5-9HKqkSZqTOCNzJJ_9o--MMVopkjNfzC-Rse7IpgI'
export const supabase = createClient(supabaseUrl, supabaseKey)
