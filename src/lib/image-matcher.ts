// Static list of image files - generated at build/commit time
// This avoids fs.readdirSync which doesn't work on Vercel serverless
import menuImageFiles from './menu-image-files.json';

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
    'chiickendopyaza': 'chickendopyaza',
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
    'carrot': 'gajar', 'gajar': 'carrot',
    'pav': 'paav', 'paav': 'pav',
    'lado': 'laddoo', 'laddo': 'laddoo', 'ladoo': 'laddoo', 'laddoo': 'laddoo',
    'srikahand': 'shrikhand', 'srikhand': 'shrikhand',
    'pinapple': 'pineapple',
    'coriender': 'coriander',
    'penut': 'peanut',
    'custered': 'custard',
    'fruite': 'fruit',
    'bhartha': 'bharta',
};

// Direct item-name -> file-name overrides for tricky cases
const MANUAL_OVERRIDES: Record<string, string> = {
    'gobimatarcarrot': 'gobimatarcarrots',
    'chickenbhuna': 'bhunachicken',
    'chickenmalabar': 'malabarchicken',
    'dahiwalealoo': 'dahialoo',
    'bainganaloo': 'aloobaingan',
    'gobialoo': 'aloogobi',
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
    'aloobhajimarathidrypotatocurry': 'marathialoobhajisukhi',
    'faralialoosabji': 'fararialoosabji',
    'saltylassi': 'saltedlassi',
    'paavbhaji': 'batatabhaji', // Fallback if no specific paav bhaji exists, or maybe user has it named differently
    'tamarindchutney': 'tamrindchutney',
    'poha': 'breakfastpoha',
    'sabudanakhichdi': 'sabudanakhichdi2',
    'upma': 'upma',
    'daalvada': 'daalvada2',
    'cabbagematarporiyal': 'cabbageporiyal',
    'moringastickdaal': 'drumstickdaal',
    'moringadaal': 'drumstickdaal',
    'plainroties': 'roties',
    'plainroti': 'roties',
    'chickenvindaloo': 'chickenvindaloo',
    'chickenmakhni': 'chickenmakhni',
    'chickenmakhani': 'chickenmakhni',
    'wholemasoordaal': 'wholemasoordaal',
    'matarrice': 'matarrice',
    'jeerarice': 'jeerarice',
    // New mappings from user feedback
    'shrikhand': 'srikhand',
    'dryfruitkheer': 'dryfruiterabdi',
    'pinapplehalwapineapplehalwav': 'pinapplekesari',
    'pineapplehalwapineapplehalwav': 'pinapplekesari',
    'pineapplehalwa': 'pinapplekesari',
    'pineapplekesari': 'pinapplekesari',
    'angoorimangorabdi': 'angoorrabdi',
    'ravaladdoo': 'ravaladoo',
    'ganeshchurmaladdoojaggeryvvg': 'churmaladoo',
    'ganeshchurmaladdoo': 'churmaladoo',
    'boondikeladdoo': 'boondikeladoo',
    'methikeladdoo': 'methikeladoo',
    'fruitcustard': 'fruitecustered',
    'sukhdisweetgolpapdi6piecesvvg': 'sukhdi',
    'mangoraaswithpuriscombov': 'mangoraswithpuricombo', // User: "Mango Ras with Puri Combo.jpg"
    'mangoraas': 'mangoraas',
    'dahivada': 'daalvada2',
    'paneermushroommasala': 'mashroompaneer',
    'paneercornmasala': 'cornpaneer',
    'whitepaneerkorma': 'paneerkorma',
    'guvaraloo': 'alooguvar',
    'menduvadai': 'mehnduvadai',
    'menduvadaiqty3piecesvvg': 'mehnduvadai',
    'medhuvadaiwithsambarandcoconutchutney': 'mehnduvadai',
    'idliwithsambarandcoconutchutney': 'idlichutneys',
    'idlischutneysambarqty6piecesvvg': 'idlichutneys',
    'khamandhokla': 'gujaratikhaman',
    'ravavegdhokla': 'ravadhokla',
    'moongdaalvegdhokla': 'moondaaldhokla',
    'daalvadagujarati10pieceswchutneysvvg': 'daalvada2',
    'daalvadagujarati': 'daalvada2',
    'methipakora': 'methipakorakadi',
    'gujarativegmuthia1215piecesvvg': 'papdimuthianushaak',
    'gujarativegmuthia': 'papdimuthianushaak',
    'aloosaag': 'saagaloomatar',
    'chanasaak': 'saagchole',
    'rajasthanimoongdaal': 'rajesthanidaal',
    'methipalakthepla': 'methithepla',
    'mixfruitsalad': 'custardfruitsalad',
    'dryfruitsrikhand': 'mixedfruitesrikhand2',
    'gulabkikheer': 'gulabkheer',
    'dillaloo': 'dillkikadhi',
    'karelaaloo': 'stuffedkarela',
    'kadaibhindi': 'bhindimasala',
    'bagarebaigangutivankaya': 'bagarabaigan',
    'dhabastylekajucurry': 'kajucurry',
    'hydrabadinawabichicken': 'hydrabadichicken',
    'hyderabadinawabichicken': 'hydrabadichicken',
    'corianderchickenmasala': 'hariyalichicken',
    'coriandermintchutney': 'coriendermintchutney',
    'peanutchutney': 'penutchutney',
    'mangoricekheer': 'mangokheer',
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
    const galleryManifest: Record<string, string[]> = {};

    // Use the static list of image files (imported from JSON)
    const validFiles: string[] = (menuImageFiles as string[]).filter(
        (file: string) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
    );

    // Pre-process all file normalized base names once
    const fileIndex: FileEntry[] = [];
    for (const file of validFiles) {
        // Extract base name without extension
        const lastDot = file.lastIndexOf('.');
        const baseName = lastDot > 0 ? file.slice(0, lastDot) : file;
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

            // Reject bad cross-matches before fuzzy check
            const itemIsPaneer = normalizedItemName.includes('paneer');
            const fileIsPaneer = entry.norm.includes('paneer');
            const itemIsChicken = normalizedItemName.includes('chicken');
            const fileIsChicken = entry.norm.includes('chicken');

            // Reject cross-protein matches
            if (itemIsPaneer && fileIsChicken) continue;
            if (itemIsChicken && fileIsPaneer) continue;

            // Reject butter paneer for butter chicken and vice-versa
            if (normalizedItemName.includes('butterpaneer') && entry.norm.includes('butterchicken')) continue;
            if (normalizedItemName.includes('butterchicken') && entry.norm.includes('butterpaneer')) continue;

            // Check all combinations of item aliases vs file aliases
            for (const itemAlias of itemAliases) {
                if (matched) break;
                for (const fileAlias of fileAliases) {
                    if (matched) break;
                    if (fileAlias === itemAlias) { matched = true; break; }
                    if (fileAlias.startsWith(itemAlias)) {
                        const suffix = fileAlias.slice(itemAlias.length);
                        if (/^[0-9]*$/.test(suffix)) { matched = true; break; }
                        if (IGNORABLE_SUFFIXES.some(s => suffix === s)) { matched = true; break; }
                    }
                    if (itemAlias.startsWith(fileAlias)) {
                        const suffix = itemAlias.slice(fileAlias.length);
                        if (IGNORABLE_SUFFIXES.some(s => suffix === s)) { matched = true; break; }
                        if (/^[0-9]*$/.test(suffix)) { matched = true; break; }
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
