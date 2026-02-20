
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMenu() {
    const { count, error } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting menu items:', error);
    } else {
        console.log(`Total menu items in DB: ${count}`);
    }
}

checkMenu();
