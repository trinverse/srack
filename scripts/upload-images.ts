
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mime from 'mime-types';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_MANAGER_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_MANAGER_KEY) required in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'menu-images';

// Copy matching logic essentials
function normalize(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const SPELLING_ALIASES: Record<string, string> = {
    'kadhi': 'kadi', 'kadi': 'kadhi',
    'baingan': 'baigan', 'baigan': 'baingan',
    'hyderabadi': 'hydrabadi', 'hydrabadi': 'hyderabadi',
    'makhani': 'makhni', 'makhni': 'makhani',
    'lababdaar': 'lababdar', 'lababdar': 'lababdaar',
    'saalan': 'salan', 'salan': 'saalan',
    'choleychana': 'cholechana', 'cholechana': 'choleychana',
    'choleychicken': 'cholechicken', 'cholechicken': 'choleychicken',
    'cucumbar': 'cucumber', 'cucumber': 'cucumbar',
    'ghotala': 'gotala', 'gotala': 'ghotala',
    'shahipaneer': 'sahipaneer', 'sahipaneer': 'shahipaneer',
    'turvar': 'tuvar', 'tuvar': 'turvar',
    'turia': 'turai', 'turai': 'turia',
    'waali': 'wali', 'wali': 'waali',
    'vegtable': 'vegetable', 'vegetable': 'vegtable',
    'roti': 'rotie', 'rotie': 'roti',
    'roties': 'roti',
    'chiickencurry': 'chickencurry',
    'poran': 'puran', 'puran': 'poran',
    'gujvar': 'guvar', 'guvar': 'gujvar',
    'mushroom': 'mashroom', 'mashroom': 'mushroom',
    'chili': 'chilli', 'chilli': 'chili',
    'chilimilli': 'chillimilli', 'chillimilli': 'chilimilli',
    'eggplants': 'eggplant', 'eggplant': 'eggplants',
    'sindhikadhi': 'sindhikadi', 'sindhikadi': 'sindhikadhi',
    'stuffedcheezy': 'stuffedcheesy', 'stuffedcheesy': 'stuffedcheezy',
    'farali': 'farari', 'farari': 'farali', 'ferrari': 'farari',
    'lasaniya': 'lasania', 'lasania': 'lasaniya',
    'gujrati': 'gujarati', 'gujarati': 'gujrati',
    'dhokli': 'dhokri', 'dhokri': 'dhokli',
    'veg': 'vegetable',
    'srouted': 'sprouted', 'sprouted': 'srouted',
    'tamarind': 'tamrind', 'tamrind': 'tamarind',
    'bhuna': 'bhunna',
    'rajasthani': 'rajesthani', 'rajesthani': 'rajasthani',
    'rasavalu': 'rasavala', 'rasavala': 'rasavalu',
    'saak': 'shaak', 'shaak': 'saak',
    'chana': 'channa',
};

const MANUAL_OVERRIDES: Record<string, string> = {
    'gobimatarcarrot': 'gobimatarcarrots',
    'chickenbhuna': 'bhunachicken',
    'chickenmalabar': 'malabarchicken',
    'dahiwalealoo': 'dahialoo',
    'bainganaloo': 'aloobaingan',
    'gobialoo': 'aloogobi',
    'aloosaag': 'saagaloo',
    'vegjalfrezi': 'vegetablejalfrezi',
    'vegkolhapuri': 'vegetablekolhapuri',
    'vegkorma': 'vegetablekorma',
    'vegmakhni': 'vegetablemakhni',
    'cholemasala': 'cholechana',
    'chole': 'cholechana',
    'potatoonionrasavalushaak': 'potatoonionrasavalacurry',
    'guttivankayakura': 'gutivankayakura',
    'hyderabadibaingan': 'hydrabadibaiganmasala',
    'gujaratilasaniyabatata': 'lasaniyabatata',
    'gujratidaaldhokli': 'daaldhokli',
    'besanpakorakadhi': 'pakorakadi',
    'laukichanadaal': 'laukidaal',
    'laukimoongdaal': 'laukidaal',
    'methipakorakadhi': 'methipakorakadi',
    'palakpakorakadhi': 'palakpakorakadi',
    'tuvarlilvakadhi': 'lilvakadhi',
    'sroutedmoongandmathkisabji': 'moongandmathkisabji',
    'gattacurry': 'rajesthanigattacurry',
    'mirchikasaalan': 'mirchikasalan',
    'paneercholemasala': 'cholepaneer',
    'paneermushroommassa': 'mashroompaneer',
    'sweetpotatoaloosabji': 'sweetpotatocurry',
    'sweetpotatosabjidry': 'sweetpotatocurry',
    'mixveghyderabadi': 'mixveghydrabadi',
    'madraschickencurry': 'madraschiickencurry',
    'stuffedeggplants': 'stuffedeggplant',
    'wholewheatroti': 'wholewheatrotie',
    'panchporandaal': 'panchpurandaal',
    'sevtomato': 'sevtomatocurry',
    'vegjaipurimasala': 'vegjaipuri',
    'moongandmathsprouted': 'moongandmathkisabji',
    'tamarindrice': 'tamrindchutney',
    'tuvarbaigansaak': 'tuvarringannushaak',
    'vaalnusaak': 'vaalnushaak',
    'kalachanashaak': 'kalachananushaak',
    'kalachana': 'kalachananushaak',
    'afghanchicken': 'afghanichickencurry',
    'afghanichicken': 'afghanichickencurry',
    'aloobhajimarathidrypotatocurry': 'marathialoobhajisukhi',
    'faralialoosabji': 'fararialoosabji',
};

const IGNORABLE_SUFFIXES = ['curry', 'masala', 'sabji', 'fry', 'dry', 'gravy', 'shaak', 'saak', 'sukhi', 'nu', 'ki', 'ka'];

function getAliases(norm: string): string[] {
    const aliases = [norm];
    if (SPELLING_ALIASES[norm]) aliases.push(SPELLING_ALIASES[norm]);
    for (const [from, to] of Object.entries(SPELLING_ALIASES)) {
        if (norm.includes(from)) {
            aliases.push(norm.replace(from, to));
        }
    }
    for (const suffix of IGNORABLE_SUFFIXES) {
        if (norm.endsWith(suffix)) {
            const stripped = norm.slice(0, -suffix.length);
            if (stripped.length > 3) aliases.push(stripped);
        }
    }
    return [...new Set(aliases)];
}

async function uploadImages() {
    const imagesDir = path.join(process.cwd(), 'public', 'menu-images');
    if (!fs.existsSync(imagesDir)) {
        console.error('Directory not found:', imagesDir);
        return;
    }

    // 1. Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === BUCKET_NAME)) {
        console.log('Creating bucket:', BUCKET_NAME);
        await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    }

    const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
    console.log(`Found ${files.length} images to upload.`);

    // 2. Upload files
    for (const file of files) {
        const filePath = path.join(imagesDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = mime.lookup(file) || 'application/octet-stream';

        const { error } = await supabase.storage.from(BUCKET_NAME).upload(file, fileBuffer, {
            contentType,
            upsert: true,
        });

        if (error) {
            console.error(`Error uploading ${file}:`, error.message);
        } else {
            process.stdout.write('.');
        }
    }
    console.log('\nAll images uploaded to Supabase Storage.');

    // 3. Match and Update DB
    const { data: menuItems, error: fetchError } = await supabase
        .from('menu_items')
        .select('id, name');

    if (fetchError || !menuItems) {
        console.error('Error fetching menu items:', fetchError?.message);
        return;
    }

    const fileIndex = files.map(file => {
        const baseName = path.parse(file).name;
        const cleanBaseName = baseName.replace(/\(\d+\)/g, '').replace(/\s\d+$/, '').replace(/\.\d+$/, '').trim();
        const norm = normalize(cleanBaseName);
        const normStripped = norm.replace(/\d+$/, '');
        return { file, norm, normStripped };
    });

    const projectUrl = supabaseUrl.replace('.supabase.co', '');
    const publicBaseUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}`;

    console.log('Matching and updating database records...');

    for (const item of menuItems) {
        const cleanItemName = item.name.replace(/\(.*?\)/g, '').trim();
        const normalizedItemName = normalize(cleanItemName);
        const itemAliases = getAliases(normalizedItemName);
        let matchedFile: string | null = null;

        for (const entry of fileIndex) {
            const fileAliases = getAliases(entry.normStripped);
            let matched = false;

            for (const itemAlias of itemAliases) {
                if (matched) break;
                for (const fileAlias of fileAliases) {
                    if (matched) break;
                    if (fileAlias === itemAlias) { matched = true; break; }
                    if (fileAlias.startsWith(itemAlias)) {
                        const suffix = fileAlias.slice(itemAlias.length);
                        if (/^[0-9]*$/.test(suffix)) { matched = true; break; }
                    }
                    if (itemAlias.startsWith(fileAlias)) {
                        const suffix = itemAlias.slice(fileAlias.length);
                        if (IGNORABLE_SUFFIXES.some(s => suffix === s)) { matched = true; break; }
                    }
                }
            }

            if (!matched) {
                if (entry.norm === normalizedItemName || entry.normStripped === normalizedItemName) {
                    matched = true;
                }
                if (entry.norm.startsWith(normalizedItemName)) {
                    const suffix = entry.norm.slice(normalizedItemName.length);
                    if (/^[0-9]+$/.test(suffix)) matched = true;
                }
            }

            if (!matched) {
                const overrideTarget = MANUAL_OVERRIDES[normalizedItemName];
                if (overrideTarget) {
                    if (entry.normStripped === overrideTarget || entry.norm === overrideTarget) matched = true;
                }
            }

            if (matched) {
                matchedFile = entry.file;
                break;
            }
        }

        if (matchedFile) {
            const publicUrl = `${publicBaseUrl}/${encodeURIComponent(matchedFile)}`;
            const { error: updateError } = await supabase
                .from('menu_items')
                .update({ image_url: publicUrl })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Error updating item ${item.name}:`, updateError.message);
            } else {
                process.stdout.write('+');
            }
        }
    }

    console.log('\nDatabase synchronization complete!');
}

uploadImages();
