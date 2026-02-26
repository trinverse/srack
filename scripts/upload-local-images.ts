import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { buildGalleryManifest } from '../src/lib/image-matcher';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadLocalImages() {
    console.log('Fetching menu items...');
    const { data: menuItems, error } = await supabase.from('menu_items').select('*');

    if (error) {
        console.error("Error fetching menu items:", error);
        return;
    }

    console.log(`Building image manifest for ${menuItems.length} items...`);
    const manifest = buildGalleryManifest(menuItems || []);

    const publicDir = path.join(process.cwd(), 'public');
    let uploadedCount = 0;
    let errorCount = 0;

    for (const item of menuItems || []) {
        const hasDbImage = item.image_url && item.image_url.startsWith('http');

        // Skip if already has a valid DB image
        if (hasDbImage) {
            continue;
        }

        const localGalleryPaths = manifest[item.id] || [];
        if (localGalleryPaths.length === 0) {
            continue; // Truly missing, no local image to upload
        }

        // We take the first matched local image
        const localImagePath = localGalleryPaths[0]; // e.g., '/menu-images/palak paneer.jpg'

        const absoluteFilePath = path.join(publicDir, localImagePath);

        if (!fs.existsSync(absoluteFilePath)) {
            console.warn(`File not found at ${absoluteFilePath}`);
            continue;
        }

        console.log(`Uploading local image for [${item.name}]: ${localImagePath}`);

        try {
            const fileBuffer = fs.readFileSync(absoluteFilePath);
            const ext = path.extname(absoluteFilePath).toLowerCase();
            let contentType = 'image/jpeg';
            if (ext === '.png') contentType = 'image/png';
            else if (ext === '.webp') contentType = 'image/webp';
            else if (ext === '.gif') contentType = 'image/gif';

            const fileName = path.basename(absoluteFilePath);
            // Construct a safe storage path: 'menu-images/some-unique-suffix/filename'
            const storagePath = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

            // 1. Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(storagePath, fileBuffer, {
                    contentType: contentType,
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error(`Failed to upload ${fileName}:`, uploadError);
                errorCount++;
                continue;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('menu-images')
                .getPublicUrl(storagePath);

            // 3. Update Database Record
            const { error: updateError } = await supabase
                .from('menu_items')
                .update({ image_url: publicUrl })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Failed to update DB for ${item.name}:`, updateError);
                errorCount++;
            } else {
                console.log(`✅ Success: ${item.name} -> ${publicUrl}`);
                uploadedCount++;
            }

        } catch (err) {
            console.error(`Exception while processing ${item.name}:`, err);
            errorCount++;
        }
    }

    console.log('--- UPLOAD COMPLETE ---');
    console.log(`Successfully uploaded and linked: ${uploadedCount} items`);
    console.log(`Errors encountered: ${errorCount} items`);
}

uploadLocalImages();
