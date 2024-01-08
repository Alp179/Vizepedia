import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://ibygzkntdaljyduuhivj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieWd6a250ZGFsanlkdXVoaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyNTcxMjAsImV4cCI6MjAxNzgzMzEyMH0.KbF5DpfsbDTT9OF7N1dLh55IB0iZDU1tf8VTk6tbqpY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
