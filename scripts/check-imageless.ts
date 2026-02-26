import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { buildGalleryManifest } from '../src/lib/image-matcher';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkImages() {
    const { data: menuItems, error } = await supabase.from('menu_items').select('*');

    if (error) {
        console.error("Error fetching", error);
        return;
    }

    const manifest = buildGalleryManifest(menuItems || []);

    let databaseImagesCount = 0;
    let codeMatchedCount = 0;
    let completelyImageless = [];

    for (const item of menuItems || []) {
        const hasDbImage = item.image_url && item.image_url.startsWith('http');
        const localGallery = manifest[item.id] || [];
        const hasLocalImage = localGallery.length > 0;

        if (hasDbImage) {
            databaseImagesCount++;
        } else if (hasLocalImage) {
            codeMatchedCount++;
        } else {
            completelyImageless.push(item.name);
        }
    }

    console.log(`TOTAL: ${menuItems.length}`);
    console.log(`DB IMG: ${databaseImagesCount}`);
    console.log(`LOCAL/FOLDER IMG: ${codeMatchedCount}`);
    console.log(`MISSING: ${completelyImageless.length}`);
    console.log('--- MISSING ITEMS ---');
    completelyImageless.forEach(i => console.log(i));
}

checkImages();
