import { createClient } from '@supabase/supabase-js';

//initialise supabase
//const supabaseUrl = 'https://svcqcphbwmjtjejoytlj.supabase.co';
const supabaseUrl = process.env.SUPABSE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
//const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Y3FjcGhid21qdGplam95dGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAxODQ5MzYsImV4cCI6MjAwNTc2MDkzNn0.y5R4o2VRItk82uVDnaKc9fesZzKBnzFFH6x4vQ7wbAc";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function signIn(creds) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: creds["email"],
            password: creds["password"]
        });
        if (!error) {
            return data;
        } else {
            //pass
        }
    } catch {
        //pass
    }
}

export async function getUserSession() {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
            return data;
        } else {
            //pass
        }
    } catch {
        //pass
    }
}