/* ============================================
   POKÉMON TCG COLLECTION TRACKER — App Logic
   ============================================ */

// Type color mapping
const TYPE_COLORS = {
    'Fire':       { bg: 'rgba(240,128,48,0.15)',  text: '#F08030',  solid: '#F08030' },
    'Water':      { bg: 'rgba(104,144,240,0.15)', text: '#6890F0',  solid: '#6890F0' },
    'Grass':      { bg: 'rgba(120,200,80,0.15)',  text: '#78C850',  solid: '#78C850' },
    'Lightning':  { bg: 'rgba(248,208,48,0.15)',  text: '#F8D030',  solid: '#F8D030' },
    'Electric':   { bg: 'rgba(248,208,48,0.15)',  text: '#F8D030',  solid: '#F8D030' },
    'Psychic':    { bg: 'rgba(248,88,136,0.15)',  text: '#F85888',  solid: '#F85888' },
    'Fighting':   { bg: 'rgba(192,48,40,0.15)',   text: '#C03028',  solid: '#C03028' },
    'Colorless':  { bg: 'rgba(168,168,120,0.15)', text: '#A8A878',  solid: '#A8A878' },
    'Metal':      { bg: 'rgba(184,184,208,0.15)', text: '#B8B8D0',  solid: '#B8B8D0' },
    'Steel':      { bg: 'rgba(184,184,208,0.15)', text: '#B8B8D0',  solid: '#B8B8D0' },
    'Darkness':   { bg: 'rgba(112,88,72,0.15)',   text: '#705848',  solid: '#705848' },
    'Dark':       { bg: 'rgba(112,88,72,0.15)',   text: '#705848',  solid: '#705848' },
    'Fairy':      { bg: 'rgba(238,153,172,0.15)', text: '#EE99AC',  solid: '#EE99AC' },
    'Dragon':     { bg: 'rgba(112,56,248,0.15)',  text: '#7038F8',  solid: '#7038F8' },
    'Trainer':    { bg: 'rgba(93,173,226,0.15)',   text: '#5DADE2',  solid: '#5DADE2' },
    'Energy':     { bg: 'rgba(69,179,157,0.15)',   text: '#45B39D',  solid: '#45B39D' },
    'Supporter':  { bg: 'rgba(93,173,226,0.15)',   text: '#5DADE2',  solid: '#5DADE2' },
    'Stadium':    { bg: 'rgba(93,173,226,0.15)',   text: '#5DADE2',  solid: '#5DADE2' },
    'Item':       { bg: 'rgba(93,173,226,0.15)',   text: '#5DADE2',  solid: '#5DADE2' },
    'Tool':       { bg: 'rgba(93,173,226,0.15)',   text: '#5DADE2',  solid: '#5DADE2' },
};

const GEN_COLORS = {
    'gen1':  '#E74C3C',
    'gen2':  '#F39C12',
    'gen3':  '#C0392B',
    'gen4':  '#2980B9',
    'gen5':  '#8E44AD',
    'gen6':  '#3498DB',
    'gen7':  '#E67E22',
    'gen8':  '#1ABC9C',
    'gen9':  '#9B59B6',
    'gen10': '#16A085',
};

// Condition multipliers for price adjustment
const CONDITION_MULTIPLIERS = {
    'NM': 1.00,
    'LP': 0.85,
    'MP': 0.65,
    'HP': 0.45,
    'DMG': 0.25,
};

const CONDITION_LABELS = {
    'NM': 'Near Mint',
    'LP': 'Lightly Played',
    'MP': 'Moderately Played',
    'HP': 'Heavily Played',
    'DMG': 'Damaged',
};

// Rarity symbol mapping
const RARITY_SYMBOLS = {
    'common': { symbol: '●', label: 'Common', color: '#8B8B8B' },
    'uncommon': { symbol: '◆', label: 'Uncommon', color: '#5DADE2' },
    'rare': { symbol: '★', label: 'Rare', color: '#E0E0E0' },
    'holo rare': { symbol: '★', label: 'Holo Rare', color: '#F4D03F' },
    'rare holo': { symbol: '★', label: 'Rare Holo', color: '#F4D03F' },
    'rare holo ex': { symbol: '★', label: 'Rare Holo EX', color: '#E74C3C' },
    'rare holo gx': { symbol: '★', label: 'Rare Holo GX', color: '#E74C3C' },
    'rare holo v': { symbol: '★', label: 'Rare Holo V', color: '#E74C3C' },
    'rare holo vmax': { symbol: '★', label: 'Rare Holo VMAX', color: '#E74C3C' },
    'rare holo vstar': { symbol: '★', label: 'Rare Holo VSTAR', color: '#E74C3C' },
    'rare ultra': { symbol: '★★', label: 'Ultra Rare', color: '#E74C3C' },
    'ultra rare': { symbol: '★★', label: 'Ultra Rare', color: '#E74C3C' },
    'rare secret': { symbol: '★★★', label: 'Secret Rare', color: '#AF7AC5' },
    'secret rare': { symbol: '★★★', label: 'Secret Rare', color: '#AF7AC5' },
    'rare rainbow': { symbol: '★★★', label: 'Rainbow Rare', color: '#AF7AC5' },
    'rare shiny': { symbol: '✦', label: 'Shiny Rare', color: '#AF7AC5' },
    'promo': { symbol: '★P', label: 'Promo', color: '#F39C12' },
    'illustration rare': { symbol: '★IR', label: 'Illustration Rare', color: '#E74C3C' },
    'special illustration rare': { symbol: '★★IR', label: 'Special Illustration Rare', color: '#AF7AC5' },
    'hyper rare': { symbol: '★★★', label: 'Hyper Rare', color: '#AF7AC5' },
    'double rare': { symbol: '★★', label: 'Double Rare', color: '#E74C3C' },
};

function getRarityDisplay(rarityStr) {
    if (!rarityStr) return { symbol: '', label: '', color: 'var(--text-muted)' };
    const key = rarityStr.toLowerCase().trim();
    return RARITY_SYMBOLS[key] || { symbol: '★', label: rarityStr, color: '#F4D03F' };
}

function getSetSymbolImg(setName, size = 20) {
    const url = (typeof SET_SYMBOLS !== 'undefined') && SET_SYMBOLS[setName];
    if (!url) return '';
    return `<img src="${url}" alt="" class="set-symbol" style="height:${size}px;width:auto" loading="lazy" onerror="this.style.display='none'">`;
}

function getCardImageUrl(setName, cardNumber) {
    const symbolUrl = (typeof SET_SYMBOLS !== 'undefined') && SET_SYMBOLS[setName];
    if (!symbolUrl) return null;
    // Extract set ID from symbol URL: https://images.pokemontcg.io/{setId}/symbol.png
    const match = symbolUrl.match(/pokemontcg\.io\/([^\/]+)\/symbol/);
    if (!match) return null;
    const setId = match[1];
    // Extract just the number part (e.g., '1/111' -> '1', '001/192' -> '1', '1' -> '1')
    let num = cardNumber.split('/')[0].replace(/^0+/, '') || '0';
    return `https://images.pokemontcg.io/${setId}/${num}.png`;
}

function getCardThumbnail(setName, cardNumber) {
    const url = getCardImageUrl(setName, cardNumber);
    if (!url) return '<span class="thumb-placeholder">🃏</span>';
    return `<img src="${url}" alt="" class="card-thumb" loading="lazy" onerror="this.outerHTML='<span class=\\'thumb-placeholder\\'>🃏</span>'">`;
}

// =============================================
// PRICE SERVICE (PokéWallet API)
// =============================================
class PriceService {
    constructor() {
        this.apiKey = localStorage.getItem('pokewallet_api_key') || '';
        this.cache = {};
        this.loadCache();
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('pokewallet_api_key', key);
    }

    getApiKey() {
        return this.apiKey;
    }

    loadCache() {
        try {
            const saved = localStorage.getItem('price_cache');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Support both old format (global timestamp) and new format (per-entry)
                if (parsed.data) {
                    // Old format: { timestamp, data }
                    this.cache = parsed.data || {};
                } else {
                    // New format: direct cache object
                    this.cache = parsed;
                }
                // Prune entries older than 7 days & strip bloated fields
                const maxAge = 7 * 24 * 60 * 60 * 1000;
                const now = Date.now();
                let trimmed = false;
                for (const key of Object.keys(this.cache)) {
                    const entry = this.cache[key];
                    if (entry && entry.fetchedAt && (now - entry.fetchedAt > maxAge)) {
                        delete this.cache[key];
                        trimmed = true;
                    } else if (entry) {
                        // Strip unused fields to save localStorage space
                        if (entry.image !== undefined) { delete entry.image; trimmed = true; }
                        if (entry.rarity !== undefined) { delete entry.rarity; trimmed = true; }
                    }
                }
                if (trimmed) this.saveCache();
            } else {
                // No localStorage cache — try loading bundled price data
                this.loadBundledCache();
            }
        } catch (e) {
            this.cache = {};
        }
    }

    async loadBundledCache() {
        try {
            const resp = await fetch('data/price_cache.json');
            if (resp.ok) {
                this.cache = await resp.json();
                this.saveCache();
                console.log(`Loaded ${Object.keys(this.cache).length} prices from bundled cache`);
            }
        } catch (e) {
            // Bundled cache not available, that's fine
        }
    }

    saveCache() {
        try {
            localStorage.setItem('price_cache', JSON.stringify(this.cache));
        } catch (e) {
            // localStorage quota exceeded — evict oldest entries and retry
            console.warn('Price cache quota exceeded, trimming oldest entries...');
            const entries = Object.entries(this.cache);
            // Sort by fetchedAt ascending (oldest first)
            entries.sort((a, b) => (a[1].fetchedAt || 0) - (b[1].fetchedAt || 0));
            // Remove oldest 25% of entries
            const removeCount = Math.max(Math.floor(entries.length * 0.25), 10);
            for (let i = 0; i < removeCount && i < entries.length; i++) {
                delete this.cache[entries[i][0]];
            }
            try {
                localStorage.setItem('price_cache', JSON.stringify(this.cache));
                console.log(`Trimmed ${removeCount} old cache entries, saved successfully`);
            } catch (e2) {
                console.error('Price cache still too large after trimming:', e2);
            }
        }
    }

    getCacheKey(cardName, setName, cardNumber) {
        return (cardName + '|' + setName + '|' + (cardNumber || '')).toLowerCase();
    }

    getCachedPrice(cardName, setName, cardNumber) {
        return this.cache[this.getCacheKey(cardName, setName, cardNumber)] || null;
    }

    clearSetCache(set) {
        let count = 0;
        for (const card of set.cards) {
            const key = this.getCacheKey(card.name, set.name, card.number);
            if (this.cache[key]) {
                delete this.cache[key];
                count++;
            }
        }
        this.saveCache();
        return count;
    }

    async fetchCardPrice(cardName, setName, cardNumber, setId) {
        if (!this.apiKey) return null;

        const cacheKey = this.getCacheKey(cardName, setName, cardNumber);
        if (this.cache[cacheKey]) return this.cache[cacheKey];

        try {
            // Strip parenthetical qualifiers from set name
            let cleanSetName = setName.replace(/\s*\(.*?\)\s*/g, '').trim();
            // Clean card name: transliterate accents (é→e), strip remaining unicode (δ, ★)
            let cleanCardName = cardName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7F]/g, '').replace(/['']/g, "'").trim();
            // Strip leading underscores/blanks (e.g. "_____'s Pikachu" → "Pikachu")
            cleanCardName = cleanCardName.replace(/^[_]+(?:'s\s+)?/, '').trim();

            // Use mapped API set name if available, otherwise strip EX prefix
            const SET_QUERY_MAP = {
                // Gen 1 — Base Set variants
                'Base Set (1st Edition)': 'Base Set',
                'Base Set (Unlimited)': 'Base Set',
                'Base Set (Shadowless)': 'Base Set',
                'Expansion Pack': 'Base Set',
                'Wizards Black Star Promos': 'Wizards Black Star Promos',
                'Vending Series 1': 'Vending Machine cards',
                'Vending Series 2': 'Vending Machine cards',
                'Vending Series 3': 'Vending Machine cards',
                // Gen 2
                'Gold, Silver, to a New World...': 'Neo Genesis',
                'Challenge from the Darkness': 'Neo Discovery',
                'Pokémon VS': 'Pokemon VS',
                // Gen 3 — EX-era (API drops "EX" prefix)
                'EX Ruby & Sapphire': 'Ruby Sapphire',
                'EX Sandstorm': 'Sandstorm',
                'EX Dragon': 'Dragon',
                'EX Hidden Legends': 'Hidden Legends',
                'EX FireRed & LeafGreen': 'FireRed LeafGreen',
                'EX Team Rocket Returns': 'Team Rocket Returns',
                'EX Deoxys': 'Deoxys',
                'EX Emerald': 'Emerald',
                'EX Unseen Forces': 'Unseen Forces',
                'EX Delta Species': 'Delta Species',
                'EX Legend Maker': 'Legend Maker',
                'EX Holon Phantoms': 'Holon Phantoms',
                'EX Crystal Guardians': 'Crystal Guardians',
                'EX Dragon Frontiers': 'Dragon Frontiers',
                'EX Power Keepers': 'Power Keepers',
                'EX Team Magma vs Team Aqua': 'Team Magma vs Team Aqua',
                'Nintendo Black Star Promos': 'Nintendo Promos',
                'Best of Game': 'Best of Game Promo',
                'EX Trainer Kit Latias': 'EX Trainer Kit Latias',
                'EX Trainer Kit Latios': 'EX Trainer Kit Latios',
                'EX Trainer Kit 2 Plusle': 'EX Trainer Kit 2 Plusle',
                'EX Trainer Kit 2 Minun': 'EX Trainer Kit 2 Minun',
                // Gen 4 — DP / HGSS
                'Diamond & Pearl': 'Diamond Pearl',
                'HeartGold and SoulSilver': 'HeartGold SoulSilver',
                'DP Black Star Promos': 'Diamond Pearl Promos',
                'DP Trainer Kit: Manaphy & Lucario': 'DP Trainer Kit',
                'Golden Sky, Silvery Ocean': 'HeartGold SoulSilver',
                'HGSS Trainer Kit: Gyarados & Raichu': 'HGSS Trainer Kit',
                'HGSS Promos': 'HGSS Promos',
                // Gen 5 — BW
                'Black and White': 'Black White',
                "McDonald's Collection 2011": 'McDonalds Collection 2011',
                'McDonalds Collection 2012': 'McDonalds Collection 2012',
                // Gen 6 — XY
                'X and Y': 'XY Base Set',
                'X and Y Black Star Promos': 'XY Promos',
                'Kalos Starter Set': 'Kalos Starter Set',
                'XY Trainer Kit: Bisharp & Wigglytuff': 'XY Trainer Kit',
                "McDonald's Collection 2014": 'McDonalds Collection 2014',
                'XY Trainer Kit: Latias & Latios': 'XY Trainer Kit Latias',
                "McDonald's Collection 2015": 'McDonalds Collection 2015',
                'XY Trainer Kit: Pikachu Libre & Suicune': 'XY Trainer Kit Pikachu Libre',
                // Gen 7 — SM
                'Sun and Moon': 'SM Base Set',
                'Sun and Moon Black Star Promos': 'SM Promos',
                'Shining Legends': 'Shining Legends',
                'Dragon Majesty': 'Dragon Majesty',
                'Detective Pikachu': 'Detective Pikachu',
                'Hidden Fates': 'Hidden Fates',
                // Gen 8 — SWSH
                'Sword and Shield': 'Sword Shield',
                'Sword and Shield Promos': 'Sword Shield Promos',
                "Champion's Path": 'Champions Path',
                'Shining Fates': 'Shining Fates',
                'Celebrations': 'Celebrations',
                'Pokemon GO': 'Pokemon GO',
                'Crown Zenith': 'Crown Zenith',
                "McDonald's 25th Anniversary Promos": 'McDonalds 25th Anniversary',
                "McDonald's Collection 2652": 'McDonalds 25th Anniversary',
                // Gen 9 — SV
                'Scarlet & Violet': 'Scarlet Violet',
                '151': 'Scarlet Violet 151',
                'SV2a: Pokemon Card 151': 'Pokemon Card 151',
                'SV5K: Wild Force': 'Wild Force',
                'SV5M: Cyber Judge': 'Cyber Judge',
                'SV8a: Terastal Fest ex': 'Terastal Fest',
                'Prismatic Evolution': 'Prismatic Evolutions',
                // POP Series
                'POP Series 1': 'POP Series 1',
                'POP Series 2': 'POP Series 2',
                'Pop Series 3': 'POP Series 3',
                'Pop Series 4': 'POP Series 4',
                'POP Series 5': 'POP Series 5',
                'POP Series 6': 'POP Series 6',
                'POP Series 7': 'POP Series 7',
                'Pop Series 8': 'POP Series 8',
                'Pop Series 9': 'POP Series 9',
            };
            const querySetName = SET_QUERY_MAP[setName] || cleanSetName.replace(/^EX\s+/i, '').trim();

            // Build a list of query variants to try (most specific → least specific)
            const queries = [];
            const baseQuery = (cleanCardName + ' ' + querySetName).replace(/&/g, 'and').replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
            
            if (querySetName.toLowerCase().includes('promo') && cardNumber) {
                // For promos, include the card number in queries for disambiguation
                // Try set-specific query with number first (best for Wizards/Nintendo/DP promos)
                const setKeywords = querySetName.replace(/promos?$/i, '').trim();
                // TCGPlayer names duplicate promos as "Pikachu (4)", "Eevee (11)" etc.
                const nameWithNum = cleanCardName + ' (' + cardNumber + ')';
                queries.push((cleanCardName + ' ' + setKeywords + ' ' + cardNumber).replace(/\s+/g, ' ').trim());
                queries.push((cleanCardName + ' promo ' + cardNumber).trim());
                // Try WOTC-specific queries (TCGPlayer uses "wotc promo" as the set name)
                if (setKeywords.toLowerCase().includes('wizards') || setKeywords.toLowerCase().includes('black star')) {
                    queries.push((nameWithNum + ' wotc promo').trim());
                    queries.push((cleanCardName + ' wotc promo ' + cardNumber).trim());
                    queries.push((cleanCardName + ' wotc promo').trim());
                    queries.push(('wotc promo ' + cardNumber).trim());
                    queries.push((cleanCardName + ' Black Star Promo').trim());
                }
                // Generic promo with parenthesized number
                queries.push((nameWithNum + ' promo').trim());
                queries.push(baseQuery);
                queries.push((cleanCardName + ' ' + cardNumber).trim());
                queries.push(cleanCardName);
            } else {
                queries.push(baseQuery);
                // Also try with just the card name + shorter set identifier
                const setWords = querySetName.split(' ');
                if (setWords.length > 2) {
                    queries.push((cleanCardName + ' ' + setWords.slice(-2).join(' ')).replace(/\s+/g, ' ').trim());
                }
                // Fallback: just card name
                if (queries.length < 3) {
                    queries.push(cleanCardName);
                }
            }


            let pokewalletRateLimited = false;
            for (const q of queries) {
                console.log(`[PriceFetch] Trying: "${q}"`);
                const response = await fetch(`https://api.pokewallet.io/search?q=${encodeURIComponent(q)}&limit=50`, {
                    headers: { 'X-API-Key': this.apiKey },
                });

                if (response.status === 429) {
                    console.warn('PokéWallet rate limit reached — will try fallback');
                    pokewalletRateLimited = true;
                    break;
                }
                if (!response.ok) continue;

                const data = await response.json();
                const results = data.results || data.data || data;
                console.log(`[PriceFetch] Results: ${Array.isArray(results) ? results.length : 'none'}`);

                if (Array.isArray(results) && results.length > 0) {
                    const card = this.findBestMatch(results, cardName, setName, cardNumber);
                    if (card) {
                        console.log(`[PriceFetch] Matched: ${card.card_info?.name} in ${card.card_info?.set_name}`);
                        const priceInfo = this.extractPrice(card);
                        this.cache[cacheKey] = priceInfo;
                        this.saveCache();
                        return priceInfo;
                    }
                }
            }


            // If PokéWallet was rate-limited and fallback didn't help, signal it
            if (pokewalletRateLimited) {
                return { rateLimited: true };
            }

            return null;
        } catch (e) {
            console.warn('Price fetch failed:', e);
            return null;
        }
    }

    findBestMatch(results, cardName, setName, cardNumber) {
        // Normalize a string for comparison
        const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const stripParens = (s) => s.replace(/\s*\(.*?\)\s*/g, '').trim();
        const stripPrefix = (s) => s.replace(/^EX\s+/i, '').trim();
        const targetSet = norm(setName);
        const targetSetBase = norm(stripPrefix(stripParens(setName)));
        // Strip leading underscores/blanks before normalizing (e.g. "_____'s Pikachu" → "Pikachu")
        const cleanedCardName = cardName.replace(/^[_]+(?:'s\s+)?/, '').trim();
        const targetCard = norm(cleanedCardName);
        // Normalize card number: strip leading zeros, e.g. "06/64" → "6/64"
        const normNum = (n) => (n || '').replace(/^0+/, '').toLowerCase();
        const targetNum = normNum(cardNumber || '');

        // Known API set name mappings for our internal names
        const SET_API_MAP = {
            // Gen 1
            'Base Set (1st Edition)': 'Base Set (Shadowless)',
            'Base Set (Unlimited)': 'Base Set',
            'Base Set (Shadowless)': 'Base Set (Shadowless)',
            'Expansion Pack': 'Base Set',
            'Wizards Black Star Promos': 'Wizards Black Star Promos',
            'Vending Series 1': 'Vending Machine cards Series 1 (Blue)',
            'Vending Series 2': 'Vending Machine cards Series 2 (Red)',
            'Vending Series 3': 'Vending Machine cards Series 3 (Green)',
            // Gen 2
            'Gold, Silver, to a New World...': 'Neo Genesis',
            'Challenge from the Darkness': 'Neo Discovery',
            'Pokémon VS': 'Pokemon VS',
            // Gen 3 — EX-era
            'EX Ruby & Sapphire': 'Ruby and Sapphire',
            'EX Sandstorm': 'Sandstorm',
            'EX Dragon': 'Dragon',
            'EX Hidden Legends': 'Hidden Legends',
            'EX FireRed & LeafGreen': 'FireRed & LeafGreen',
            'EX Team Rocket Returns': 'Team Rocket Returns',
            'EX Deoxys': 'Deoxys',
            'EX Emerald': 'Emerald',
            'EX Unseen Forces': 'Unseen Forces',
            'EX Delta Species': 'Delta Species',
            'EX Legend Maker': 'Legend Maker',
            'EX Holon Phantoms': 'Holon Phantoms',
            'EX Crystal Guardians': 'Crystal Guardians',
            'EX Dragon Frontiers': 'Dragon Frontiers',
            'EX Power Keepers': 'Power Keepers',
            'EX Team Magma vs Team Aqua': 'Team Magma vs Team Aqua',
            'Nintendo Black Star Promos': 'Nintendo Promos',
            'Best of Game': 'Best of Game',
            'EX Trainer Kit Latias': 'EX Trainer Kit Latias',
            'EX Trainer Kit Latios': 'EX Trainer Kit Latios',
            'EX Trainer Kit 2 Plusle': 'EX Trainer Kit 2 Plusle',
            'EX Trainer Kit 2 Minun': 'EX Trainer Kit 2 Minun',
            // Gen 4 — DP / HGSS
            'Diamond & Pearl': 'Diamond and Pearl',
            'HeartGold and SoulSilver': 'HeartGold SoulSilver',
            'DP Black Star Promos': 'Diamond and Pearl Promos',
            'DP Trainer Kit: Manaphy & Lucario': 'DP Trainer Kit',
            'Golden Sky, Silvery Ocean': 'HeartGold SoulSilver',
            'HGSS Trainer Kit: Gyarados & Raichu': 'HGSS Trainer Kit',
            'HGSS Promos': 'HGSS Promos',
            // Gen 5 — BW
            'Black and White': 'Black and White',
            "McDonald's Collection 2011": "McDonald's Collection 2011",
            'McDonalds Collection 2012': "McDonald's Collection 2012",
            // Gen 6 — XY
            'X and Y': 'XY Base Set',
            'X and Y Black Star Promos': 'XY Promos',
            'Flashfire': 'XY - Flashfire',
            'Furious Fists': 'XY - Furious Fists',
            'Phantom Forces': 'XY - Phantom Forces',
            'Primal Clash': 'XY - Primal Clash',
            'Roaring Skies': 'XY - Roaring Skies',
            'Ancient Origins': 'XY - Ancient Origins',
            'BREAKthrough': 'XY - BREAKthrough',
            'BREAKpoint': 'XY - BREAKpoint',
            'Generations': 'Generations',
            'Fates Collide': 'XY - Fates Collide',
            'Steam Siege': 'XY - Steam Siege',
            'Evolutions': 'XY - Evolutions',
            'XY Trainer Kit: Bisharp & Wigglytuff': 'XY Trainer Kit',
            "McDonald's Collection 2014": "McDonald's Collection 2014",
            'XY Trainer Kit: Latias & Latios': 'XY Trainer Kit',
            "McDonald's Collection 2015": "McDonald's Collection 2015",
            'XY Trainer Kit: Pikachu Libre & Suicune': 'XY Trainer Kit',
            // Gen 7 — SM
            'Sun and Moon': 'SM Base Set',
            'Guardians Rising': 'SM - Guardians Rising',
            'Burning Shadows': 'SM - Burning Shadows',
            'Shining Legends': 'Shining Legends',
            'Crimson Invasion': 'SM - Crimson Invasion',
            'Ultra Prism': 'SM - Ultra Prism',
            'Forbidden Light': 'SM - Forbidden Light',
            'Celestial Storm': 'SM - Celestial Storm',
            'Dragon Majesty': 'Dragon Majesty',
            'Lost Thunder': 'SM - Lost Thunder',
            'Team Up': 'SM - Team Up',
            'Detective Pikachu': 'Detective Pikachu',
            'Unbroken Bonds': 'SM - Unbroken Bonds',
            'Unified Minds': 'SM - Unified Minds',
            'Hidden Fates': 'Hidden Fates',
            'Cosmic Eclipse': 'SM - Cosmic Eclipse',
            'Sun and Moon Black Star Promos': 'SM Promos',
            // Gen 8 — SWSH
            'Sword and Shield': 'Sword & Shield Base Set',
            'Rebel Clash': 'SWSH02: Rebel Clash',
            'Darkness Ablaze': 'SWSH03: Darkness Ablaze',
            'Vivid Voltage': 'SWSH04: Vivid Voltage',
            'Battle Styles': 'SWSH05: Battle Styles',
            'Chilling Reign': 'SWSH06: Chilling Reign',
            'Evolving Skies': 'SWSH07: Evolving Skies',
            'Fusion Strike': 'SWSH08: Fusion Strike',
            'Brilliant Stars': 'SWSH09: Brilliant Stars',
            'Astral Radiance': 'SWSH10: Astral Radiance',
            'Lost Origin': 'SWSH11: Lost Origin',
            'Silver Tempest': 'SWSH12: Silver Tempest',
            'Sword and Shield Promos': 'SWSH: Sword & Shield Promo Cards',
            "Champion's Path": "Champion's Path",
            'Shining Fates': 'Shining Fates',
            'Celebrations': 'Celebrations',
            'Pokemon GO': 'Pokemon GO',
            'Crown Zenith': 'Crown Zenith',
            "McDonald's 25th Anniversary Promos": "McDonald's 25th Anniversary",
            "McDonald's Collection 2652": "McDonald's 25th Anniversary",
            // Gen 9 — SV
            'Scarlet & Violet': 'SV01: Scarlet & Violet Base Set',
            'Paldea Evolved': 'SV02: Paldea Evolved',
            'Obsidian Flames': 'SV03: Obsidian Flames',
            'Paradox Rift': 'SV04: Paradox Rift',
            'Temporal Forces': 'SV05: Temporal Forces',
            'Twilight Masquerade': 'SV06: Twilight Masquerade',
            'Stellar Crown': 'SV07: Stellar Crown',
            'Surging Sparks': 'SV08: Surging Sparks',
            'Journey Together': 'SV09: Journey Together',
            'Destined Rivals': 'SV10: Destined Rivals',
            '151': 'SV: Scarlet & Violet 151',
            'Paldean Fates': 'SV: Paldean Fates',
            'Shrouded Fable': 'SV: Shrouded Fable',
            'Prismatic Evolution': 'SV: Prismatic Evolutions',
            'Black Bolt': 'SV: Black Bolt',
            'White Flare': 'SV: White Flare',
            'SV2a: Pokemon Card 151': 'SV: Scarlet & Violet 151',
            'SV5K: Wild Force': 'Wild Force',
            'SV5M: Cyber Judge': 'Cyber Judge',
            'SV8a: Terastal Fest ex': 'Terastal Fest ex',
            // POP Series
            'POP Series 1': 'POP Series 1',
            'POP Series 2': 'POP Series 2',
            'Pop Series 3': 'POP Series 3',
            'Pop Series 4': 'POP Series 4',
            'POP Series 5': 'POP Series 5',
            'POP Series 6': 'POP Series 6',
            'POP Series 7': 'POP Series 7',
            'Pop Series 8': 'POP Series 8',
            'Pop Series 9': 'POP Series 9',
        };
        const mappedApiSetName = SET_API_MAP[setName];
        const mappedApiSet = mappedApiSetName ? norm(mappedApiSetName) : null;

        let bestMatch = null;
        let bestScore = -1;

        for (const r of results) {
            const ci = r.card_info || {};
            const apiSet = norm(ci.set_name || '');
            const apiSetBase = norm(stripPrefix(stripParens(ci.set_name || '')));
            const apiCard = norm((ci.name || ci.clean_name || '').replace(/^[_]+(?:'s\s+)?/, ''));
            const apiNum = normNum(ci.card_number || '');
            
            let score = 0;

            // Exact mapped set match (highest priority)
            if (mappedApiSet && apiSet === mappedApiSet) {
                score += 150;
            }
            // Exact set match
            else if (apiSet === targetSet) {
                score += 100;
            }
            // Base set names match (e.g. both are "Base Set" ignoring parenthetical)
            else if (apiSetBase === targetSetBase) {
                score += 75;
            }
            else if (apiSet.includes(targetSetBase) || targetSetBase.includes(apiSet)) {
                score += 50;
            }
            // Promo set matching: both contain "blackstarpromo" or "promo"
            else if (targetSetBase.includes('blackstarpromo') && apiSet.includes('promo')) {
                // Check for era match (wizards/wotc vs dp vs sm etc.)
                if ((targetSetBase.includes('wizards') || targetSetBase.includes('wotc')) && 
                    (apiSet.includes('wizards') || apiSet.includes('wotc') || apiSet.includes('wotcpromo'))) {
                    score += 75;
                } else if ((targetSetBase.includes('dp') || targetSetBase.includes('diamondpearl')) && 
                    (apiSet.includes('dp') || apiSet.includes('diamondpearl'))) {
                    score += 75;
                } else if (apiSet.includes('blackstar')) {
                    score += 40;
                }
                // Wrong era promos get score 0 (rejected by min threshold)
            }

            // Card number match (only counts if we have some set match to prevent wrong-set matches)
            if (targetNum && apiNum && score > 0) {
                if (apiNum === targetNum) {
                    score += 200;
                } else {
                    // Compare just the card number part (before any slash), stripping non-digits
                    // e.g. "04/53" → "4", "WBSP-001" → "1"
                    const apiDigits = apiNum.split('/')[0].replace(/[^0-9]/g, '');
                    const targetDigits = targetNum.split('/')[0].replace(/[^0-9]/g, '');
                    if (apiDigits && targetDigits && apiDigits === targetDigits) {
                        score += 180;
                    } else if (apiDigits && targetDigits) {
                        // Wrong card number → strong penalty to prevent matching
                        // the wrong promo variant (e.g. Pikachu #1 vs Pikachu #4)
                        score -= 100;
                    }
                }
            }

            // Card name match
            if (apiCard === targetCard || apiCard.includes(targetCard) || targetCard.includes(apiCard)) {
                score += 10;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = r;
            }
        }

        // Require a minimum score to avoid false positives from unrelated sets
        if (bestScore < 50) {
            console.log(`[findBestMatch] No match above threshold for "${cardName}" #${cardNumber} in "${setName}". Best score: ${bestScore}`, results.length > 0 ? results.slice(0,2).map(r => ({name: r.card_info?.name, set: r.card_info?.set_name, num: r.card_info?.card_number})) : 'no results');
            return null;
        }
        return bestMatch;
    }

    extractPrice(cardData) {
        let tcgplayerUrl = null;
        
        // Map of sub_type_name -> { market, low }
        const variantPrices = {};
        let firstMarket = null;
        let firstLow = null;

        if (cardData.tcgplayer && cardData.tcgplayer.prices) {
            const prices = cardData.tcgplayer.prices;
            if (Array.isArray(prices)) {
                for (const p of prices) {
                    const subType = p.sub_type_name || 'Normal';
                    const market = p.market_price || p.mid_price || null;
                    const low = p.low_price || null;
                    if (market) {
                        variantPrices[subType] = { market, low };
                        if (!firstMarket) { firstMarket = market; firstLow = low; }
                    }
                }
            } else if (typeof prices === 'object') {
                // Handle nested format: { holofoil: { market: x }, normal: { market: x } }
                const nameMap = { normal: 'Normal', holofoil: 'Holofoil', reverseHolofoil: 'Reverse Holofoil', '1stEditionHolofoil': '1st Edition' };
                for (const [key, label] of Object.entries(nameMap)) {
                    if (prices[key]) {
                        const market = prices[key].market || prices[key].mid || null;
                        const low = prices[key].low || null;
                        if (market) {
                            variantPrices[label] = { market, low };
                            if (!firstMarket) { firstMarket = market; firstLow = low; }
                        }
                    }
                }
            }
        }

        if (cardData.tcgplayer && cardData.tcgplayer.url) {
            tcgplayerUrl = cardData.tcgplayer.url;
        }


        return {
            market: firstMarket,
            low: firstLow,
            variantPrices,
            tcgplayerUrl,
            fetchedAt: Date.now(),
        };
    }

    async fetchSetPrices(set, onProgress) {
        if (!this.apiKey) return { success: false, reason: 'no_key' };
        let fetched = 0;
        let cached = 0;
        const haveCards = set.cards.filter(c => c.status === 'HAVE');
        const total = haveCards.length;

        if (total === 0) return { success: true, fetched: 0, cached: 0, total: set.cards.length };

        // Count already-cached cards
        const uncachedCards = [];
        for (const card of haveCards) {
            const cacheKey = this.getCacheKey(card.name, set.name, card.number);
            if (this.cache[cacheKey]) {
                cached++;
            } else {
                uncachedCards.push(card);
            }
        }

        if (uncachedCards.length === 0) {
            return { success: true, fetched: 0, cached, total: set.cards.length };
        }

        // PHASE 1: Bulk fetch from pokemontcg.io (1-2 API calls for the entire set)
        if (set.id) {
            try {
                if (onProgress) onProgress(0, uncachedCards.length, 'Bulk fetching prices...');
                const bulkHits = await this.bulkFetchPrices(set);
                // Cache all hits
                for (const card of uncachedCards) {
                    const cacheKey = this.getCacheKey(card.name, set.name, card.number);
                    if (bulkHits[card.number]) {
                        this.cache[cacheKey] = bulkHits[card.number];
                        fetched++;
                    }
                }
                this.saveCache();
                if (onProgress) onProgress(fetched, uncachedCards.length, null);
            } catch (e) {
                console.warn('[PriceFetch] Bulk fetch failed, will try individual:', e);
            }
        }

        // PHASE 2: Individual PokéWallet lookups for any remaining misses
        const stillMissing = uncachedCards.filter(c => !this.cache[this.getCacheKey(c.name, set.name, c.number)]);

        if (stillMissing.length > 0) {
            console.log(`[PriceFetch] ${fetched} bulk hits, ${stillMissing.length} remaining for PokéWallet`);
            for (const card of stillMissing) {
                const cacheKey = this.getCacheKey(card.name, set.name, card.number);
                if (this.cache[cacheKey]) continue; // double-check

                const result = await this.fetchCardPrice(card.name, set.name, card.number, null);

                if (result && result.rateLimited) {
                    this.saveCache();
                    return { success: false, reason: 'rate_limited', fetched, cached, total: set.cards.length };
                }

                if (result && result.market) fetched++;
                if (onProgress) onProgress(fetched + cached, total, null);

                // 500ms delay between PokéWallet calls
                await new Promise(r => setTimeout(r, 500));
            }
        }

        this.saveCache();
        return { success: true, fetched, cached, total: set.cards.length };
    }

    async bulkFetchPrices(set) {
        // Fetch ALL cards for this set from pokemontcg.io in one paginated request
        // Returns a map of cardNumber -> priceInfo
        const priceMap = {};
        let page = 1;
        while (true) {
            const url = `https://api.pokemontcg.io/v2/cards?q=set.id:${set.id}&pageSize=250&page=${page}&select=name,number,tcgplayer,images`;
            console.log(`[PriceFetch] Bulk fetch: ${url}`);
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            for (const card of (data.data || [])) {
                if (card.tcgplayer && card.tcgplayer.prices) {
                    const priceInfo = this.extractPrice(card);
                    if (priceInfo.market) {
                        priceMap[card.number] = priceInfo;
                    }
                }
            }
            if ((data.data || []).length < 250 || page * 250 >= (data.totalCount || 0)) break;
            page++;
        }
        console.log(`[PriceFetch] Bulk: got prices for ${Object.keys(priceMap).length} cards`);
        return priceMap;
    }

    getCollectionValue(store) {
        let totalValue = 0;
        let pricedCards = 0;
        for (const gen of store.getGenerations()) {
            for (const set of gen.sets) {
                for (const card of set.cards) {
                    if (card.status === 'HAVE') {
                        const price = this.getCachedPrice(card.name, set.name, card.number);
                        if (price && price.market) {
                            totalValue += price.market * Math.max(card.stock || 1, 1);
                            pricedCards++;
                        }
                    }
                }
            }
        }
        return { totalValue, pricedCards };
    }
}

// =============================================
// DATA LAYER
// =============================================
class CollectionStore {
    constructor() {
        this.data = null;
        this.changes = {};
        this.addedSets = []; // Sets added via API Explorer, persisted separately
        this.load();
    }

    load() {
        // Always start from the base data file
        if (typeof COLLECTION_DATA !== 'undefined') {
            this.data = JSON.parse(JSON.stringify(COLLECTION_DATA));
            console.log('Loaded ' + this.data.generations.length + ' generations from COLLECTION_DATA');
        }

        // Restore sets added via API Explorer
        const savedAddedSets = localStorage.getItem('pokemon_tcg_added_sets');
        if (savedAddedSets && this.data) {
            try {
                this.addedSets = JSON.parse(savedAddedSets);
                for (const entry of this.addedSets) {
                    const gen = this.data.generations.find(g => g.id === entry.genId);
                    if (gen && !gen.sets.find(s => s.id === entry.set.id)) {
                        // Re-insert in release date order
                        const newDate = entry.set.releaseDate || 'zzzz';
                        let inserted = false;
                        for (let i = 0; i < gen.sets.length; i++) {
                            const s = gen.sets[i];
                            const isPromo = s.name.toLowerCase().includes('promo');
                            const sDate = s.releaseDate || 'zzzz';
                            if (!isPromo && sDate > newDate) {
                                gen.sets.splice(i, 0, JSON.parse(JSON.stringify(entry.set)));
                                inserted = true;
                                break;
                            }
                        }
                        if (!inserted) gen.sets.push(JSON.parse(JSON.stringify(entry.set)));
                    }
                }
                console.log('Restored ' + this.addedSets.length + ' API Explorer sets');
            } catch (e) {
                console.warn('Failed to parse saved added sets:', e);
                this.addedSets = [];
            }
        }

        // Apply any saved user changes on top
        const savedChanges = localStorage.getItem('pokemon_tcg_changes');
        if (savedChanges) {
            try {
                this.changes = JSON.parse(savedChanges);
                this.applyChanges();
                console.log('Applied ' + Object.keys(this.changes).length + ' saved changes');
            } catch (e) {
                console.warn('Failed to parse saved changes:', e);
                this.changes = {};
            }
        }

        if (!this.data) {
            console.error('No collection data available!');
        }
    }

    applyChanges() {
        for (const key in this.changes) {
            const parts = key.split('/');
            if (parts.length < 4) continue;
            const [genId, setId, cardIndexStr, ...fieldParts] = parts;
            const field = fieldParts.join('/');
            const cardIndex = parseInt(cardIndexStr);
            const set = this.getSet(genId, setId);
            if (set && set.cards[cardIndex]) {
                if (field.startsWith('quantities.')) {
                    const qtyField = field.split('.')[1];
                    set.cards[cardIndex].quantities[qtyField] = this.changes[key];
                } else {
                    set.cards[cardIndex][field] = this.changes[key];
                }
            }
        }
    }

    save() {
        try {
            localStorage.setItem('pokemon_tcg_changes', JSON.stringify(this.changes));
            if (this.addedSets.length > 0) {
                localStorage.setItem('pokemon_tcg_added_sets', JSON.stringify(this.addedSets));
            }
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }

    saveAddedSet(genId, setObj) {
        // Record that this set was added via API Explorer
        // Save a clean copy of the set data (without any user changes applied yet)
        if (!this.addedSets.find(e => e.set.id === setObj.id)) {
            this.addedSets.push({ genId, set: JSON.parse(JSON.stringify(setObj)) });
            try {
                localStorage.setItem('pokemon_tcg_added_sets', JSON.stringify(this.addedSets));
            } catch (e) {
                console.warn('Failed to save added sets:', e);
            }
        }
    }

    updateAddedSet(setId) {
        // Update the persisted copy when cards in an added set are changed
        const entry = this.addedSets.find(e => e.set.id === setId);
        if (entry) {
            const gen = this.data?.generations?.find(g => g.id === entry.genId);
            const liveSet = gen?.sets?.find(s => s.id === setId);
            if (liveSet) {
                entry.set = JSON.parse(JSON.stringify(liveSet));
                try {
                    localStorage.setItem('pokemon_tcg_added_sets', JSON.stringify(this.addedSets));
                } catch (e) {
                    console.warn('Failed to update added sets:', e);
                }
            }
        }
    }

    getGenerations() {
        return this.data?.generations || [];
    }

    getSet(genId, setId) {
        const gen = this.data?.generations?.find(g => g.id === genId);
        return gen?.sets?.find(s => s.id === setId);
    }

    findSetById(setId) {
        for (const gen of this.getGenerations()) {
            const set = gen.sets.find(s => s.id === setId);
            if (set) return { gen, set };
        }
        return null;
    }

    toggleCardStatus(genId, setId, cardIndex) {
        const set = this.getSet(genId, setId);
        if (set && set.cards[cardIndex]) {
            const card = set.cards[cardIndex];
            card.status = card.status === 'HAVE' ? 'NEED' : 'HAVE';
            if (card.status === 'NEED') {
                card.stock = 0;
            }
            this.changes[genId + '/' + setId + '/' + cardIndex + '/status'] = card.status;
            this.save();
            return card.status;
        }
        return null;
    }

    updateCardField(genId, setId, cardIndex, field, value) {
        const set = this.getSet(genId, setId);
        if (set && set.cards[cardIndex]) {
            const changeKey = genId + '/' + setId + '/' + cardIndex + '/' + field;
            if (field.startsWith('quantities.')) {
                const qtyField = field.split('.')[1];
                const numVal = parseInt(value) || 0;
                set.cards[cardIndex].quantities[qtyField] = numVal;
                this.changes[changeKey] = numVal;
            } else if (field === 'stock') {
                const numVal = parseInt(value) || 0;
                set.cards[cardIndex].stock = numVal;
                this.changes[changeKey] = numVal;
            } else {
                set.cards[cardIndex][field] = value;
                this.changes[changeKey] = value;
            }
            this.save();
        }
    }

    getGrandTotals() {
        let totalCards = 0, totalOwned = 0;
        for (const gen of this.getGenerations()) {
            for (const set of gen.sets) {
                totalCards += set.cards.length;
                totalOwned += set.cards.filter(c => c.status === 'HAVE').length;
            }
        }
        return {
            total: totalCards,
            owned: totalOwned,
            need: totalCards - totalOwned,
            percent: totalCards > 0 ? ((totalOwned / totalCards) * 100).toFixed(1) : 0,
        };
    }

    getGenTotals(gen) {
        let total = 0, owned = 0;
        for (const set of gen.sets) {
            total += set.cards.length;
            owned += set.cards.filter(c => c.status === 'HAVE').length;
        }
        return { total, owned, need: total - owned, percent: total > 0 ? ((owned / total) * 100).toFixed(1) : 0 };
    }

    getSetTotals(set) {
        const total = set.cards.length;
        const owned = set.cards.filter(c => c.status === 'HAVE').length;
        return { total, owned, need: total - owned, percent: total > 0 ? ((owned / total) * 100).toFixed(1) : 0 };
    }

    importData(data) {
        this.data = data;
        // Clear addedSets — the imported data already includes any added sets
        this.addedSets = [];
        localStorage.removeItem('pokemon_tcg_added_sets');
        this.save();
    }

    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    reset() {
        localStorage.removeItem('pokemon_tcg_changes');
        localStorage.removeItem('pokemon_tcg_added_sets');
        this.changes = {};
        this.addedSets = [];
        this.data = null;
        if (typeof COLLECTION_DATA !== 'undefined') {
            this.data = JSON.parse(JSON.stringify(COLLECTION_DATA));
        }
    }

    searchCards(query) {
        const results = [];
        const q = query.toLowerCase();
        for (const gen of this.getGenerations()) {
            for (const set of gen.sets) {
                for (let i = 0; i < set.cards.length; i++) {
                    const card = set.cards[i];
                    if (card.name.toLowerCase().includes(q) ||
                        card.number.toLowerCase().includes(q)) {
                        results.push({
                            card,
                            cardIndex: i,
                            set,
                            gen,
                        });
                    }
                    if (results.length >= 50) return results;
                }
                // Also match set names
                if (set.name.toLowerCase().includes(q) && !results.find(r => r.set.id === set.id && r.isSetMatch)) {
                    results.push({
                        card: null,
                        set,
                        gen,
                        isSetMatch: true,
                    });
                }
            }
        }
        return results;
    }
}

// =============================================
// APP CONTROLLER
// =============================================
class App {
    constructor() {
        this.store = new CollectionStore();
        this.priceService = new PriceService();
        this.currentView = 'dashboard';
        this.currentGenId = null;
        this.currentSetId = null;
        this.activeFilter = 'all';
        this.activeSort = 'default';
        this.collapsedGens = new Set();
        this.setStatusFilter = 'all';
        this.setSearchQuery = '';
        this.activeTypeFilter = null;
        this.fetchingPrices = false;
        this.cardSortColumn = null;
        this.cardSortDir = 'asc';

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderDashboard();
        this.updateCollectionValue();

        // Pre-fill API key if saved
        if (this.priceService.getApiKey()) {
            const input = document.getElementById('api-key-input');
            if (input) input.value = this.priceService.getApiKey();
        }
    }

    bindEvents() {
        // Navigation
        document.getElementById('nav-home').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('btn-stats').addEventListener('click', () => this.showView('stats'));
        document.getElementById('btn-import').addEventListener('click', () => this.showView('import'));
        document.getElementById('btn-api-explorer').addEventListener('click', () => this.showView('api-explorer'));
        document.getElementById('api-explorer-back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('api-explorer-fetch').addEventListener('click', () => this.fetchApiSets());
        document.getElementById('api-set-back').addEventListener('click', () => this.showApiSets());
        document.getElementById('api-explorer-search').addEventListener('input', (e) => this.filterApiSets(e.target.value));
        document.getElementById('back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('stats-back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('import-back-btn').addEventListener('click', () => this.showView('dashboard'));

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilter = btn.dataset.filter;
                this.renderGenerations();
            });
        });

        // Sort
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.activeSort = e.target.value;
            this.renderGenerations();
        });

        // Global search
        const searchInput = document.getElementById('global-search');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.handleGlobalSearch(e.target.value), 200);
        });
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                const dropdown = document.querySelector('.search-results');
                if (dropdown) dropdown.remove();
            }, 200);
        });

        // Set detail controls
        document.getElementById('set-search').addEventListener('input', (e) => {
            this.setSearchQuery = e.target.value;
            this.renderCardTable();
        });

        document.querySelectorAll('.set-actions .control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.set-actions .control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setStatusFilter = btn.dataset.status;
                this.renderCardTable();
            });
        });

        // Bulk condition
        document.getElementById('btn-bulk-condition').addEventListener('click', () => {
            this.applyBulkCondition();
        });

        // Sortable column headers
        document.querySelectorAll('#card-table thead .sortable').forEach(th => {
            th.addEventListener('click', () => {
                const col = th.dataset.sort;
                if (this.cardSortColumn === col) {
                    this.cardSortDir = this.cardSortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    this.cardSortColumn = col;
                    this.cardSortDir = 'asc';
                }
                this.renderCardTable();
            });
        });

        // Import/Export
        document.getElementById('btn-upload').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileImport(e));

        document.getElementById('btn-export').addEventListener('click', () => this.handleExport());

        document.getElementById('btn-import-json').addEventListener('click', () => {
            document.getElementById('json-input').click();
        });
        document.getElementById('json-input').addEventListener('change', (e) => this.handleJsonImport(e));

        document.getElementById('btn-reset').addEventListener('click', () => this.handleReset());

        // TCGPlayer import
        document.getElementById('btn-import-tcgplayer').addEventListener('click', () => this.parseTcgplayerOrders());
        document.getElementById('btn-apply-tcgplayer').addEventListener('click', () => this.applyTcgplayerImport());
        document.getElementById('btn-clear-import-log').addEventListener('click', () => {
            localStorage.removeItem('tcgplayer_import_log');
            this.renderImportLog();
            this.showToast('Import log cleared', 'success');
        });

        // API Key
        document.getElementById('btn-save-key').addEventListener('click', () => {
            const key = document.getElementById('api-key-input').value.trim();
            if (key) {
                this.priceService.setApiKey(key);
                document.getElementById('api-key-status').innerHTML = '<span style="color:var(--accent-green)">✅ API key saved! Prices will appear when you view a set.</span>';
                this.showToast('API key saved!', 'success');
            } else {
                document.getElementById('api-key-status').innerHTML = '<span style="color:var(--accent-red)">Please enter a valid API key.</span>';
            }
        });
    }

    // =============================================
    // TCGPLAYER ORDER IMPORT
    // =============================================
    parseTcgplayerOrders() {
        const text = document.getElementById('tcgplayer-paste').value;
        if (!text.trim()) {
            this.showToast('Please paste your TCGPlayer order text first', 'error');
            return;
        }

        // Parse condition strings from TCGPlayer
        const parseCondition = (condStr) => {
            const c = condStr.toLowerCase();
            if (c.includes('near mint')) return 'NM';
            if (c.includes('lightly played')) return 'LP';
            if (c.includes('moderately played')) return 'MP';
            if (c.includes('heavily played')) return 'HP';
            if (c.includes('damaged')) return 'DMG';
            return 'NM';
        };

        // Extract items from the pasted text
        // Split on both newlines and tabs (TCGPlayer tables use tabs between columns)
        const lines = text.split(/[\n\t]/).map(l => l.trim()).filter(l => l);
        const items = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Look for condition lines
            if (line.toLowerCase().startsWith('condition:')) {
                const condText = line.replace(/^condition:\s*/i, '').trim();
                const condition = parseCondition(condText);
                
                // Determine if it's holofoil from the condition text
                const isHolo = condText.toLowerCase().includes('holofoil');
                const isReverseHolo = condText.toLowerCase().includes('reverse');
                
                // Capture rarity from nearby rarity line
                let rarity = null;
                for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
                    if (lines[j].toLowerCase().startsWith('rarity:')) {
                        rarity = lines[j].replace(/^rarity:\s*/i, '').trim();
                        break;
                    }
                }
                
                // Search backward for card name and set name
                // The pattern is: CardName, SetName, then Rarity/Condition lines
                let cardName = null, setName = null;
                for (let j = i - 1; j >= Math.max(0, i - 8); j--) {
                    const prev = lines[j];
                    const prevLow = prev.toLowerCase();
                    // Skip rarity lines, price lines, seller lines, etc.
                    if (prevLow.startsWith('rarity:')) continue;
                    if (prev.match(/^\$[\d.,]+$/)) continue;
                    if (prev.match(/^\d+$/)) continue;
                    if (prevLow.startsWith('sold by')) continue;
                    if (prevLow.includes('items') || prevLow.includes('details') || prevLow.includes('price') || prevLow.includes('quantity')) continue;
                    // Skip seller notes that look like condition descriptions
                    if (prevLow.startsWith('near mint') || prevLow.startsWith('lightly played') || 
                        prevLow.startsWith('moderately played') || prevLow.startsWith('heavily played') || 
                        prevLow.startsWith('damaged')) continue;
                    // Skip standalone condition/type abbreviations (HP, LP, MP, NM, DMG, etc.)
                    if (/^(hp|lp|mp|nm|dmg)$/i.test(prev.trim())) continue;
                    
                    // First non-skipped line going back is the set name, second is card name
                    if (!setName) {
                        setName = prev;
                    } else if (!cardName) {
                        cardName = prev;
                        break;
                    }
                }
                
                // Check if card name has embedded set info: "Machamp - 8/102 (Base Set Shadowless)"
                if (cardName) {
                    const embeddedSet = cardName.match(/\(([^)]*(?:Base Set|Shadowless|Unlimited|1st Edition)[^)]*)\)/i);
                    if (embeddedSet) {
                        setName = embeddedSet[1].trim();
                        cardName = cardName.replace(/\s*\([^)]*(?:Base Set|Shadowless|Unlimited|1st Edition)[^)]*\)/i, '').trim();
                    }
                }
                
                // Search for the price - look forward first, then backward
                let pricePaid = null;
                // Forward: price usually appears after condition in TCGPlayer table
                for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
                    const next = lines[j];
                    const priceMatch = next.match(/\$(\d+[,\d]*\.?\d*)/);
                    if (priceMatch) {
                        pricePaid = parseFloat(priceMatch[1].replace(/,/g, ''));
                        break;
                    }
                }
                // Backward: some paste formats put price before condition
                if (pricePaid === null) {
                    for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
                        const prev = lines[j];
                        if (prev.toLowerCase().startsWith('rarity:') || prev.toLowerCase().startsWith('condition:')) continue;
                        const priceMatch = prev.match(/\$(\d+[,\d]*\.?\d*)/);
                        if (priceMatch) {
                            pricePaid = parseFloat(priceMatch[1].replace(/,/g, ''));
                            break;
                        }
                    }
                }
                
                if (cardName && setName) {
                    // If condition says "1st Edition", override set to 1st Edition variant
                    if (condText.toLowerCase().includes('1st edition')) {
                        if (setName.toLowerCase().includes('base set')) {
                            setName = 'Base Set (1st Edition)';
                        } else {
                            // For other sets, append 1st Edition qualifier
                            setName = setName.replace(/\s*\(.*?\)\s*$/, '').trim() + ' (1st Edition)';
                        }
                    }
                    items.push({ cardName, setName, condition, isHolo, isReverseHolo, pricePaid, rarity });
                }
            }
        }

        if (items.length === 0) {
            this.showToast('No card items found in the pasted text. Make sure to copy the full order details.', 'error');
            return;
        }

        // Match items against collection
        const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').toLowerCase().replace(/[^a-z0-9]/g, '');
        this._tcgplayerMatches = [];
        let matched = 0, unmatched = 0;

        for (const item of items) {
            // Clean TCGPlayer card name for matching:
            // "Buneary - DP06" → "Buneary", "Electrike (62)" → "Electrike"
            // "Pikachu ex - 179/131" → "Pikachu ex", "Arceus Lv.X (96)" → "Arceus LV.X"
            let cleanCardName = item.cardName
                .replace(/\s*-\s*\d+\/\d+$/i, '')     // strip " - 179/131" card number suffixes
                .replace(/\s*-\s*[A-Z]*\d+$/i, '')    // strip " - DP06" promo suffixes
                .replace(/\s*\(\d+\)\s*$/g, '')         // strip "(62)" number suffixes
                .trim();
            const targetCard = norm(cleanCardName);
            const targetCardFull = norm(item.cardName);
            // Clean set name: strip "SV:" prefix TCGPlayer uses
            const cleanSetName = item.setName.replace(/^SV:\s*/i, '').replace(/^SV\d*[a-z]*:\s*/i, '').trim();
            const targetSet = norm(cleanSetName);
            const targetSetFull = norm(item.setName);
            
            // Set name aliases for matching
            const SET_ALIASES = {
                'diamondandpearlpromos': ['dpblackstarpromos', 'diamondpearlpromos'],
                'dpblackstarpromos': ['diamondandpearlpromos'],
                'sunandmoonpromos': ['sunandmoonblackstarpromos', 'smblackstarpromos'],
                'swordandshieldpromos': ['swordandshieldpromos'],
                'xandypromos': ['xandyblackstarpromos'],
                'nintendopromos': ['nintendoblackstarpromos'],
                'nintendoblackstarpromos': ['nintendopromos'],
                'scarletandviolet151': ['151'],
                'scarletviolet151': ['151'],
                '151': ['scarletandviolet151', 'scarletviolet151'],
            };
            
            let bestMatch = null;
            let bestScore = 0;

            for (const gen of this.store.data.generations) {
                for (const set of gen.sets) {
                    const setNorm = norm(set.name);
                    const setBase = norm(set.name.replace(/\s*\(.*?\)\s*/g, '').replace(/^EX\s+/i, ''));
                    // Also compare with 'and' stripped for cases like "HeartGold SoulSilver" vs "HeartGold and SoulSilver"
                    const stripAnd = (s) => s.replace(/and/g, '');
                    const setNormNoAnd = stripAnd(setNorm);
                    const targetSetNoAnd = stripAnd(targetSet);
                    const targetSetFullNoAnd = stripAnd(targetSetFull);
                    
                    // Score set match by specificity (longer matches = higher scores)
                    let setScore = 0;
                    if (setNorm === targetSet || setBase === targetSet) setScore = 200;
                    else if (setNorm === targetSetFull || setBase === targetSetFull) setScore = 195;
                    // Match with 'and' stripped
                    else if (setNormNoAnd === targetSetNoAnd || setNormNoAnd === targetSetFullNoAnd) setScore = 195;
                    // Near-exact: one starts with the other (handles singular/plural)
                    else if (targetSet.startsWith(setNorm) && setNorm.length > 5) setScore = 150 + setNorm.length;
                    else if (setNorm.startsWith(targetSet) && targetSet.length > 5) setScore = 150 + targetSet.length;
                    else if (targetSet.startsWith(setBase) && setBase.length > 5) setScore = 140 + setBase.length;
                    // Substring: score by length of matching portion
                    else if (targetSet.includes(setNorm) && setNorm.length > 5) setScore = 30 + setNorm.length;
                    else if (setNorm.includes(targetSet) && targetSet.length > 5) setScore = 30 + targetSet.length;
                    else if (targetSet.includes(setBase) && setBase.length > 5) setScore = 25 + setBase.length;
                    else {
                        const aliases = SET_ALIASES[targetSet] || SET_ALIASES[targetSetFull] || [];
                        if (aliases.some(a => setNorm === a || setBase === a)) setScore = 190;
                    }
                    if (setScore === 0) continue;

                    for (let ci = 0; ci < set.cards.length; ci++) {
                        const card = set.cards[ci];
                        const cardNorm = norm(card.name);
                        // Base names: strip all (...) and [...] content for variant-agnostic matching
                        const stripVariant = (s) => s.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s*\[.*?\]\s*/g, ' ').trim();
                        const cardBase = norm(stripVariant(card.name));
                        const targetBase = norm(stripVariant(cleanCardName));
                        let cardScore = 0;
                        
                        // Exact match (best)
                        if (cardNorm === targetCard) cardScore = 100;
                        // Full TCGPlayer name matches
                        else if (cardNorm === targetCardFull) cardScore = 90;
                        // Base names match (e.g. "Ditto (Heavily Loved)" vs "Ditto [Mr. Mime]")
                        else if (cardBase === targetBase && cardBase.length >= 3) cardScore = 85;
                        // Collection card is prefix of TCGPlayer name
                        else if (targetCard.startsWith(cardNorm) && cardNorm.length >= 3) cardScore = 70;
                        else if (targetCardFull.startsWith(cardNorm) && cardNorm.length >= 3) cardScore = 60;
                        // Contains match
                        else if (targetCard.includes(cardNorm) && cardNorm.length > 4) cardScore = 50;
                        else continue;
                        
                        // Bonus for card number match
                        if (card.number && item.cardName) {
                            const numFromName = item.cardName.match(/\((\d+)\)/);
                            const promoNum = item.cardName.match(/-\s*([A-Z]*\d+)$/i);
                            const slashNum = item.cardName.match(/-\s*(\d+)\/\d+$/);
                            if (numFromName) {
                                const cardNum = card.number.replace(/^0+/, '').split('/')[0];
                                if (cardNum === numFromName[1]) cardScore += 50;
                            }
                            if (promoNum && norm(card.number) === norm(promoNum[1])) cardScore += 50;
                            if (slashNum) {
                                const cardNum = card.number.replace(/^0+/, '').split('/')[0];
                                if (cardNum === slashNum[1]) cardScore += 50;
                            }
                        }
                        
                        // Rarity-based tiebreaking for same-name cards
                        if (item.rarity && card.number) {
                            const rarityLow = item.rarity.toLowerCase();
                            const cardNumParts = card.number.split('/');
                            const cardIdx = parseInt(cardNumParts[0]) || 0;
                            const setTotal = parseInt(cardNumParts[1]) || 999;
                            
                            // Ultra/Secret/Illustration rares have high numbers relative to set size
                            const isHighNum = cardIdx > setTotal;
                            const isLateNum = cardIdx > setTotal * 0.85;
                            
                            if (rarityLow.includes('ultra rare') || rarityLow.includes('secret') || 
                                rarityLow.includes('special illustration') || rarityLow.includes('hyper rare')) {
                                if (isHighNum) cardScore += 30;
                                else if (isLateNum) cardScore += 15;
                            } else if (rarityLow.includes('holo rare') && !rarityLow.includes('reverse')) {
                                // Holo rares are typically early in the set
                                if (!isHighNum && !isLateNum) cardScore += 10;
                            } else if (rarityLow === 'common' || rarityLow === 'uncommon') {
                                // Commons/uncommons should NOT match secret/prime cards
                                if (isHighNum) cardScore -= 20;
                            }
                        }
                        
                        // Combined score: set specificity + card match
                        const totalScore = setScore + cardScore;
                        if (totalScore > bestScore) {
                            bestScore = totalScore;
                            bestMatch = { genId: gen.id, setId: set.id, cardIndex: ci, card, set, condition: item.condition, pricePaid: item.pricePaid };
                        }
                    }
                }
            }

            if (bestMatch) {
                this._tcgplayerMatches.push(bestMatch);
                matched++;
            } else {
                // Fallback: search ALL sets ignoring set name (for set name mismatches)
                for (const gen of this.store.data.generations) {
                    for (const set of gen.sets) {
                        for (let ci = 0; ci < set.cards.length; ci++) {
                            const card = set.cards[ci];
                            const cardNorm = norm(card.name);
                            if (cardNorm === targetCard && targetCard.length >= 3) {
                                bestMatch = { genId: gen.id, setId: set.id, cardIndex: ci, card, set, condition: item.condition, pricePaid: item.pricePaid };
                                break;
                            }
                        }
                        if (bestMatch) break;
                    }
                    if (bestMatch) break;
                }
                if (bestMatch) {
                    this._tcgplayerMatches.push(bestMatch);
                    matched++;
                } else {
                    this._tcgplayerMatches.push({ unmatched: true, cardName: item.cardName, setName: item.setName, condition: item.condition, pricePaid: item.pricePaid });
                    unmatched++;
                }
            }
        }

        // Show results
        const resultsDiv = document.getElementById('tcgplayer-results');
        resultsDiv.style.display = 'block';
        document.getElementById('tcgplayer-summary').textContent = `Found ${items.length} items: ${matched} matched, ${unmatched} unmatched`;

        const matchesDiv = document.getElementById('tcgplayer-matches');
        matchesDiv.innerHTML = this._tcgplayerMatches.map((m, i) => {
            if (m.unmatched) {
                return `<div style="padding:4px 8px;margin:2px 0;background:rgba(231,76,60,0.15);border-radius:6px;font-size:13px">
                    ❌ <strong>${this.escapeHtml(m.cardName)}</strong> — ${this.escapeHtml(m.setName)} → ${m.condition}${m.pricePaid != null ? ' ($' + m.pricePaid.toFixed(2) + ')' : ''} (no match found)
                </div>`;
            }
            const changed = (m.card.condition || 'NM') !== m.condition;
            const icon = changed ? '🔄' : '✅';
            return `<div style="padding:4px 8px;margin:2px 0;background:rgba(46,204,113,0.1);border-radius:6px;font-size:13px">
                ${icon} <strong>${this.escapeHtml(m.card.name)}</strong> — ${this.escapeHtml(m.set.name)} → <strong>${m.condition}</strong>${m.pricePaid != null ? ' ($' + m.pricePaid.toFixed(2) + ')' : ''}${changed ? ` (was ${m.card.condition || 'NM'})` : ' (no change)'}
            </div>`;
        }).join('');
    }

    applyTcgplayerImport() {
        if (!this._tcgplayerMatches || this._tcgplayerMatches.length === 0) return;

        let updated = 0;
        const logEntry = {
            timestamp: new Date().toISOString(),
            matched: [],
            unmatched: [],
            updated: []
        };

        for (const m of this._tcgplayerMatches) {
            if (m.unmatched) {
                logEntry.unmatched.push({ cardName: m.cardName, setName: m.setName, condition: m.condition, pricePaid: m.pricePaid });
                continue;
            }
            const oldCondition = m.card.condition || 'NM';
            const changed = oldCondition !== m.condition;
            logEntry.matched.push({ cardName: m.card.name, setName: m.set.name, condition: m.condition, oldCondition, pricePaid: m.pricePaid });
            if (changed) {
                this.store.updateCardField(m.genId, m.setId, m.cardIndex, 'condition', m.condition);
                logEntry.updated.push({ cardName: m.card.name, setName: m.set.name, from: oldCondition, to: m.condition, pricePaid: m.pricePaid });
                updated++;
            }
            // Save price paid to card
            if (m.pricePaid != null) {
                this.store.updateCardField(m.genId, m.setId, m.cardIndex, 'pricePaid', m.pricePaid);
            }
        }

        // Save log
        try {
            const logs = JSON.parse(localStorage.getItem('tcgplayer_import_log') || '[]');
            logs.push(logEntry);
            localStorage.setItem('tcgplayer_import_log', JSON.stringify(logs));
        } catch (e) {
            console.warn('Failed to save import log:', e);
        }

        this.showToast(`Updated ${updated} card conditions!`, 'success');
        document.getElementById('tcgplayer-paste').value = '';
        document.getElementById('tcgplayer-results').style.display = 'none';
        this._tcgplayerMatches = [];
        this.renderImportLog();
    }

    renderImportLog() {
        const container = document.getElementById('tcgplayer-log');
        if (!container) return;

        let logs = [];
        try {
            logs = JSON.parse(localStorage.getItem('tcgplayer_import_log') || '[]');
        } catch (e) { /* ignore */ }

        if (logs.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No import history yet.</p>';
            return;
        }

        container.innerHTML = logs.slice().reverse().map((log, ri) => {
            const i = logs.length - 1 - ri;
            const date = new Date(log.timestamp).toLocaleString();
            const unmatchedHtml = log.unmatched.length > 0
                ? log.unmatched.map(u => `<div style="padding:3px 8px;margin:1px 0;background:rgba(231,76,60,0.12);border-radius:4px;font-size:12px">❌ <strong>${this.escapeHtml(u.cardName)}</strong> — ${this.escapeHtml(u.setName)} (${u.condition})${u.pricePaid != null ? ' $' + u.pricePaid.toFixed(2) : ''}</div>`).join('')
                : '';
            const updatedHtml = log.updated.length > 0
                ? log.updated.map(u => `<div style="padding:3px 8px;margin:1px 0;background:rgba(46,204,113,0.1);border-radius:4px;font-size:12px">🔄 <strong>${this.escapeHtml(u.cardName)}</strong> — ${this.escapeHtml(u.setName)}: ${u.from} → ${u.to}${u.pricePaid != null ? ' ($' + u.pricePaid.toFixed(2) + ')' : ''}</div>`).join('')
                : '';
            return `
                <details style="margin-bottom:8px;border:1px solid var(--border-subtle);border-radius:8px;padding:8px 12px">
                    <summary style="cursor:pointer;font-size:13px;font-weight:600">
                        ${date} — ${log.matched.length} matched, ${log.unmatched.length} unmatched, ${log.updated.length} updated
                    </summary>
                    <div style="margin-top:8px">
                        ${log.unmatched.length > 0 ? '<div style="font-size:12px;font-weight:600;color:var(--accent-red);margin:4px 0">Unmatched:</div>' + unmatchedHtml : ''}
                        ${log.updated.length > 0 ? '<div style="font-size:12px;font-weight:600;color:var(--accent-green);margin:4px 0">Updated:</div>' + updatedHtml : ''}
                        ${log.unmatched.length === 0 && log.updated.length === 0 ? '<p style="font-size:12px;color:var(--text-muted)">No changes made.</p>' : ''}
                    </div>
                </details>
            `;
        }).join('');
    }

    // =============================================
    // VIEW MANAGEMENT
    // =============================================
    showView(view) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        this.currentView = view;

        if (view === 'dashboard') {
            document.getElementById('dashboard-view').classList.add('active');
            this.renderDashboard();
        } else if (view === 'set') {
            document.getElementById('set-view').classList.add('active');
        } else if (view === 'stats') {
            document.getElementById('stats-view').classList.add('active');
            this.renderStats();
        } else if (view === 'import') {
            document.getElementById('import-view').classList.add('active');
            this.renderImportLog();
        } else if (view === 'api-explorer') {
            document.getElementById('api-explorer-view').classList.add('active');
            if (!this._apiSetsCache) {
                this.fetchApiSets();
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // =============================================
    // DASHBOARD
    // =============================================
    renderDashboard() {
        this.renderGrandStats();
        this.renderGenerations();
        this.populateBulkFetch();
        this.updateCollectionValue();
    }

    populateBulkFetch() {
        const sel = document.getElementById('bulk-fetch-select');
        if (!sel) return;
        sel.innerHTML = '<option value="">💰 Fetch All Prices...</option>';
        for (const gen of this.store.data.generations) {
            sel.innerHTML += `<option value="${gen.id}">${gen.name}</option>`;
        }
        sel.value = '';
        sel.onchange = () => {
            const genId = sel.value;
            if (genId) this.bulkFetchGen(genId);
            sel.value = '';
        };
    }

    async bulkFetchGen(genId) {
        if (!this.priceService.getApiKey()) {
            this.showToast('Set your PokéWallet API key in Import/Export first', 'error');
            return;
        }
        const gen = this.store.data.generations.find(g => g.id === genId);
        if (!gen) return;

        const sel = document.getElementById('bulk-fetch-select');
        sel.disabled = true;

        let totalFetched = 0;
        let totalSets = gen.sets.length;

        for (let si = 0; si < gen.sets.length; si++) {
            const set = gen.sets[si];
            const haveCards = set.cards.filter(c => c.status === 'HAVE').length;
            if (haveCards === 0) continue;

            sel.style.background = 'var(--accent-blue)';
            sel.options[0].textContent = `⏳ ${gen.name}: ${set.name} (${si + 1}/${totalSets})...`;

            const result = await this.priceService.fetchSetPrices(set, (fetched, total, status) => {
                sel.options[0].textContent = status || `⏳ ${set.name}: ${fetched}/${total}...`;
            });

            if (result && result.success !== false) {
                totalFetched++;
            }
        }

        sel.disabled = false;
        sel.style.background = 'var(--accent-green)';
        sel.options[0].textContent = '💰 Fetch All Prices...';
        this.showToast(`Finished fetching ${gen.name}! (${totalFetched} sets)`, 'success');
        this.renderDashboard();
    }

    renderGrandStats() {
        const totals = this.store.getGrandTotals();
        document.getElementById('total-cards').textContent = totals.total.toLocaleString();
        document.getElementById('total-owned').textContent = totals.owned.toLocaleString();
        document.getElementById('total-need').textContent = totals.need.toLocaleString();
        document.getElementById('total-percent').textContent = totals.percent + '%';

        // Progress ring
        const ring = document.getElementById('total-progress-ring');
        const circumference = 2 * Math.PI * 35;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference - (totals.percent / 100) * circumference;
    }

    renderGenerations() {
        const container = document.getElementById('generations-container');
        container.innerHTML = '';

        const generations = this.store.getGenerations();

        for (const gen of generations) {
            const genTotals = this.store.getGenTotals(gen);
            const color = GEN_COLORS[gen.id] || '#3498db';

            // Get filtered sets
            let sets = this.getFilteredSets(gen);
            if (sets.length === 0 && this.activeFilter !== 'all') continue;

            sets = this.getSortedSets(sets);

            const section = document.createElement('div');
            section.className = 'gen-section';
            section.dataset.genId = gen.id;

            const isCollapsed = this.collapsedGens.has(gen.id);

            section.innerHTML = `
                <div class="gen-header" style="background: ${color}15; border: 1px solid ${color}30;">
                    <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${color};border-radius:4px 0 0 4px;"></div>
                    <h2 style="color:${color}">${gen.name}</h2>
                    <div class="gen-stats">
                        <span class="gen-owned">${genTotals.owned.toLocaleString()} owned</span>
                        <span>of ${genTotals.total.toLocaleString()}</span>
                        <div class="gen-progress">
                            <div class="gen-progress-fill" style="width:${Math.min(genTotals.percent, 100)}%;background:${color}"></div>
                        </div>
                        <span style="color:${color};font-weight:700">${genTotals.percent}%</span>
                    </div>
                    <span class="gen-toggle ${isCollapsed ? 'collapsed' : ''}">▼</span>
                </div>
                <div class="sets-grid ${isCollapsed ? 'collapsed' : ''}">
                    ${sets.map(set => this.renderSetCard(set, gen, color)).join('')}
                </div>
            `;

            // Toggle collapse
            section.querySelector('.gen-header').addEventListener('click', () => {
                const grid = section.querySelector('.sets-grid');
                const toggle = section.querySelector('.gen-toggle');
                if (this.collapsedGens.has(gen.id)) {
                    this.collapsedGens.delete(gen.id);
                    grid.classList.remove('collapsed');
                    toggle.classList.remove('collapsed');
                } else {
                    this.collapsedGens.add(gen.id);
                    grid.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                }
            });

            container.appendChild(section);

            // Bind set card clicks
            section.querySelectorAll('.set-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.openSet(card.dataset.genId, card.dataset.setId);
                });
            });
        }
    }

    getFilteredSets(gen) {
        return gen.sets.filter(set => {
            const totals = this.store.getSetTotals(set);
            switch (this.activeFilter) {
                case 'complete':
                    return totals.percent >= 100;
                case 'in-progress':
                    return totals.owned > 0 && totals.percent < 100;
                case 'not-started':
                    return totals.owned === 0;
                default:
                    return true;
            }
        });
    }

    getSortedSets(sets) {
        const sorted = [...sets];
        switch (this.activeSort) {
            case 'completion-desc':
                sorted.sort((a, b) => {
                    const aT = this.store.getSetTotals(a);
                    const bT = this.store.getSetTotals(b);
                    return parseFloat(bT.percent) - parseFloat(aT.percent);
                });
                break;
            case 'completion-asc':
                sorted.sort((a, b) => {
                    const aT = this.store.getSetTotals(a);
                    const bT = this.store.getSetTotals(b);
                    return parseFloat(aT.percent) - parseFloat(bT.percent);
                });
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'cards-desc':
                sorted.sort((a, b) => b.cards.length - a.cards.length);
                break;
        }
        return sorted;
    }

    renderSetCard(set, gen, color) {
        const totals = this.store.getSetTotals(set);
        const pctNum = parseFloat(totals.percent);
        let statusClass, badgeText;
        if (pctNum >= 100) {
            statusClass = 'complete';
            badgeText = '✅ Complete';
        } else if (totals.owned > 0) {
            statusClass = 'in-progress';
            badgeText = `${totals.percent}%`;
        } else {
            statusClass = 'not-started';
            badgeText = 'Not Started';
        }
        // Calculate set value from cached prices (HAVE cards only)
        let setValue = 0;
        for (const card of set.cards) {
            if (card.status !== 'HAVE') continue;
            setValue += this.getCardValue(card, set.name);
        }
        const valueTag = setValue > 0
            ? `<span class="set-card-value">💰 $${setValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
            : '';

        return `
            <div class="set-card ${statusClass}" data-gen-id="${gen.id}" data-set-id="${set.id}">
                <div class="set-card-header">
                    <span class="set-card-name">${getSetSymbolImg(set.name, 18)}${set.name}</span>
                    <span class="set-card-badge ${statusClass}">${badgeText}</span>
                </div>
                <div class="set-card-counts">
                    <span>${totals.owned} / ${totals.total} cards</span>
                    <span>${totals.need} need</span>
                </div>
                ${valueTag}
                <div class="set-card-progress">
                    <div class="set-card-progress-fill" style="width:${Math.min(pctNum, 100)}%"></div>
                </div>
            </div>
        `;
    }

    // =============================================
    // SET DETAIL
    // =============================================
    openSet(genId, setId) {
        this.currentGenId = genId;
        this.currentSetId = setId;
        this.setStatusFilter = 'all';
        this.setSearchQuery = '';
        this.activeTypeFilter = null;
        document.getElementById('set-search').value = '';

        // Reset status filter buttons
        document.querySelectorAll('.set-actions .control-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.set-actions .control-btn[data-status="all"]').classList.add('active');

        this.renderSetHeader();
        this.renderTypeFilters();
        this.renderCardTable();
        this.showView('set');

        // Add fetch prices button if API key exists
        const setControls = document.querySelector('.set-controls');
        let fetchBtn = document.getElementById('btn-fetch-prices');
        if (!fetchBtn && this.priceService.getApiKey()) {
            fetchBtn = document.createElement('button');
            fetchBtn.id = 'btn-fetch-prices';
            fetchBtn.className = 'fetch-prices-btn';
            fetchBtn.textContent = '💰 Fetch Prices';
            fetchBtn.addEventListener('click', () => this.fetchSetPrices());
            setControls.appendChild(fetchBtn);
        }

        // Add clear cache button if API key exists
        let clearBtn = document.getElementById('btn-clear-price-cache');
        if (!clearBtn && this.priceService.getApiKey()) {
            clearBtn = document.createElement('button');
            clearBtn.id = 'btn-clear-price-cache';
            clearBtn.className = 'fetch-prices-btn clear-cache-btn';
            clearBtn.textContent = '🗑️ Clear Cached Prices';
            clearBtn.addEventListener('click', () => {
                const result = this.store.findSetById(this.currentSetId);
                if (!result) return;
                const count = this.priceService.clearSetCache(result.set);
                this.renderCardTable();
                this.updateSetValue();
                clearBtn.textContent = `✅ Cleared ${count} prices`;
                setTimeout(() => { clearBtn.textContent = '🗑️ Clear Cached Prices'; }, 2000);
            });
            setControls.appendChild(clearBtn);
        }
    }

    renderSetHeader() {
        const result = this.store.findSetById(this.currentSetId);
        if (!result) return;
        const { set } = result;
        const totals = this.store.getSetTotals(set);

        document.getElementById('set-name').innerHTML = getSetSymbolImg(set.name, 24) + this.escapeHtml(set.name);
        document.getElementById('set-release-date').textContent = set.releaseDate || '';
        document.getElementById('set-total').textContent = totals.total;
        document.getElementById('set-owned').textContent = totals.owned;
        document.getElementById('set-need').textContent = totals.need;
        document.getElementById('set-pct').textContent = totals.percent + '%';

        // Set the full logo image
        const logoEl = document.getElementById('set-logo');
        const symbolUrl = typeof SET_SYMBOLS !== 'undefined' && SET_SYMBOLS[set.name];
        if (symbolUrl && logoEl) {
            const logoUrl = symbolUrl.replace('/symbol.png', '/logo.png');
            logoEl.src = logoUrl;
            logoEl.alt = set.name + ' logo';
            logoEl.style.display = '';
            logoEl.onerror = () => { logoEl.style.display = 'none'; };
        } else if (logoEl) {
            logoEl.style.display = 'none';
        }
    }

    renderTypeFilters() {
        const result = this.store.findSetById(this.currentSetId);
        if (!result) return;

        const types = new Set();
        result.set.cards.forEach(c => {
            if (c.type) types.add(c.type);
        });

        const container = document.getElementById('type-filters');
        container.innerHTML = '';

        for (const type of [...types].sort()) {
            const colors = TYPE_COLORS[type] || { bg: 'rgba(150,150,150,0.15)', text: '#aaa' };
            const badge = document.createElement('span');
            badge.className = 'type-badge';
            badge.textContent = type;
            badge.style.background = colors.bg;
            badge.style.color = colors.text;
            badge.dataset.type = type;

            badge.addEventListener('click', () => {
                if (this.activeTypeFilter === type) {
                    this.activeTypeFilter = null;
                    badge.classList.remove('active');
                } else {
                    document.querySelectorAll('.type-badge').forEach(b => b.classList.remove('active'));
                    this.activeTypeFilter = type;
                    badge.classList.add('active');
                }
                this.renderCardTable();
            });

            container.appendChild(badge);
        }
    }

    renderCardTable() {
        const result = this.store.findSetById(this.currentSetId);
        if (!result) return;
        const { set } = result;

        const tbody = document.getElementById('card-table-body');
        const query = this.setSearchQuery.toLowerCase();

        const filteredCards = set.cards.map((card, index) => ({ card, index })).filter(({ card }) => {
            // Status filter
            if (this.setStatusFilter !== 'all' && card.status !== this.setStatusFilter) return false;
            // Type filter
            if (this.activeTypeFilter && card.type !== this.activeTypeFilter) return false;
            // Search
            if (query && !card.name.toLowerCase().includes(query) && !card.number.toLowerCase().includes(query)) return false;
            return true;
        });

        // Sort
        if (this.cardSortColumn) {
            const dir = this.cardSortDir === 'asc' ? 1 : -1;
            const col = this.cardSortColumn;
            filteredCards.sort((a, b) => {
                let va, vb;
                const ca = a.card, cb = b.card;
                switch (col) {
                    case 'number': {
                        const na = parseInt(ca.number.split('/')[0]) || 0;
                        const nb = parseInt(cb.number.split('/')[0]) || 0;
                        va = na; vb = nb; break;
                    }
                    case 'name': va = (ca.name || '').toLowerCase(); vb = (cb.name || '').toLowerCase(); break;
                    case 'type': va = (ca.type || '').toLowerCase(); vb = (cb.type || '').toLowerCase(); break;
                    case 'status': va = ca.status || ''; vb = cb.status || ''; break;
                    case 'condition': va = ca.condition || 'NM'; vb = cb.condition || 'NM'; break;
                    case 'price': {
                        va = this.getCardValue(ca, set.name);
                        vb = this.getCardValue(cb, set.name);
                        break;
                    }
                    case 'pricePaid': va = ca.pricePaid || 0; vb = cb.pricePaid || 0; break;
                    case 'qty-firstEdition': va = (ca.quantities && ca.quantities.firstEdition) || 0; vb = (cb.quantities && cb.quantities.firstEdition) || 0; break;
                    case 'qty-unlimited': {
                        const qa = ca.quantities || {};
                        const qb = cb.quantities || {};
                        va = (qa.unlimited || 0) + (qa.normal || 0);
                        vb = (qb.unlimited || 0) + (qb.normal || 0);
                        break;
                    }
                    case 'qty-holofoil': va = (ca.quantities && ca.quantities.holofoil) || 0; vb = (cb.quantities && cb.quantities.holofoil) || 0; break;
                    case 'qty-reverseHolofoil': va = (ca.quantities && ca.quantities.reverseHolofoil) || 0; vb = (cb.quantities && cb.quantities.reverseHolofoil) || 0; break;
                    case 'rarity': va = (ca.rarity || '').toLowerCase(); vb = (cb.rarity || '').toLowerCase(); break;
                    case 'note': va = (ca.note || '').toLowerCase(); vb = (cb.note || '').toLowerCase(); break;
                    default: va = 0; vb = 0;
                }
                if (va < vb) return -1 * dir;
                if (va > vb) return 1 * dir;
                return 0;
            });
        }

        // Update sort arrows in header
        document.querySelectorAll('#card-table thead .sortable').forEach(th => {
            const arrow = th.querySelector('.sort-arrow');
            if (th.dataset.sort === this.cardSortColumn) {
                th.classList.add('sort-active');
                arrow.textContent = this.cardSortDir === 'asc' ? ' ▲' : ' ▼';
            } else {
                th.classList.remove('sort-active');
                arrow.textContent = '';
            }
        });

        tbody.innerHTML = filteredCards.map(({ card, index }) => {
            const typeColors = TYPE_COLORS[card.type] || { bg: 'rgba(150,150,150,0.15)', text: '#aaa' };
            const statusClass = card.status === 'HAVE' ? 'have' : 'need';
            const qty = card.quantities || {};

            return `
                <tr>
                    <td class="col-thumb">${getCardThumbnail(result.set.name, card.number)}</td>
                    <td class="col-num">${this.escapeHtml(card.number)}</td>
                    <td class="col-name">
                        ${this.escapeHtml(card.name)}
                        <a href="${this.getCardUrl(card, result.set)}" 
                           target="_blank" rel="noopener" class="tcg-link" title="View on TCGPlayer">🛒</a>
                    </td>
                    <td class="col-type">
                        <span class="type-cell" style="background:${typeColors.bg};color:${typeColors.text}">
                            ${this.escapeHtml(card.type || '—')}
                        </span>
                    </td>
                    <td class="col-status" style="text-align:center">
                        <button class="status-toggle ${statusClass}" data-index="${index}">
                            ${card.status}
                        </button>
                    </td>
                    <td class="col-condition" style="text-align:center">
                        <select class="condition-select" data-index="${index}">
                            ${Object.entries(CONDITION_LABELS).map(([k, v]) =>
                                `<option value="${k}" ${(card.condition || 'NM') === k ? 'selected' : ''}>${k}</option>`
                            ).join('')}
                        </select>
                    </td>
                    <td class="col-price" style="text-align:right">
                        ${this.renderPriceCell(card, result.set)}
                    </td>
                    <td class="col-paid" style="text-align:right">
                        ${card.pricePaid != null ? '<span style="color:var(--accent-blue)">$' + card.pricePaid.toFixed(2) + '</span>' : '—'}
                    </td>
                    <td class="col-qty" style="text-align:center">
                        <input type="checkbox" class="qty-check" data-field="quantities.firstEdition" data-index="${index}" ${(qty.firstEdition || 0) > 0 ? 'checked' : ''}>
                    </td>
                    <td class="col-qty" style="text-align:center">
                        <input type="checkbox" class="qty-check" data-field="quantities.unlimited" data-index="${index}" ${((qty.unlimited || 0) + (qty.normal || 0)) > 0 ? 'checked' : ''}>
                    </td>
                    <td class="col-qty" style="text-align:center">
                        <input type="checkbox" class="qty-check" data-field="quantities.holofoil" data-index="${index}" ${(qty.holofoil || 0) > 0 ? 'checked' : ''}>
                    </td>
                    <td class="col-qty" style="text-align:center">
                        <input type="checkbox" class="qty-check" data-field="quantities.reverseHolofoil" data-index="${index}" ${(qty.reverseHolofoil || 0) > 0 ? 'checked' : ''}>
                    </td>
                    <td class="col-rarity">${this.renderRarityCell(card, result.set)}</td>
                    <td class="col-note">
                        <span class="editable" contenteditable="true" data-field="note" data-index="${index}">${this.escapeHtml(card.note || '')}</span>
                    </td>
                </tr>
            `;
        }).join('');

        // Bind status toggles
        tbody.querySelectorAll('.status-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const newStatus = this.store.toggleCardStatus(this.currentGenId, this.currentSetId, idx);
                if (newStatus) {
                    btn.textContent = newStatus;
                    btn.className = 'status-toggle ' + (newStatus === 'HAVE' ? 'have' : 'need');
                    this.renderSetHeader();
                    this.showToast(`Card ${newStatus === 'HAVE' ? '✅ marked as HAVE' : '❌ marked as NEED'}`, 'success');
                }
            });
        });

        // Bind editable fields (note field only now)
        tbody.querySelectorAll('.editable').forEach(el => {
            el.addEventListener('blur', () => {
                const idx = parseInt(el.dataset.index);
                const field = el.dataset.field;
                const value = el.textContent.trim();
                this.store.updateCardField(this.currentGenId, this.currentSetId, idx, field, value);
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    el.blur();
                }
            });
        });

        // Bind qty checkboxes
        tbody.querySelectorAll('.qty-check').forEach(cb => {
            cb.addEventListener('change', () => {
                const idx = parseInt(cb.dataset.index);
                const field = cb.dataset.field;
                const value = cb.checked ? 1 : 0;
                this.store.updateCardField(this.currentGenId, this.currentSetId, idx, field, value);
                // Also zero out legacy 'normal' when toggling unlimited
                if (field === 'quantities.unlimited') {
                    this.store.updateCardField(this.currentGenId, this.currentSetId, idx, 'quantities.normal', 0);
                }
                this.updateSetValue();
                this.renderSetHeader();
            });
        });

        // Bind condition selects
        tbody.querySelectorAll('.condition-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const idx = parseInt(sel.dataset.index);
                this.store.updateCardField(this.currentGenId, this.currentSetId, idx, 'condition', sel.value);
                this.renderCardTable();
                this.updateSetValue();
            });
        });

        this.updateSetValue();
    }
    // =============================================
    // BULK CONDITION
    // =============================================
    applyBulkCondition() {
        const condition = document.getElementById('bulk-condition-select').value;
        const result = this.store.findSetById(this.currentSetId);
        if (!result) return;
        const { set } = result;
        const query = this.setSearchQuery.toLowerCase();

        // Get the same filtered cards as renderCardTable
        const filteredIndices = set.cards.map((card, index) => ({ card, index })).filter(({ card }) => {
            if (this.setStatusFilter !== 'all' && card.status !== this.setStatusFilter) return false;
            if (this.activeTypeFilter && card.type !== this.activeTypeFilter) return false;
            if (query && !card.name.toLowerCase().includes(query) && !card.number.toLowerCase().includes(query)) return false;
            return true;
        });

        if (filteredIndices.length === 0) return;

        const confirmMsg = `Set condition to "${condition}" for ${filteredIndices.length} visible card${filteredIndices.length !== 1 ? 's' : ''}?`;
        if (!confirm(confirmMsg)) return;

        for (const { index } of filteredIndices) {
            this.store.updateCardField(this.currentGenId, this.currentSetId, index, 'condition', condition);
        }

        this.renderCardTable();
        this.updateSetValue();
    }

    // =============================================
    // GLOBAL SEARCH
    // =============================================
    handleGlobalSearch(query) {
        // Remove existing dropdown
        const existing = document.querySelector('.search-results');
        if (existing) existing.remove();

        if (!query || query.length < 2) return;

        const results = this.store.searchCards(query);
        if (results.length === 0) return;

        const dropdown = document.createElement('div');
        dropdown.className = 'search-results';

        for (const result of results.slice(0, 20)) {
            const item = document.createElement('div');
            item.className = 'search-result-item';

            if (result.isSetMatch) {
                const totals = this.store.getSetTotals(result.set);
                item.innerHTML = `
                    <div>
                        <div class="search-result-name">📂 ${this.escapeHtml(result.set.name)}</div>
                        <div class="search-result-set">${totals.owned}/${totals.total} cards — ${result.gen.name}</div>
                    </div>
                `;
                item.addEventListener('mousedown', () => {
                    this.openSet(result.gen.id, result.set.id);
                    document.getElementById('global-search').value = '';
                });
            } else {
                const card = result.card;
                const typeColors = TYPE_COLORS[card.type] || { text: '#aaa' };
                item.innerHTML = `
                    <div>
                        <div class="search-result-name">${this.escapeHtml(card.name)}</div>
                        <div class="search-result-set">${this.escapeHtml(result.set.name)} · #${this.escapeHtml(card.number)}</div>
                    </div>
                    <span class="status-toggle ${card.status === 'HAVE' ? 'have' : 'need'}" style="font-size:10px;padding:2px 8px;pointer-events:none">
                        ${card.status}
                    </span>
                `;
                item.addEventListener('mousedown', () => {
                    this.openSet(result.gen.id, result.set.id);
                    document.getElementById('global-search').value = '';
                });
            }

            dropdown.appendChild(item);
        }

        document.querySelector('.nav-search').appendChild(dropdown);
    }

    // =============================================
    // STATISTICS
    // =============================================
    renderStats() {
        const container = document.getElementById('stats-content');
        container.innerHTML = '';

        // Generation completion chart
        const genCard = document.createElement('div');
        genCard.className = 'stats-card';
        genCard.style.gridColumn = 'span 2';
        genCard.innerHTML = `<h3>Completion by Generation</h3><div class="bar-chart" id="gen-chart"></div>`;
        container.appendChild(genCard);

        const genChart = genCard.querySelector('#gen-chart');
        for (const gen of this.store.getGenerations()) {
            const totals = this.store.getGenTotals(gen);
            const color = GEN_COLORS[gen.id] || '#3498db';
            genChart.innerHTML += `
                <div class="bar-item">
                    <span class="bar-label">${gen.id.replace('gen', 'Gen ')}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${Math.min(totals.percent, 100)}%;background:${color}"></div>
                    </div>
                    <span class="bar-value" style="color:${color}">${totals.percent}%</span>
                </div>
            `;
        }

        // Top completed sets
        const allSets = [];
        for (const gen of this.store.getGenerations()) {
            for (const set of gen.sets) {
                const totals = this.store.getSetTotals(set);
                allSets.push({ ...totals, name: set.name, genId: gen.id });
            }
        }

        const topComplete = allSets.filter(s => s.owned > 0).sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent)).slice(0, 10);
        const topCard = document.createElement('div');
        topCard.className = 'stats-card';
        topCard.innerHTML = `<h3>Most Complete Sets</h3><div class="bar-chart">${
            topComplete.map(s => {
                const color = parseFloat(s.percent) >= 100 ? '#27ae60' : '#3498db';
                return `
                    <div class="bar-item">
                        <span class="bar-label" style="width:140px;font-size:11px">${s.name.substring(0, 20)}</span>
                        <div class="bar-track">
                            <div class="bar-fill" style="width:${Math.min(s.percent, 100)}%;background:${color}"></div>
                        </div>
                        <span class="bar-value" style="color:${color}">${s.percent}%</span>
                    </div>
                `;
            }).join('')
        }</div>`;
        container.appendChild(topCard);

        // Least complete sets (with progress)
        const leastComplete = allSets.filter(s => s.owned > 0 && parseFloat(s.percent) < 100).sort((a, b) => parseFloat(a.percent) - parseFloat(b.percent)).slice(0, 10);
        const leastCard = document.createElement('div');
        leastCard.className = 'stats-card';
        leastCard.innerHTML = `<h3>Needs Most Work</h3><div class="bar-chart">${
            leastComplete.map(s => `
                <div class="bar-item">
                    <span class="bar-label" style="width:140px;font-size:11px">${s.name.substring(0, 20)}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${Math.min(s.percent, 100)}%;background:#e74c3c"></div>
                    </div>
                    <span class="bar-value" style="color:#e74c3c">${s.percent}%</span>
                </div>
            `).join('')
        }</div>`;
        container.appendChild(leastCard);

        // Quick stats
        const quickCard = document.createElement('div');
        quickCard.className = 'stats-card';
        const grandTotals = this.store.getGrandTotals();
        const completeSets = allSets.filter(s => parseFloat(s.percent) >= 100).length;
        const inProgressSets = allSets.filter(s => s.owned > 0 && parseFloat(s.percent) < 100).length;
        const notStartedSets = allSets.filter(s => s.owned === 0).length;
        quickCard.innerHTML = `
            <h3>Quick Stats</h3>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Total Sets</span><span style="font-weight:700">${allSets.length}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#27ae60">✅ Complete</span><span style="font-weight:700;color:#27ae60">${completeSets}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#3498db">🔵 In Progress</span><span style="font-weight:700;color:#3498db">${inProgressSets}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted)">⬜ Not Started</span><span style="font-weight:700;color:var(--text-muted)">${notStartedSets}</span></div>
                <hr style="border:none;border-top:1px solid var(--border-color)">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Unique Cards</span><span style="font-weight:700">${grandTotals.total.toLocaleString()}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Cards Owned</span><span style="font-weight:700;color:#27ae60">${grandTotals.owned.toLocaleString()}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Cards Needed</span><span style="font-weight:700;color:#e74c3c">${grandTotals.need.toLocaleString()}</span></div>
            </div>
        `;
        container.appendChild(quickCard);
    }

    // =============================================
    // IMPORT / EXPORT
    // =============================================
    handleFileImport(e) {
        // For future: parse Excel in browser using SheetJS
        this.showToast('Excel import coming soon! Use JSON import for now.', 'error');
    }

    handleExport() {
        const data = this.store.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pokemon_tcg_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('✅ Backup exported successfully!', 'success');
    }

    handleJsonImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.generations) {
                    this.store.importData(data);
                    this.renderDashboard();
                    this.showView('dashboard');
                    this.showToast('✅ Collection imported successfully!', 'success');
                } else {
                    this.showToast('Invalid file format. Expected collection JSON.', 'error');
                }
            } catch (err) {
                this.showToast('Error parsing JSON file.', 'error');
            }
        };
        reader.readAsText(file);
    }

    handleReset() {
        if (confirm('Are you sure? This will reset ALL your collection data!')) {
            this.store.reset();
            this.renderDashboard();
            this.showToast('Collection reset to defaults.', 'success');
        }
    }

    // =============================================
    // UTILITIES
    // =============================================
    getCardUrl(card, set) {
        // Use direct TCGPlayer URL from PokéWallet if available
        const price = this.priceService.getCachedPrice(card.name, set.name, card.number);
        if (price && price.tcgplayerUrl) {
            return price.tcgplayerUrl;
        }
        return this.getTcgPlayerUrl(card.name, set.name);
    }

    renderRarityCell(card, set) {
        // Try rarity from API cache first, then from card data
        let rarityStr = card.rarity || '';
        const price = this.priceService.getCachedPrice(card.name, set.name, card.number);
        if (price && price.rarity) {
            rarityStr = price.rarity;
        }

        if (!rarityStr) return '';

        const display = getRarityDisplay(rarityStr);
        return `<span class="rarity-badge" title="${display.label}" style="color:${display.color}">${display.symbol}</span>`;
    }

    renderPriceCell(card, set) {
        const price = this.priceService.getCachedPrice(card.name, set.name, card.number);
        if (!price || !price.variantPrices) {
            if (price && price.market) {
                const url = price.tcgplayerUrl || this.getTcgPlayerUrl(card.name, set.name);
                return `<a href="${url}" target="_blank" rel="noopener" class="price-cell" style="text-decoration:none">$${price.market.toFixed(2)}</a>`;
            }
            return '<span class="price-cell loading-price">—</span>';
        }

        const condition = card.condition || 'NM';
        const multiplier = CONDITION_MULTIPLIERS[condition] || 1;
        const url = price.tcgplayerUrl || this.getTcgPlayerUrl(card.name, set.name);
        
        const variants = this.resolveCardVariants(card);
        const lines = [];

        for (const v of variants) {
            const vp = this.findVariantPrice(price.variantPrices, v.apiName);
            if (vp && vp.market) {
                const adj = vp.market * multiplier;
                const tip = condition !== 'NM'
                    ? `${v.label} NM: $${vp.market.toFixed(2)} × ${(multiplier*100).toFixed(0)}%`
                    : `${v.label}: $${vp.market.toFixed(2)}`;
                lines.push(`<a href="${url}" target="_blank" rel="noopener" class="price-line" title="${tip}" style="text-decoration:none"><span class="price-label">${v.tag}</span>$${adj.toFixed(2)}</a>`);
            }
        }

        if (lines.length > 0) return lines.join('');

        // Fallback: show first available price
        if (price.market) {
            const adj = price.market * multiplier;
            return `<a href="${url}" target="_blank" rel="noopener" class="price-cell" style="text-decoration:none">$${adj.toFixed(2)}</a>`;
        }
        return '<span class="price-cell loading-price">—</span>';
    }

    // Determine combined edition × finish variants from qty columns
    resolveCardVariants(card) {
        const qty = card.quantities || {};
        const has1st = (qty.firstEdition || 0) > 0;
        const hasUnl = ((qty.unlimited || 0) + (qty.normal || 0)) > 0;
        const hasHolo = (qty.holofoil || 0) > 0;
        const hasRev = (qty.reverseHolofoil || 0) > 0;

        const variants = [];

        if (has1st) {
            if (hasHolo) {
                variants.push({ apiName: '1st Edition Holofoil', tag: '1ST HOLO', label: '1st Edition Holofoil' });
            }
            if (hasRev) {
                variants.push({ apiName: '1st Edition Reverse Holofoil', tag: '1ST REV', label: '1st Edition Reverse Holofoil' });
            }
            if (!hasHolo && !hasRev) {
                variants.push({ apiName: '1st Edition', tag: '1ST', label: '1st Edition' });
            }
        }

        if (hasUnl) {
            if (hasHolo) {
                variants.push({ apiName: 'Unlimited Holofoil', tag: 'UNLTD HOLO', label: 'Unlimited Holofoil' });
            }
            if (hasRev) {
                variants.push({ apiName: 'Reverse Holofoil', tag: 'REV', label: 'Reverse Holofoil' });
            }
            if (!hasHolo && !hasRev) {
                variants.push({ apiName: 'Unlimited', tag: 'UNLTD', label: 'Unlimited' });
            }
        }

        // If no edition set but has finish
        if (!has1st && !hasUnl) {
            if (hasHolo) {
                variants.push({ apiName: 'Holofoil', tag: 'HOLO', label: 'Holofoil' });
            }
            if (hasRev) {
                variants.push({ apiName: 'Reverse Holofoil', tag: 'REV', label: 'Reverse Holofoil' });
            }
        }

        return variants;
    }

    // Find API price with smart fallbacks
    findVariantPrice(variantPrices, apiName) {
        let vp = variantPrices[apiName];
        if (vp) return vp;

        // Fallback chains
        const fallbacks = {
            'Unlimited': ['Normal', 'Unlimited Holofoil'],
            'Unlimited Holofoil': ['Holofoil', 'Unlimited'],
            '1st Edition Holofoil': ['1st Edition'],
            '1st Edition': ['1st Edition Holofoil'],
            'Holofoil': ['Unlimited Holofoil', 'Normal'],
            'Reverse Holofoil': ['Reverse Holofoil'],
            'Normal': ['Unlimited'],
        };

        for (const fb of (fallbacks[apiName] || [])) {
            vp = variantPrices[fb];
            if (vp) return vp;
        }
        return null;
    }

    // Get the best single price for a card based on its variant checkboxes
    getCardValue(card, setName) {
        const price = this.priceService.getCachedPrice(card.name, setName, card.number);
        if (!price) return 0;

        const condition = card.condition || 'NM';
        const multiplier = CONDITION_MULTIPLIERS[condition] || 1;

        if (price.variantPrices) {
            const variants = this.resolveCardVariants(card);
            
            // Sum distinct variant prices (each checked variant contributes once)
            let variantTotal = 0;
            let foundAny = false;
            const counted = new Set();
            
            for (const v of variants) {
                const vp = this.findVariantPrice(price.variantPrices, v.apiName);
                if (vp && vp.market) {
                    // Avoid double-counting if two variant paths resolve to the same fallback
                    const key = vp.market.toFixed(4);
                    if (!counted.has(v.apiName)) {
                        counted.add(v.apiName);
                        variantTotal += vp.market * multiplier;
                        foundAny = true;
                    }
                }
            }
            
            if (foundAny) return variantTotal;
            
            // No variant matched — fall back to general market price
            if (price.market) return price.market * multiplier;
        } else if (price.market) {
            return price.market * multiplier;
        }
        return 0;
    }

    updateSetValue() {
        const result = this.store.findSetById(this.currentSetId);
        if (!result) return;
        const { set } = result;

        let totalValue = 0;
        let pricedCount = 0;

        for (const card of set.cards) {
            if (card.status !== 'HAVE') continue;
            
            const val = this.getCardValue(card, set.name);
            if (val > 0) {
                totalValue += val;
                pricedCount++;
            }
        }

        const valueStat = document.getElementById('set-value-stat');
        const valueEl = document.getElementById('set-value');
        if (totalValue > 0 && valueStat && valueEl) {
            valueStat.style.display = '';
            valueEl.textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else if (valueStat) {
            valueStat.style.display = 'none';
        }
    }

    updateCollectionValue() {
        let totalValue = 0;
        let pricedCards = 0;
        for (const gen of this.store.getGenerations()) {
            for (const set of gen.sets) {
                for (const card of set.cards) {
                    if (card.status === 'HAVE') {
                        const val = this.getCardValue(card, set.name);
                        if (val > 0) {
                            totalValue += val;
                            pricedCards++;
                        }
                    }
                }
            }
        }
        const valueCard = document.getElementById('value-card');
        if (valueCard) {
            if (totalValue > 0) {
                valueCard.style.display = '';
                document.getElementById('total-value').textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const subtitle = valueCard.querySelector('.stat-subtitle');
                if (subtitle) subtitle.textContent = `${pricedCards} cards priced`;
            } else {
                valueCard.style.display = 'none';
            }
        }
    }

    async fetchSetPrices() {
        if (this.fetchingPrices) return;
        if (!this.priceService.getApiKey()) {
            this.showToast('Add your PokéWallet API key in Settings first!', 'error');
            return;
        }

        const result = this.store.findSetById(this.currentSetId);
        if (!result) return;

        this.fetchingPrices = true;
        const btn = document.getElementById('btn-fetch-prices');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Fetching...';
        }

        const fetchResult = await this.priceService.fetchSetPrices(result.set, (fetched, total, status) => {
            if (btn) btn.textContent = status || `Fetching ${fetched}/${total}...`;
            // Live-update table every 5 cards
            if (fetched % 5 === 0) this.renderCardTable();
        });

        this.fetchingPrices = false;
        if (btn) {
            btn.disabled = false;
            btn.textContent = '💰 Fetch Prices';
        }

        this.renderCardTable();
        this.updateCollectionValue();

        if (fetchResult && !fetchResult.success && fetchResult.reason === 'rate_limited') {
            this.showToast(`Rate limited! Got ${fetchResult.fetched} prices. Try again in ~1 hour.`, 'error');
        } else if (fetchResult && fetchResult.success) {
            this.showToast(`Prices updated! ${fetchResult.fetched} new, ${fetchResult.cached} cached.`, 'success');
        }
    }

    getTcgPlayerUrl(cardName, setName) {
        // TCGPlayer uses slugified set names in URLs
        // e.g. "Base Set" -> "base-set", "EX Ruby & Sapphire" -> "ex-ruby-sapphire"
        const setSlug = setName
            .toLowerCase()
            .replace(/[&]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        // Clean card name for search (remove brackets, edition markers)
        const cleanName = cardName
            .replace(/\[.*?\]/g, '')
            .replace(/\(.*?\)/g, '')
            .trim();

        return `https://www.tcgplayer.com/search/pokemon/${setSlug}?q=${encodeURIComponent(cleanName)}&view=grid&productLineName=pokemon`;
    }

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // =============================================
    // API EXPLORER
    // =============================================
    async fetchApiSets() {
        const status = document.getElementById('api-explorer-status');
        const container = document.getElementById('api-explorer-sets');
        const btn = document.getElementById('api-explorer-fetch');
        
        btn.disabled = true;
        status.textContent = '⏳ Fetching sets from pokemontcg.io...';
        container.innerHTML = '';
        
        try {
            let allSets = [];
            let page = 1;
            while (true) {
                const resp = await fetch(`https://api.pokemontcg.io/v2/sets?page=${page}&pageSize=250`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                allSets = allSets.concat(data.data || []);
                status.textContent = `⏳ Fetched ${allSets.length}/${data.totalCount} sets...`;
                if (allSets.length >= data.totalCount) break;
                page++;
            }
            // Sort by release date descending (newest first)
            allSets.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
            this._apiSetsCache = allSets;
            this._apiSetsFiltered = allSets;
            status.textContent = `✅ ${allSets.length} sets loaded`;
            this.renderApiSets(allSets);
        } catch (e) {
            status.textContent = `❌ Error: ${e.message}`;
            console.error('API Explorer fetch error:', e);
        } finally {
            btn.disabled = false;
        }
    }

    renderApiSets(sets) {
        const container = document.getElementById('api-explorer-sets');
        // Hide the detail panel, show sets grid
        document.getElementById('api-set-detail').style.display = 'none';
        document.getElementById('api-explorer-controls').style.display = 'flex';
        
        if (!sets || sets.length === 0) {
            container.innerHTML = '<p style="color:var(--text-secondary)">No sets found.</p>';
            return;
        }
        
        container.innerHTML = sets.map(s => `
            <div class="api-set-card" data-api-set-id="${s.id}">
                <img class="api-set-logo" src="${s.images?.symbol || ''}" alt="" onerror="this.style.display='none'">
                <div class="api-set-meta">
                    <h3 title="${this.escapeHtml(s.name)}">${this.escapeHtml(s.name)}</h3>
                    <p class="api-set-series">${this.escapeHtml(s.series || '')}</p>
                    <div class="api-set-stats">
                        <span>📅 ${s.releaseDate || 'N/A'}</span>
                        <span>🃏 ${s.total || s.printedTotal || '?'} cards</span>
                        <span>ID: ${s.id}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Attach click handlers
        container.querySelectorAll('.api-set-card').forEach(card => {
            card.addEventListener('click', () => {
                const setId = card.dataset.apiSetId;
                const apiSet = this._apiSetsCache.find(s => s.id === setId);
                if (apiSet) this.showApiSetDetail(apiSet);
            });
        });
    }

    filterApiSets(query) {
        if (!this._apiSetsCache) return;
        const q = query.toLowerCase().trim();
        if (!q) {
            this._apiSetsFiltered = this._apiSetsCache;
        } else {
            this._apiSetsFiltered = this._apiSetsCache.filter(s => 
                s.name.toLowerCase().includes(q) ||
                (s.series || '').toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q)
            );
        }
        this.renderApiSets(this._apiSetsFiltered);
        const status = document.getElementById('api-explorer-status');
        status.textContent = q 
            ? `Showing ${this._apiSetsFiltered.length} of ${this._apiSetsCache.length} sets`
            : `✅ ${this._apiSetsCache.length} sets loaded`;
    }

    showApiSets() {
        document.getElementById('api-set-detail').style.display = 'none';
        document.getElementById('api-explorer-sets').style.display = '';
        document.getElementById('api-explorer-controls').style.display = 'flex';
    }

    async showApiSetDetail(apiSet) {
        // Hide sets grid, show detail panel
        document.getElementById('api-explorer-sets').style.display = 'none';
        document.getElementById('api-explorer-controls').style.display = 'none';
        const detail = document.getElementById('api-set-detail');
        detail.style.display = 'block';
        
        // Store current API set for add button
        this._currentApiSet = apiSet;
        
        // Check if set already exists in collection
        const existsInCollection = this.store.findSetById(apiSet.id);
        
        // Render header
        const header = document.getElementById('api-set-header');
        header.innerHTML = `
            <img class="api-detail-logo" src="${apiSet.images?.logo || apiSet.images?.symbol || ''}" alt="" onerror="this.src='${apiSet.images?.symbol || ''}'">
            <div class="api-detail-info">
                <h2>${this.escapeHtml(apiSet.name)}</h2>
                <div class="api-detail-stats">
                    <span>📅 Released: ${apiSet.releaseDate || 'N/A'}</span>
                    <span>🃏 ${apiSet.printedTotal || '?'} printed / ${apiSet.total || '?'} total</span>
                    <span>📦 Series: ${this.escapeHtml(apiSet.series || 'N/A')}</span>
                    <span>🆔 ID: ${apiSet.id}</span>
                    ${apiSet.ptcgoCode ? `<span>PTCGO: ${apiSet.ptcgoCode}</span>` : ''}
                    ${apiSet.legalities ? `<span>⚖️ ${Object.entries(apiSet.legalities).map(([k,v]) => k + ': ' + v).join(', ')}</span>` : ''}
                </div>
                <div style="margin-top:12px">
                    ${existsInCollection 
                        ? `<span style="color:var(--accent-green, #4CAF50);font-size:13px">✅ Already in collection (${existsInCollection.gen.name})</span>`
                        : `<button id="btn-add-api-set" class="primary-btn" style="font-size:13px;padding:8px 16px">➕ Add Set to Collection</button>`
                    }
                </div>
            </div>
        `;
        
        // Bind the add button if it exists
        const addBtn = document.getElementById('btn-add-api-set');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddSetPicker());
        }
        
        // Fetch cards
        const cardsStatus = document.getElementById('api-set-cards-status');
        const tbody = document.getElementById('api-set-cards-body');
        tbody.innerHTML = '';
        cardsStatus.textContent = '⏳ Fetching cards...';
        
        try {
            let allCards = [];
            let page = 1;
            while (true) {
                const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${apiSet.id}&page=${page}&pageSize=250`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                allCards = allCards.concat(data.data || []);
                cardsStatus.textContent = `⏳ Fetched ${allCards.length}/${data.totalCount || '?'} cards...`;
                if (allCards.length >= (data.totalCount || 0)) break;
                page++;
            }
            
            // Sort by card number
            allCards.sort((a, b) => {
                const na = parseInt(a.number) || 0;
                const nb = parseInt(b.number) || 0;
                return na - nb || a.number.localeCompare(b.number);
            });
            
            cardsStatus.textContent = `✅ ${allCards.length} cards loaded`;
            
            tbody.innerHTML = allCards.map(c => `
                <tr>
                    <td><img class="api-card-thumb" src="${c.images?.small || ''}" alt="" loading="lazy" onerror="this.style.display='none'"></td>
                    <td>${this.escapeHtml(c.number || '')}</td>
                    <td><strong>${this.escapeHtml(c.name || '')}</strong></td>
                    <td>${this.escapeHtml(c.supertype || '')}</td>
                    <td>${(c.types || []).join(', ')}</td>
                    <td>${(c.subtypes || []).join(', ')}</td>
                    <td>${this.escapeHtml(c.rarity || '—')}</td>
                    <td>${this.escapeHtml(c.artist || '—')}</td>
                    <td>${c.hp || '—'}</td>
                </tr>
            `).join('');
        } catch (e) {
            cardsStatus.textContent = `❌ Error: ${e.message}`;
            console.error('API card fetch error:', e);
        }
    }

    showAddSetPicker() {
        const apiSet = this._currentApiSet;
        if (!apiSet) return;
        
        // Build generation picker modal
        const gens = this.store.getGenerations();
        const overlay = document.createElement('div');
        overlay.id = 'api-add-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
        
        overlay.innerHTML = `
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:24px;max-width:480px;width:90%;max-height:80vh;overflow-y:auto">
                <h3 style="color:var(--text-primary);margin:0 0 8px 0;font-size:18px">➕ Add "${this.escapeHtml(apiSet.name)}" to Collection</h3>
                <p style="color:var(--text-secondary);font-size:13px;margin:0 0 16px 0">Select which generation to add this set to:</p>
                <div id="gen-picker-list" style="display:flex;flex-direction:column;gap:8px">
                    ${gens.map(g => `
                        <button class="gen-pick-btn" data-gen-id="${g.id}" style="
                            text-align:left;padding:12px 16px;background:rgba(255,255,255,0.04);
                            border:1px solid var(--border-color);border-radius:10px;color:var(--text-primary);
                            font-size:14px;cursor:pointer;transition:all 0.15s ease;
                            display:flex;justify-content:space-between;align-items:center
                        ">
                            <span>${this.escapeHtml(g.name)}</span>
                            <span style="color:var(--text-secondary);font-size:12px">${g.sets.length} sets</span>
                        </button>
                    `).join('')}
                </div>
                <button id="gen-pick-cancel" style="margin-top:16px;padding:8px 20px;background:transparent;border:1px solid var(--border-color);border-radius:8px;color:var(--text-secondary);cursor:pointer;font-size:13px">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Hover effects
        overlay.querySelectorAll('.gen-pick-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => { btn.style.borderColor = 'var(--accent-primary)'; btn.style.background = 'rgba(255,255,255,0.08)'; });
            btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'var(--border-color)'; btn.style.background = 'rgba(255,255,255,0.04)'; });
            btn.addEventListener('click', () => {
                const genId = btn.dataset.genId;
                overlay.remove();
                this.addApiSetToCollection(apiSet, genId);
            });
        });
        
        // Cancel
        document.getElementById('gen-pick-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    async addApiSetToCollection(apiSet, genId) {
        const gen = this.store.data.generations.find(g => g.id === genId);
        if (!gen) return;
        
        // Check for duplicate
        if (gen.sets.find(s => s.id === apiSet.id)) {
            alert(`"${apiSet.name}" already exists in ${gen.name}!`);
            return;
        }
        
        const cardsStatus = document.getElementById('api-set-cards-status');
        const addBtn = document.getElementById('btn-add-api-set');
        if (addBtn) { addBtn.disabled = true; addBtn.textContent = '⏳ Adding...'; }
        
        try {
            // Fetch cards if not already loaded in the table
            let allCards = [];
            let page = 1;
            if (cardsStatus) cardsStatus.textContent = '⏳ Fetching cards for import...';
            while (true) {
                const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${apiSet.id}&page=${page}&pageSize=250`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                allCards = allCards.concat(data.data || []);
                if (allCards.length >= (data.totalCount || 0)) break;
                page++;
            }
            
            // Sort by card number
            allCards.sort((a, b) => {
                const na = parseInt(a.number) || 0;
                const nb = parseInt(b.number) || 0;
                return na - nb || a.number.localeCompare(b.number);
            });
            
            // Convert API cards to collection format
            const collectionCards = allCards.map(c => ({
                number: c.number || '',
                name: c.name || '',
                type: (c.types || []).join('/') || c.supertype || '',
                status: 'NEED',
                stock: 0,
                quantities: {
                    normal: 0,
                    holofoil: 0,
                    reverseHolofoil: 0,
                    firstEdition: 0,
                    unlimited: 0
                },
                rarity: c.rarity || '',
                note: '',
                condition: ''
            }));
            
            // Build the set object
            const newSet = {
                id: apiSet.id,
                name: apiSet.name,
                sheetName: apiSet.name,
                releaseDate: (apiSet.releaseDate || '').replace(/\//g, '-'),
                cards: collectionCards
            };
            
            // Insert in release date order
            const newDate = newSet.releaseDate || 'zzzz';
            let inserted = false;
            for (let i = 0; i < gen.sets.length; i++) {
                const s = gen.sets[i];
                const isPromo = s.name.toLowerCase().includes('promo');
                const sDate = s.releaseDate || 'zzzz';
                if (!isPromo && sDate > newDate) {
                    gen.sets.splice(i, 0, newSet);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) gen.sets.push(newSet);
            
            // Also register the symbol if the API provides one
            if (apiSet.images?.symbol && typeof SET_SYMBOLS !== 'undefined') {
                SET_SYMBOLS[apiSet.name] = apiSet.images.symbol;
            }
            
            // Persist the newly added set so it survives page reloads
            this.store.saveAddedSet(genId, newSet);
            this.store.save();
            
            if (cardsStatus) cardsStatus.textContent = `✅ Added "${apiSet.name}" to ${gen.name} with ${collectionCards.length} cards!`;
            
            // Update the add button area to show success
            if (addBtn) {
                addBtn.outerHTML = `<span style="color:var(--accent-green, #4CAF50);font-size:13px">✅ Added to ${this.escapeHtml(gen.name)}</span>`;
            }
            
        } catch (e) {
            console.error('Error adding set:', e);
            if (cardsStatus) cardsStatus.textContent = `❌ Error adding set: ${e.message}`;
            if (addBtn) { addBtn.disabled = false; addBtn.textContent = '➕ Add Set to Collection'; }
        }
    }
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
