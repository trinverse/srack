import fs from 'fs';
import path from 'path';

// Normalize: lowercase, remove all non-alphanumeric
export function normalize(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Common spelling variants - both directions mapped
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

// Direct item-name -> file-name overrides for tricky cases
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

// Suffix words that can be added/removed in matching
const IGNORABLE_SUFFIXES = ['curry', 'masala', 'sabji', 'fry', 'dry', 'gravy', 'shaak', 'saak', 'sukhi', 'nu', 'ki', 'ka'];

// Generate all normalized alias variants for a given normalized name
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

interface FileEntry {
    file: string;
    norm: string;
    normStripped: string;
}

/**
 * Build gallery manifest mapping menu item IDs to arrays of local image paths.
 * Scans public/menu-images and matches files to items using fuzzy name matching.
 */
export function buildGalleryManifest(
    menuItems: { id: string; name: string }[]
): Record<string, string[]> {
    const menuImagesDir = path.join(process.cwd(), 'public', 'menu-images');
    const galleryManifest: Record<string, string[]> = {};

    if (!fs.existsSync(menuImagesDir)) {
        console.warn('Public menu-images directory not found.');
        return galleryManifest;
    }

    const files = fs.readdirSync(menuImagesDir);
    const validFiles = files.filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));

    // Pre-process all file normalized base names once
    const fileIndex: FileEntry[] = [];
    for (const file of validFiles) {
        const baseName = path.parse(file).name;
        const cleanBaseName = baseName.replace(/\(\d+\)/g, '').replace(/\s\d+$/, '').replace(/\.\d+$/, '').trim();
        const norm = normalize(cleanBaseName);
        const normStripped = norm.replace(/\d+$/, '');
        fileIndex.push({ file, norm, normStripped });
    }

    menuItems.forEach(item => {
        const cleanItemName = item.name.replace(/\(.*?\)/g, '').trim();
        const normalizedItemName = normalize(cleanItemName);
        const itemAliases = getAliases(normalizedItemName);
        const itemMatches: string[] = [];

        for (const entry of fileIndex) {
            const fileAliases = getAliases(entry.normStripped);
            let matched = false;

            // Check all combinations of item aliases vs file aliases
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

            // Raw norm check with number tolerance
            if (!matched) {
                if (entry.norm === normalizedItemName || entry.normStripped === normalizedItemName) {
                    matched = true;
                }
                if (entry.norm.startsWith(normalizedItemName)) {
                    const suffix = entry.norm.slice(normalizedItemName.length);
                    if (/^[0-9]+$/.test(suffix)) matched = true;
                }
            }

            // Manual overrides
            if (!matched) {
                const overrideTarget = MANUAL_OVERRIDES[normalizedItemName];
                if (overrideTarget) {
                    if (entry.normStripped === overrideTarget || entry.norm === overrideTarget) matched = true;
                    if (entry.normStripped.startsWith(overrideTarget)) {
                        const suffix = entry.normStripped.slice(overrideTarget.length);
                        if (/^[0-9]*$/.test(suffix)) matched = true;
                    }
                    if (entry.norm.startsWith(overrideTarget)) {
                        const suffix = entry.norm.slice(overrideTarget.length);
                        if (/^[0-9]*$/.test(suffix)) matched = true;
                    }
                }
            }

            if (matched) {
                itemMatches.push(`/menu-images/${entry.file}`);
            }
        }

        if (itemMatches.length > 0) {
            itemMatches.sort();
            galleryManifest[item.id] = itemMatches;
        }
    });

    return galleryManifest;
}
