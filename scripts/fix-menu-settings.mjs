import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const settings = [
    { setting_key: 'menu_active', setting_value: 'true' },
    { setting_key: 'monday_menu_active', setting_value: 'true' },
    { setting_key: 'thursday_menu_active', setting_value: 'true' },
];

for (const s of settings) {
    const { error } = await supabase
        .from('menu_settings')
        .upsert(s, { onConflict: 'setting_key' });

    if (error) {
        console.error(`❌ Failed to set ${s.setting_key}:`, error.message);
    } else {
        console.log(`✅ ${s.setting_key} = ${s.setting_value}`);
    }
}

// Verify
const { data } = await supabase.from('menu_settings').select('*');
console.log('\nCurrent menu settings:', data);
