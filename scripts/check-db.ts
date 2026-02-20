
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
    const { data, error } = await supabase
        .from('menu_items')
        .select('name, image_url')
        .limit(5);

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('--- Database Check ---');
    data.forEach(item => {
        console.log(`${item.name}: ${item.image_url}`);
    });
}

checkDb();
