import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get next Monday Date string
function getNextMonday() {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    return d.toISOString().split('T')[0];
}

async function addAllItemsToMonday() {
    const nextMonday = getNextMonday();
    console.log(`Target Date for Monday Menu: ${nextMonday}`);

    // Fetch all active menu items
    const { data: menuItems, error: fetchError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('is_active', true);

    if (fetchError) {
        console.error("Error fetching menu items:", fetchError);
        return;
    }

    if (!menuItems || menuItems.length === 0) {
        console.log("No menu items found.");
        return;
    }

    console.log(`Found ${menuItems.length} active menu items.`);

    // Clear any existing menu for that date to avoid duplicates
    const { error: deleteError } = await supabase
        .from('weekly_menus')
        .delete()
        .eq('menu_date', nextMonday)
        .eq('order_day', 'monday');

    if (deleteError) {
        console.error("Error clearing existing menu:", deleteError);
    }

    // Batch insert all items
    const itemsToInsert = menuItems.map(item => ({
        menu_date: nextMonday,
        order_day: 'monday',
        menu_item_id: item.id
    }));

    const { error: insertError } = await supabase
        .from('weekly_menus')
        .insert(itemsToInsert);

    if (insertError) {
        console.error("Error inserting items into weekly menu:", insertError);
    } else {
        console.log(`✅ Successfully added all ${menuItems.length} items to the Monday menu!`);
    }
}

addAllItemsToMonday();
