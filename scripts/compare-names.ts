
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    'roti': 'rotie', 'rotie': 'roti', 'roties': 'roti',
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
    'potatoonionrasavalushaak': 'potatoonionrasavalacurry',
    'guttivankayakura': 'gutivankayakura',
    'hyderabadibaingan': 'hydrabadibaiganmasala',
    'gujaratilasaniyabatata': 'lasaniyabatata',
    'gujratidaaldhokli': 'daaldhokli',
    'besanpakorakadhi': 'pakorakadi',
    'laukichanadaal': 'laukidaal',
    'laukimoongdaal': 'laukidaal',
    'tuvarlilvakadhi': 'lilvakadhi',
    'sroutedmoongandmathkisabji': 'moongandmathkisabji',
    'gattacurry': 'rajesthanigattacurry',
    'paneercholemasala': 'cholepaneer',
    'paneermushroommassa': 'mashroompaneer',
    'sweetpotatoaloosabji': 'sweetpotatocurry',
    'sweetpotatosabjidry': 'sweetpotatocurry',
    'moongandmathsprouted': 'moongandmathkisabji',
    'tuvarbaigansaak': 'tuvarringannushaak',
    'vaalnusaak': 'vaalnushaak',
    'kalachanashaak': 'kalachananushaak',
    'kalachana': 'kalachananushaak',
    'vegjaipurimasala': 'vegjaipuri',
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

async function verify() {
    const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('id, name, category')
        .eq('is_active', true)
        .order('name');

    if (error || !menuItems) { console.error('DB Error:', error?.message); return; }

    const dir = path.join(process.cwd(), 'public', 'menu-images');
    const allFiles = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));

    const fileIndex: { file: string; norm: string; normStripped: string }[] = [];
    for (const file of allFiles) {
        const baseName = path.parse(file).name;
        const cleanBaseName = baseName.replace(/\(\d+\)/g, '').replace(/\s\d+$/, '').replace(/\.\d+$/, '').trim();
        const norm = normalize(cleanBaseName);
        const normStripped = norm.replace(/\d+$/, '');
        fileIndex.push({ file, norm, normStripped });
    }

    let matched = 0;
    let unmatched = 0;
    const unmatchedNames: string[] = [];

    for (const item of menuItems) {
        const cleanItemName = item.name.replace(/\(.*?\)/g, '').trim();
        const normalizedItemName = normalize(cleanItemName);
        const itemAliases = getAliases(normalizedItemName);
        let found = false;

        for (const entry of fileIndex) {
            if (found) break;
            const fileAliases = getAliases(entry.normStripped);

            for (const itemAlias of itemAliases) {
                if (found) break;
                for (const fileAlias of fileAliases) {
                    if (found) break;
                    if (fileAlias === itemAlias) { found = true; break; }
                    if (fileAlias.startsWith(itemAlias)) {
                        const suffix = fileAlias.slice(itemAlias.length);
                        if (/^[0-9]*$/.test(suffix)) { found = true; break; }
                    }
                    if (itemAlias.startsWith(fileAlias)) {
                        const suffix = itemAlias.slice(fileAlias.length);
                        if (IGNORABLE_SUFFIXES.some(s => suffix === s)) { found = true; break; }
                    }
                }
            }

            if (!found) {
                if (entry.norm === normalizedItemName || entry.normStripped === normalizedItemName) found = true;
                if (entry.norm.startsWith(normalizedItemName)) {
                    const suffix = entry.norm.slice(normalizedItemName.length);
                    if (/^[0-9]+$/.test(suffix)) found = true;
                }
            }

            // Manual overrides
            if (!found) {
                const overrideTarget = MANUAL_OVERRIDES[normalizedItemName];
                if (overrideTarget) {
                    if (entry.normStripped === overrideTarget || entry.norm === overrideTarget) found = true;
                    if (entry.normStripped.startsWith(overrideTarget)) {
                        const suffix = entry.normStripped.slice(overrideTarget.length);
                        if (/^[0-9]*$/.test(suffix)) found = true;
                    }
                    if (entry.norm.startsWith(overrideTarget)) {
                        const suffix = entry.norm.slice(overrideTarget.length);
                        if (/^[0-9]*$/.test(suffix)) found = true;
                    }
                }
            }
        }

        if (found) {
            matched++;
        } else {
            unmatched++;
            unmatchedNames.push(`❌ ${item.name}  [${item.category}]  (norm: ${normalizedItemName})`);
        }
    }

    console.log(`\n--- RESULTS WITH SMART + MANUAL MATCHING ---`);
    console.log(`Total Active Menu Items: ${menuItems.length}`);
    console.log(`Matched: ${matched}`);
    console.log(`Still Unmatched: ${unmatched}`);
    console.log(`Match Rate: ${((matched / menuItems.length) * 100).toFixed(1)}%`);
    console.log(`\nStill unmatched items:`);
    unmatchedNames.forEach(n => console.log(`  ${n}`));
}

verify();
