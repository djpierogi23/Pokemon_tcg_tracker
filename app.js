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
// JUSTTCG SERVICE (justtcg.com API)
// =============================================
class JustTCGService {
    constructor() {
        this.apiKey = localStorage.getItem('justtcg_api_key') || '';
        this.baseUrl = 'https://api.justtcg.com/v1';
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('justtcg_api_key', key);
    }

    getApiKey() {
        return this.apiKey;
    }

    // Map our internal set names to JustTCG slug format
    slugifySetName(setName) {
        // Override map for non-obvious slugs
        const SLUG_MAP = {
            'Base Set (1st Edition)': 'base-set',
            'Base Set (Unlimited)': 'base-set',
            'Base Set (Shadowless)': 'base-set',
            'Expansion Pack': 'base-set',
            'Gold, Silver, to a New World...': 'neo-genesis',
            'Challenge from the Darkness': 'neo-discovery',
            'Pokémon VS': 'pokemon-vs',
            'EX Ruby & Sapphire': 'ruby-sapphire',
            'EX Sandstorm': 'sandstorm',
            'EX Dragon': 'dragon',
            'EX Hidden Legends': 'hidden-legends',
            'EX FireRed & LeafGreen': 'firered-leafgreen',
            'EX Team Rocket Returns': 'team-rocket-returns',
            'EX Deoxys': 'deoxys',
            'EX Emerald': 'emerald',
            'EX Unseen Forces': 'unseen-forces',
            'EX Delta Species': 'delta-species',
            'EX Legend Maker': 'legend-maker',
            'EX Holon Phantoms': 'holon-phantoms',
            'EX Crystal Guardians': 'crystal-guardians',
            'EX Dragon Frontiers': 'dragon-frontiers',
            'EX Power Keepers': 'power-keepers',
            'EX Team Magma vs Team Aqua': 'team-magma-vs-team-aqua',
            'Diamond & Pearl': 'diamond-pearl',
            'HeartGold and SoulSilver': 'heartgold-soulsilver',
            'Golden Sky, Silvery Ocean': 'heartgold-soulsilver',
            'X and Y': 'xy',
            'Sun and Moon': 'sun-moon',
            'Sword and Shield': 'sword-shield',
            'Scarlet & Violet': 'scarlet-violet',
            '151': '151',
            'SV2a: Pokemon Card 151': '151',
            'SV5K: Wild Force': 'wild-force',
            'SV5M: Cyber Judge': 'cyber-judge',
            'SV8a: Terastal Fest ex': 'terastal-fest-ex',
            'Prismatic Evolution': 'prismatic-evolutions',
        };

        if (SLUG_MAP[setName]) return SLUG_MAP[setName];

        // Strip parenthetical qualifiers, then slugify
        return setName
            .replace(/\s*\(.*?\)\s*/g, '')
            .replace(/^EX\s+/i, '')
            .toLowerCase()
            .replace(/[&]/g, 'and')
            .replace(/['']/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .trim();
    }

    // Map JustTCG condition names to our condition keys
    static CONDITION_MAP = {
        'Near Mint': 'NM',
        'Lightly Played': 'LP',
        'Moderately Played': 'MP',
        'Heavily Played': 'HP',
        'Damaged': 'DMG',
    };

    // Map JustTCG printing names to our variant names
    static PRINTING_MAP = {
        'Normal': 'Normal',
        'Holo': 'Holofoil',
        'Foil': 'Holofoil',
        'Reverse Holo': 'Reverse Holofoil',
        '1st Edition': '1st Edition',
        '1st Edition Holo': '1st Edition Holofoil',
        '1st Edition Holofoil': '1st Edition Holofoil',
        '1st Edition Normal': '1st Edition',
        'Shadowless': 'Shadowless',
        'Shadowless Holo': 'Shadowless Holofoil',
        'Shadowless Holofoil': 'Shadowless Holofoil',
    };

    // Map edition to allowed JustTCG printing names
    static EDITION_PRINTINGS = {
        '1st': ['1st Edition', '1st Edition Holo', '1st Edition Holofoil', '1st Edition Normal'],
        'shadowless': ['Shadowless', 'Shadowless Holo', 'Shadowless Holofoil'],
        'unlimited': ['Normal', 'Holo', 'Foil', 'Reverse Holo'],
    };

    // Fetch prices for a single card by set + number
    async fetchCardPrice(setName, cardNumber) {
        if (!this.apiKey) return null;

        const setSlug = this.slugifySetName(setName);
        const url = `${this.baseUrl}/cards?game=Pokemon&set=${encodeURIComponent(setSlug)}&number=${encodeURIComponent(cardNumber)}&include_price_history=false&include_statistics=false&include_null_prices=false`;

        try {
            const resp = await fetch(url, {
                headers: { 'x-api-key': this.apiKey },
            });

            if (resp.status === 429) {
                console.warn('[JustTCG] Rate limited');
                return { rateLimited: true };
            }
            if (resp.status === 401) {
                console.warn('[JustTCG] Invalid API key');
                return { invalidKey: true };
            }
            if (!resp.ok) {
                console.warn(`[JustTCG] HTTP ${resp.status}`);
                return null;
            }

            const data = await resp.json();
            const cards = data.data || [];
            if (cards.length === 0) return null;

            return this.extractPriceInfo(cards[0]);
        } catch (e) {
            console.warn('[JustTCG] Fetch error:', e);
            return null;
        }
    }

    // Batch fetch prices for multiple cards
    async batchFetchPrices(setName, cardNumbers, edition) {
        if (!this.apiKey || cardNumbers.length === 0) return {};

        const setSlug = this.slugifySetName(setName);
        const results = {};

        // Fetch by set name with pagination (more efficient than individual lookups)
        try {
            let offset = 0;
            const limit = 20; // Free tier limit
            let hasMore = true;

            while (hasMore) {
                const url = `${this.baseUrl}/cards?game=Pokemon&set=${encodeURIComponent(setSlug)}&limit=${limit}&offset=${offset}&include_price_history=false&include_statistics=true&include_null_prices=false`;

                console.log(`[JustTCG] Batch fetch: set=${setSlug}, offset=${offset}`);
                const resp = await fetch(url, {
                    headers: { 'x-api-key': this.apiKey },
                });

                if (resp.status === 429) {
                    console.warn('[JustTCG] Rate limited during batch');
                    break;
                }
                if (!resp.ok) break;

                const data = await resp.json();
                const cards = data.data || [];

                for (const card of cards) {
                    if (card.number && cardNumbers.includes(card.number)) {
                        results[card.number] = this.extractPriceInfo(card, edition);
                    }
                }

                hasMore = data.pagination?.hasMore || false;
                offset += limit;

                // Check remaining quota
                const remaining = data.usage?.apiDailyRequestsRemaining;
                if (remaining !== undefined && remaining < 5) {
                    console.warn(`[JustTCG] Low quota: ${remaining} daily requests remaining`);
                    break;
                }
            }
        } catch (e) {
            console.warn('[JustTCG] Batch fetch error:', e);
        }

        console.log(`[JustTCG] Batch: got prices for ${Object.keys(results).length} / ${cardNumbers.length} cards`);
        return results;
    }

    // Extract condition-specific pricing from JustTCG card data
    // edition: '1st', 'shadowless', 'unlimited', or null (use all)
    extractPriceInfo(card, edition) {
        const conditionPrices = {};  // { "Holofoil": { "NM": 12.50, "LP": 10.80, ... }, ... }
        const priceChanges = {};
        let bestMarket = null;
        let bestLow = null;

        if (!card.variants || !Array.isArray(card.variants)) {
            return null;
        }

        // Filter variants by edition if specified
        const allowedPrintings = edition ? JustTCGService.EDITION_PRINTINGS[edition] : null;

        for (const variant of card.variants) {
            if (variant.price === null || variant.price === undefined) continue;

            // Skip variants that don't match the requested edition
            if (allowedPrintings && variant.printing && !allowedPrintings.includes(variant.printing)) {
                continue;
            }

            const printing = JustTCGService.PRINTING_MAP[variant.printing] || variant.printing || 'Normal';
            const condition = JustTCGService.CONDITION_MAP[variant.condition] || 'NM';

            if (!conditionPrices[printing]) {
                conditionPrices[printing] = {};
            }
            conditionPrices[printing][condition] = variant.price;

            // Track best NM price as primary market price
            if (condition === 'NM' && (bestMarket === null || variant.price > bestMarket)) {
                bestMarket = variant.price;
                // Capture price changes from the first NM variant
                if (variant.priceChange24hr !== undefined) priceChanges['24h'] = variant.priceChange24hr;
                if (variant.priceChange7d !== undefined) priceChanges['7d'] = variant.priceChange7d;
                if (variant.priceChange30d !== undefined) priceChanges['30d'] = variant.priceChange30d;
            }

            // Track lowest price across all conditions
            if (bestLow === null || variant.price < bestLow) {
                bestLow = variant.price;
            }
        }

        if (Object.keys(conditionPrices).length === 0) return null;

        // Also build variantPrices in the format our existing code expects
        const variantPrices = {};
        for (const [printing, conditions] of Object.entries(conditionPrices)) {
            if (conditions['NM'] !== undefined) {
                variantPrices[printing] = { market: conditions['NM'], low: conditions['DMG'] || conditions['HP'] || null };
            }
        }

        return {
            market: bestMarket,
            low: bestLow,
            variantPrices,
            conditionPrices,
            priceChanges: Object.keys(priceChanges).length > 0 ? priceChanges : null,
            tcgplayerUrl: null,  // JustTCG doesn't provide TCGPlayer URLs
            source: 'justtcg',
            fetchedAt: Date.now(),
        };
    }
}

// =============================================
// PRICE SERVICE
// =============================================
class PriceService {
    constructor() {
        this.apiKey = localStorage.getItem('justtcg_api_key') || '';
        this.justTCG = new JustTCGService();
        this.cache = {};
        this.loadCache();
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('justtcg_api_key', key);
        this.justTCG.setApiKey(key);
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

    // Extract price from pokemontcg.io card data (Phase 1 bulk fetch format)
    extractPrice(cardData, edition) {
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
                // Full nameMap of all known subtypes
                const allSubtypes = {
                    normal: 'Normal', holofoil: 'Holofoil',
                    reverseHolofoil: 'Reverse Holofoil',
                    '1stEditionHolofoil': '1st Edition Holo',
                    '1stEditionNormal': '1st Edition',
                };

                // Determine priority order based on edition
                let priorityKeys;
                if (edition === '1st') {
                    // 1st Edition: prioritize 1st Ed subtypes
                    priorityKeys = ['1stEditionHolofoil', '1stEditionNormal', 'holofoil', 'normal', 'reverseHolofoil'];
                } else if (edition === 'unlimited' || edition === 'shadowless') {
                    // Unlimited/Shadowless: prioritize non-1st-edition subtypes
                    priorityKeys = ['holofoil', 'normal', 'reverseHolofoil', '1stEditionHolofoil', '1stEditionNormal'];
                } else {
                    // Default: normal -> holofoil -> reverse -> 1st edition
                    priorityKeys = ['normal', 'holofoil', 'reverseHolofoil', '1stEditionHolofoil', '1stEditionNormal'];
                }

                for (const key of priorityKeys) {
                    if (prices[key]) {
                        const label = allSubtypes[key] || key;
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
        let fetched = 0;
        let cached = 0;
        const haveCards = set.cards.filter(c => c.status === 'HAVE');
        const total = haveCards.length;

        if (total === 0) return { success: true, fetched: 0, cached: 0, total: set.cards.length };

        // Invalidate stale cache for edition sets (old cache had wrong prices from pokemontcg.io)
        if (set.edition) {
            for (const card of haveCards) {
                const cacheKey = this.getCacheKey(card.name, set.name, card.number);
                if (this.cache[cacheKey] && !this.cache[cacheKey].editionFiltered) {
                    delete this.cache[cacheKey];
                }
            }
        }

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
        // Card numbers in our collection may be "1/64" format while API returns "1"
        const normalizeNumber = (n) => (n || '').split('/')[0].trim();

        // Skip Phase 1 for 1st Edition and Shadowless — pokemontcg.io only has Unlimited pricing
        // But only skip if JustTCG API key is available (otherwise use pokemontcg.io as fallback)
        const skipPhase1 = this.apiKey && set.edition && (set.edition === '1st' || set.edition === 'shadowless');

        if (set.id && !skipPhase1) {
            try {
                if (onProgress) onProgress(0, uncachedCards.length, 'Bulk fetching prices...');
                const bulkHits = await this.bulkFetchPrices(set);
                // Cache all hits
                for (const card of uncachedCards) {
                    const cacheKey = this.getCacheKey(card.name, set.name, card.number);
                    const apiNumber = normalizeNumber(card.number);
                    if (bulkHits[apiNumber] || bulkHits[card.number]) {
                        this.cache[cacheKey] = bulkHits[apiNumber] || bulkHits[card.number];
                        if (set.edition) this.cache[cacheKey].editionFiltered = true;
                        fetched++;
                    }
                }
                this.saveCache();
                if (onProgress) onProgress(fetched, uncachedCards.length, null);
            } catch (e) {
                console.warn('[PriceFetch] Bulk fetch failed, will try JustTCG:', e);
            }
        }

        // PHASE 2: JustTCG batch lookup for remaining misses + condition price enrichment
        const stillMissing = uncachedCards.filter(c => !this.cache[this.getCacheKey(c.name, set.name, c.number)]);

        if (this.apiKey && (stillMissing.length > 0 || fetched > 0)) {
            const cardNumbers = stillMissing.length > 0
                ? stillMissing.map(c => c.number)
                : uncachedCards.map(c => c.number);

            try {
                if (onProgress) onProgress(fetched + cached, total, 'Fetching condition prices...');
                const justTCGResults = await this.justTCG.batchFetchPrices(set.name, cardNumbers, set.edition || null);

                for (const card of (stillMissing.length > 0 ? stillMissing : uncachedCards)) {
                    const cacheKey = this.getCacheKey(card.name, set.name, card.number);
                    const jtcgResult = justTCGResults[card.number];

                    if (jtcgResult) {
                        if (this.cache[cacheKey]) {
                            // Enrich existing Phase 1 data with JustTCG condition prices
                            this.cache[cacheKey].conditionPrices = jtcgResult.conditionPrices;
                            this.cache[cacheKey].priceChanges = jtcgResult.priceChanges;
                            this.cache[cacheKey].source = 'pokemontcg+justtcg';
                            if (set.edition) this.cache[cacheKey].editionFiltered = true;
                        } else {
                            // Use JustTCG as the sole price source for this card
                            this.cache[cacheKey] = jtcgResult;
                            if (set.edition) this.cache[cacheKey].editionFiltered = true;
                            fetched++;
                        }
                    }
                }

                if (onProgress) onProgress(fetched + cached, total, null);
            } catch (e) {
                console.warn('[PriceFetch] JustTCG batch failed:', e);
            }
        } else if (stillMissing.length > 0) {
            console.log(`[PriceFetch] ${stillMissing.length} cards missing but no JustTCG API key configured`);
        }

        this.saveCache();
        return { success: true, fetched, cached, total: set.cards.length };
    }

    async bulkFetchPrices(set) {
        // Fetch ALL cards for this set from pokemontcg.io in one paginated request
        // Returns a map of cardNumber -> priceInfo
        const priceMap = {};
        let page = 1;
        const edition = set.edition || null;
        const apiSetId = set.apiSetId || set.id;
        while (true) {
            const url = `https://api.pokemontcg.io/v2/cards?q=set.id:${apiSetId}&pageSize=250&page=${page}&select=name,number,tcgplayer,images`;
            console.log(`[PriceFetch] Bulk fetch: ${url}` + (edition ? ` (edition: ${edition})` : ''));
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            for (const card of (data.data || [])) {
                if (card.tcgplayer && card.tcgplayer.prices) {
                    const priceInfo = this.extractPrice(card, edition);
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
        this.deletedSets = []; // Sets deleted by user, persisted separately
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

        // Remove any previously deleted sets
        const savedDeleted = localStorage.getItem('pokemon_tcg_deleted_sets');
        if (savedDeleted && this.data) {
            try {
                this.deletedSets = JSON.parse(savedDeleted);
                for (const del of this.deletedSets) {
                    const gen = this.data.generations.find(g => g.id === del.genId);
                    if (gen) {
                        const idx = gen.sets.findIndex(s => s.id === del.setId);
                        if (idx !== -1) gen.sets.splice(idx, 1);
                    }
                    // Also remove from addedSets
                    const addedIdx = this.addedSets.findIndex(e => e.set.id === del.setId && e.genId === del.genId);
                    if (addedIdx !== -1) this.addedSets.splice(addedIdx, 1);
                }
                if (this.deletedSets.length > 0) console.log('Removed ' + this.deletedSets.length + ' deleted sets');
            } catch (e) {
                console.warn('Failed to parse deleted sets:', e);
                this.deletedSets = [];
            }
        }

        // Apply any saved user changes on top
        const savedChanges = localStorage.getItem('pokemon_tcg_changes');
        if (savedChanges) {
            try {
                this.changes = JSON.parse(savedChanges);
                // Migrate old set IDs if needed
                const migrated = this.migrateSetIds();
                this.applyChanges();
                console.log('Applied ' + Object.keys(this.changes).length + ' saved changes' + (migrated > 0 ? ` (migrated ${migrated} keys)` : ''));
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

    // Migrate old slug-style set IDs to pokemontcg.io API IDs
    // Change keys are formatted as: genId/setId/cardIndex/field
    migrateSetIds() {
        const OLD_TO_NEW = {
            "151": "sv3pt5", "ancient-origins": "xy7", "aquapolis": "ecard2",
            "arceus": "pl4", "astral-radiance": "swsh10", "base-set": "base1",
            "base-set-1st-edition": "base1", "base-set-2": "base4",
            "base-set-shadowless": "base1", "base-set-unlimited": "base1",
            "battle-styles": "swsh5", "black-and-white": "bw1",
            "black-bolt": "zsv10pt5", "boundaries-crossed": "bw7",
            "breakpoint": "xy9", "breakthrough": "xy8",
            "brilliant-stars": "swsh9", "burning-shadows": "sm3",
            "call-of-legends": "col1", "celebrations": "cel25",
            "celestial-storm": "sm7", "champions-path": "swsh35",
            "chilling-reign": "swsh6", "cosmic-eclipse": "sm12",
            "crimson-invasion": "sm4", "dark-explorers": "bw5",
            "darkness-ablaze": "swsh3", "destined-rivals": "sv10",
            "detective-pikachu": "det1", "diamond-pearl": "dp1",
            "dp-black-star-promos": "dpp", "dragon-majesty": "sm75",
            "dragons-exalted": "bw6", "emerging-powers": "bw2",
            "evolutions": "xy12", "evolving-skies": "swsh7",
            "ex-crystal-guardians": "ex14", "ex-delta-species": "ex11",
            "ex-deoxys": "ex8", "ex-dragon": "ex3",
            "ex-dragon-frontiers": "ex15", "ex-emerald": "ex9",
            "ex-firered-leafgreen": "ex6", "ex-hidden-legends": "ex5",
            "ex-holon-phantoms": "ex13", "ex-legend-maker": "ex12",
            "ex-power-keepers": "ex16", "ex-ruby-sapphire": "ex1",
            "ex-sandstorm": "ex2", "ex-team-magma-vs-team-aqua": "ex4",
            "ex-team-rocket-returns": "ex7", "ex-unseen-forces": "ex10",
            "expedition-base-set": "ecard1", "fates-collide": "xy10",
            "flashfire": "xy2", "forbidden-light": "sm6",
            "fossil": "base3", "furious-fists": "xy3",
            "fusion-strike": "swsh8", "generations": "g1",
            "great-encounters": "dp4", "guardians-rising": "sm2",
            "gym-challenge": "gym2", "gym-heroes": "gym1",
            "heartgold-and-soulsilver": "hgss1", "heartgold-soulsilver": "hgss1",
            "hidden-fates": "sm115", "journey-together": "sv9",
            "jungle": "base2", "kalos-starter-set": "xy0",
            "legendary-collection": "base6", "legendary-treasures": "bw11",
            "legends-awakened": "dp6", "lost-origin": "swsh11",
            "lost-thunder": "sm8", "majestic-dawn": "dp5",
            "mysterious-treasures": "dp2", "neo-destiny": "neo4",
            "neo-discovery": "neo2", "neo-genesis": "neo1",
            "neo-revelation": "neo3", "next-destinies": "bw4",
            "nintendo-black-star-promos": "np", "noble-victories": "bw3",
            "obsidian-flames": "sv3", "paldea-evolved": "sv2",
            "paldean-fates": "sv4pt5", "paradox-rift": "sv4",
            "phantom-forces": "xy4", "plasma-blast": "bw10",
            "plasma-freeze": "bw9", "plasma-storm": "bw8",
            "platinum": "pl1", "primal-clash": "xy5",
            "rebel-clash": "swsh2", "rising-rivals": "pl2",
            "roaring-skies": "xy6", "scarlet-violet": "sv1",
            "secret-wonders": "dp3", "shining-fates": "swsh45",
            "shining-legends": "sm35", "shrouded-fable": "sv6pt5",
            "silver-tempest": "swsh12", "skyridge": "ecard3",
            "southern-islands": "si1", "steam-siege": "xy11",
            "stellar-crown": "sv7", "stormfront": "dp7",
            "supreme-victors": "pl3", "surging-sparks": "sv8",
            "team-rocket": "base5", "team-up": "sm9",
            "temporal-forces": "sv5", "twilight-masquerade": "sv6",
            "ultra-prism": "sm5", "unbroken-bonds": "sm10",
            "unified-minds": "sm11", "vivid-voltage": "swsh4",
            "white-flare": "rsv10pt5", "wizards-black-star-promos": "basep",
            "hgss-promos": "hsp",
        };

        if (localStorage.getItem('set_ids_migrated_v2')) return 0;

        let migrated = 0;
        const newChanges = {};
        for (const key in this.changes) {
            const parts = key.split('/');
            if (parts.length >= 4) {
                const setId = parts[1];
                if (OLD_TO_NEW[setId]) {
                    parts[1] = OLD_TO_NEW[setId];
                    const newKey = parts.join('/');
                    newChanges[newKey] = this.changes[key];
                    migrated++;
                } else {
                    newChanges[key] = this.changes[key];
                }
            } else {
                newChanges[key] = this.changes[key];
            }
        }

        if (migrated > 0) {
            this.changes = newChanges;
            this.save();
            console.log(`[Migration] Remapped ${migrated} change keys from old set IDs to new API IDs`);
        }

        localStorage.setItem('set_ids_migrated_v2', 'true');

        // V3 migration: split base1 keys into variant-specific IDs
        if (!localStorage.getItem('set_ids_migrated_v3')) {
            const variantIds = ['base1-1st', 'base1-shadowless', 'base1-unlimited'];
            let splitCount = 0;
            const splitChanges = {};
            for (const key in this.changes) {
                const parts = key.split('/');
                if (parts.length >= 4 && parts[1] === 'base1') {
                    // Duplicate to all 3 variants (can't determine which one it belongs to)
                    for (const vid of variantIds) {
                        const newParts = [...parts];
                        newParts[1] = vid;
                        splitChanges[newParts.join('/')] = this.changes[key];
                    }
                    splitCount++;
                } else {
                    splitChanges[key] = this.changes[key];
                }
            }
            if (splitCount > 0) {
                this.changes = splitChanges;
                this.save();
                migrated += splitCount;
                console.log(`[Migration V3] Split ${splitCount} base1 keys into 3 variant sets`);
            }
            localStorage.setItem('set_ids_migrated_v3', 'true');
        }

        return migrated;
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

    deleteSet(genId, setId) {
        const gen = this.data?.generations?.find(g => g.id === genId);
        if (!gen) return false;
        const idx = gen.sets.findIndex(s => s.id === setId);
        if (idx === -1) return false;
        
        // Remove from generation
        gen.sets.splice(idx, 1);
        
        // Clean up changes for this set
        const prefix = genId + '/' + setId + '/';
        for (const key of Object.keys(this.changes)) {
            if (key.startsWith(prefix)) {
                delete this.changes[key];
            }
        }
        
        // Remove from addedSets if it was an API-added set
        const addedIdx = this.addedSets.findIndex(e => e.set.id === setId && e.genId === genId);
        if (addedIdx !== -1) {
            this.addedSets.splice(addedIdx, 1);
        }
        
        // Track deletion so it persists across reloads
        if (!this.deletedSets) this.deletedSets = [];
        this.deletedSets.push({ genId, setId });
        
        this.save();
        this.saveDeletedSets();
        return true;
    }

    deleteCard(genId, setId, cardIndex) {
        const set = this.getSet(genId, setId);
        if (!set || cardIndex < 0 || cardIndex >= set.cards.length) return false;
        
        // Remove the card
        set.cards.splice(cardIndex, 1);
        
        // Re-index changes: remove this card's changes, shift higher indices down
        const prefix = genId + '/' + setId + '/';
        const newChanges = {};
        for (const [key, value] of Object.entries(this.changes)) {
            if (!key.startsWith(prefix)) {
                newChanges[key] = value;
                continue;
            }
            const rest = key.substring(prefix.length);
            const slashPos = rest.indexOf('/');
            if (slashPos === -1) continue;
            const idx = parseInt(rest.substring(0, slashPos));
            const field = rest.substring(slashPos + 1);
            if (isNaN(idx)) continue;
            
            if (idx === cardIndex) {
                // Skip — this card was deleted
                continue;
            } else if (idx > cardIndex) {
                // Shift down by 1
                newChanges[prefix + (idx - 1) + '/' + field] = value;
            } else {
                newChanges[key] = value;
            }
        }
        this.changes = newChanges;
        
        // Update addedSets if this is an API-added set
        this.updateAddedSet(setId);
        
        this.save();
        return true;
    }

    saveDeletedSets() {
        try {
            localStorage.setItem('pokemon_tcg_deleted_sets', JSON.stringify(this.deletedSets || []));
        } catch(e) { console.warn('Failed to save deleted sets:', e); }
    }

    findSetById(setId) {
        for (const gen of this.getGenerations()) {
            const set = gen.sets.find(s => s.id === setId);
            if (set) return { gen, set };
        }
        return null;
    }

    findSetByName(name) {
        // Normalize: lowercase, strip punctuation, replace & with and, collapse whitespace
        const normalize = (s) => s.trim().toLowerCase()
            .replace(/[''\u2019]/g, '')      // remove apostrophes
            .replace(/&/g, ' and ')          // & -> and
            .replace(/[():\-–—]/g, ' ')      // remove parens, colons, dashes
            .replace(/\s+/g, ' ')            // collapse whitespace
            .trim();
        
        const target = normalize(name);
        
        // Pass 1: exact normalized match
        for (const gen of this.getGenerations()) {
            const set = gen.sets.find(s => normalize(s.name) === target);
            if (set) return { gen, set };
        }
        
        // Pass 2: one name contains the other (handles "Base Set" matching "Base Set (Unlimited)")
        for (const gen of this.getGenerations()) {
            const set = gen.sets.find(s => {
                const n = normalize(s.name);
                return n.includes(target) || target.includes(n);
            });
            if (set) return { gen, set };
        }
        
        // Pass 3: word-overlap scoring for tough cases (e.g. "McDonald's 25th Anniversary Promos" vs "McDonald's Collection 2021")
        // Extract the core identifying words, ignoring common filler
        const stopWords = new Set(['the','a','an','of','and','or','collection','promos','promo','black','star','set','base','trainer','kit']);
        const getKeyWords = (s) => normalize(s).split(' ').filter(w => w.length > 1 && !stopWords.has(w));
        
        const targetWords = getKeyWords(name);
        if (targetWords.length === 0) return null;
        
        let bestMatch = null;
        let bestScore = 0;
        
        for (const gen of this.getGenerations()) {
            for (const set of gen.sets) {
                const setWords = getKeyWords(set.name);
                if (setWords.length === 0) continue;
                
                // Count overlapping words
                const overlap = targetWords.filter(w => setWords.includes(w)).length;
                const score = overlap / Math.max(targetWords.length, setWords.length);
                
                if (score > bestScore && score >= 0.5) {
                    bestScore = score;
                    bestMatch = { gen, set };
                }
            }
        }
        
        return bestMatch;
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
        // Navigation — text-based nav links
        document.getElementById('nav-home').addEventListener('click', () => this.showView('dashboard'));
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const view = link.dataset.view;
                if (view) this.showView(view);
            });
        });
        document.getElementById('api-explorer-back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('api-explorer-fetch').addEventListener('click', () => this.fetchApiSets());
        document.getElementById('api-set-back').addEventListener('click', () => this.showApiSets());
        document.getElementById('api-explorer-search').addEventListener('input', (e) => this.filterApiSets(e.target.value));
        document.getElementById('api-explorer-lang').addEventListener('change', () => {
            this._apiSetsCache = null;
            this._apiSetsFiltered = null;
            this.fetchApiSets();
        });
        document.getElementById('back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('stats-back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('import-back-btn').addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('binder-back-btn').addEventListener('click', () => this.showView('dashboard'));

        // Binder search
        let binderSearchTimeout;
        document.getElementById('binder-search-input').addEventListener('input', (e) => {
            clearTimeout(binderSearchTimeout);
            const q = e.target.value.trim();
            if (q.length < 2) {
                document.getElementById('binder-search-results').innerHTML = '';
                document.getElementById('binder-search-status').textContent = '';
                return;
            }
            document.getElementById('binder-search-status').textContent = '⏳';
            binderSearchTimeout = setTimeout(() => this.searchBinderCards(q), 400);
        });

        // Binder add form
        document.getElementById('binder-add-btn').addEventListener('click', () => this.confirmAddToBinder());
        document.getElementById('binder-add-cancel').addEventListener('click', () => {
            document.getElementById('binder-add-form').style.display = 'none';
            this._binderSelectedCard = null;
            document.querySelectorAll('.binder-result-card.selected').forEach(c => c.classList.remove('selected'));
        });

        // Binder filter & sort
        document.getElementById('binder-filter').addEventListener('input', () => this.renderBinder());
        document.getElementById('binder-sort').addEventListener('change', () => this.renderBinder());

        // Delete set button
        document.getElementById('btn-delete-set').addEventListener('click', () => {
            const result = this.store.findSetById(this.currentSetId);
            if (!result) return;
            const setName = result.set.name;
            const cardCount = result.set.cards.length;
            if (confirm(`Delete "${setName}"?\n\nThis will remove the entire set (${cardCount} cards) from your collection.\n\nThis cannot be undone.`)) {
                this.store.deleteSet(this.currentGenId, this.currentSetId);
                this.showView('dashboard');
                this.renderDashboard();
                this.showToast(`Deleted "${setName}"`, 'success');
            }
        });

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

        // Update nav link active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.view === view);
        });

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
        } else if (view === 'binder') {
            document.getElementById('binder-view').classList.add('active');
            this.renderBinder();
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
            this.showToast('No JustTCG API key — fetching base prices only. Add your key in Settings for condition pricing.', 'info');
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
                    <td class="col-delete" style="text-align:center">
                        <button class="btn-delete-card" data-index="${index}" title="Delete card">×</button>
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

        // Bind delete card buttons
        tbody.querySelectorAll('.btn-delete-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const result = this.store.findSetById(this.currentSetId);
                if (!result) return;
                const card = result.set.cards[idx];
                if (!card) return;
                const name = card.name || `#${card.number}`;
                if (confirm(`Delete "${name}" from this set?\n\nThis cannot be undone.`)) {
                    this.store.deleteCard(this.currentGenId, this.currentSetId, idx);
                    this.renderSetHeader();
                    this.renderCardTable();
                    this.showToast(`Deleted "${name}"`, 'success');
                }
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

        // Collect all card data with prices
        const allSets = [];
        const allCards = [];
        const ownedCards = [];
        const pricedCards = [];
        const rarityMap = {};
        const typeMap = {};
        const conditionMap = {};
        let totalPaid = 0;
        let totalMarketValue = 0;
        let totalCards = 0;
        let totalOwned = 0;

        for (const gen of this.store.getGenerations()) {
            for (const set of gen.sets) {
                const totals = this.store.getSetTotals(set);
                let setValue = 0;
                for (const card of set.cards) {
                    totalCards++;
                    allCards.push({ card, set, gen });

                    // Rarity tracking (all cards)
                    const rarity = card.rarity || 'Unknown';
                    rarityMap[rarity] = (rarityMap[rarity] || 0) + 1;

                    if (card.status === 'HAVE') {
                        totalOwned++;
                        ownedCards.push({ card, set, gen });

                        // Type tracking (owned)
                        const type = card.type || 'Unknown';
                        typeMap[type] = (typeMap[type] || 0) + 1;

                        // Condition tracking (owned)
                        const cond = card.condition || 'NM';
                        conditionMap[cond] = (conditionMap[cond] || 0) + 1;

                        // Price tracking
                        const val = this.getCardValue(card, set.name);
                        if (val > 0) {
                            pricedCards.push({ card, set, gen, value: val });
                            setValue += val;
                            totalMarketValue += val;
                        }
                        if (card.pricePaid != null && card.pricePaid > 0) {
                            totalPaid += card.pricePaid;
                        }
                    }
                }
                allSets.push({ ...totals, name: set.name, genId: gen.id, setValue, set, gen });
            }
        }

        // ─── 1. Generation Completion ───
        const genCard = document.createElement('div');
        genCard.className = 'stats-card';
        genCard.style.gridColumn = 'span 2';
        genCard.innerHTML = `<h3>Completion by Generation</h3><div class="bar-chart" id="gen-chart"></div>`;
        container.appendChild(genCard);

        const genChart = genCard.querySelector('#gen-chart');
        for (const gen of this.store.getGenerations()) {
            const totals = this.store.getGenTotals(gen);
            const color = GEN_COLORS[gen.id] || 'var(--accent-blue)';
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

        // ─── 2. Most Valuable Cards (Top 15) ───
        const sortedByValue = [...pricedCards].sort((a, b) => b.value - a.value);
        const topCards = sortedByValue.slice(0, 15);
        if (topCards.length > 0) {
            const mvCard = document.createElement('div');
            mvCard.className = 'stats-card';
            mvCard.style.gridColumn = 'span 2';
            mvCard.innerHTML = `
                <h3>Most Valuable Cards</h3>
                <div class="stats-table-wrapper">
                    <table class="stats-table">
                        <thead>
                            <tr>
                                <th style="width:30px">#</th>
                                <th>Card</th>
                                <th>Set</th>
                                <th>Rarity</th>
                                <th style="text-align:right">Market Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topCards.map((c, i) => `
                                <tr>
                                    <td style="color:var(--text-muted)">${i + 1}</td>
                                    <td style="font-weight:600">${this.escapeHtml(c.card.name)}</td>
                                    <td style="color:var(--text-secondary);font-size:12px">${this.escapeHtml(c.set.name)}</td>
                                    <td><span class="rarity-badge" style="font-size:11px">${this.escapeHtml(c.card.rarity || '—')}</span></td>
                                    <td style="text-align:right;font-weight:700;color:var(--accent-green)">$${c.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            container.appendChild(mvCard);
        }

        // ─── 3. Most Valuable Sets (Top 10) ───
        const topSets = [...allSets].filter(s => s.setValue > 0).sort((a, b) => b.setValue - a.setValue).slice(0, 10);
        if (topSets.length > 0) {
            const vsCard = document.createElement('div');
            vsCard.className = 'stats-card';
            vsCard.innerHTML = `
                <h3>Most Valuable Sets</h3>
                <div class="bar-chart">
                    ${topSets.map(s => {
                        const maxVal = topSets[0].setValue;
                        const pct = maxVal > 0 ? (s.setValue / maxVal * 100) : 0;
                        return `
                            <div class="bar-item">
                                <span class="bar-label" style="width:140px;font-size:11px">${s.name.substring(0, 20)}</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width:${pct}%;background:var(--accent-green)"></div>
                                </div>
                                <span class="bar-value" style="color:var(--accent-green);width:70px">$${s.setValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            container.appendChild(vsCard);
        }

        // ─── 4. Collection Value Summary ───
        const valueSummaryCard = document.createElement('div');
        valueSummaryCard.className = 'stats-card';
        const paidVsMarket = totalPaid > 0 && totalMarketValue > 0 ? ((totalMarketValue - totalPaid) / totalPaid * 100) : 0;
        const roiColor = paidVsMarket >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
        const roiSign = paidVsMarket >= 0 ? '+' : '';
        valueSummaryCard.innerHTML = `
            <h3>Value Summary</h3>
            <div style="display:flex;flex-direction:column;gap:16px;">
                <div style="text-align:center;padding:16px 0;">
                    <div style="font-size:36px;font-weight:700;color:var(--accent-green)">$${totalMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Total Market Value</div>
                </div>
                ${totalPaid > 0 ? `
                    <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid var(--border-color)">
                        <span style="color:var(--text-secondary)">Total Paid</span>
                        <span style="font-weight:700">$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                        <span style="color:var(--text-secondary)">ROI</span>
                        <span style="font-weight:700;color:${roiColor}">${roiSign}${paidVsMarket.toFixed(1)}%</span>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                        <span style="color:var(--text-secondary)">Unrealized Gain/Loss</span>
                        <span style="font-weight:700;color:${roiColor}">${roiSign}$${Math.abs(totalMarketValue - totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                ` : ''}
                <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border-color)">
                    <span style="color:var(--text-secondary)">Avg Card Value</span>
                    <span style="font-weight:700">${pricedCards.length > 0 ? '$' + (totalMarketValue / pricedCards.length).toFixed(2) : '—'}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                    <span style="color:var(--text-secondary)">Median Card Value</span>
                    <span style="font-weight:700">${pricedCards.length > 0 ? '$' + sortedByValue[Math.floor(sortedByValue.length / 2)].value.toFixed(2) : '—'}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                    <span style="color:var(--text-secondary)">Cards Priced</span>
                    <span style="font-weight:700">${pricedCards.length.toLocaleString()} / ${totalOwned.toLocaleString()}</span>
                </div>
            </div>
        `;
        container.appendChild(valueSummaryCard);

        // ─── 5. Top Completed Sets ───
        const topComplete = allSets.filter(s => s.owned > 0).sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent)).slice(0, 10);
        const topCompleteCard = document.createElement('div');
        topCompleteCard.className = 'stats-card';
        topCompleteCard.innerHTML = `<h3>Most Complete Sets</h3><div class="bar-chart">${
            topComplete.map(s => {
                const color = parseFloat(s.percent) >= 100 ? 'var(--accent-green)' : 'var(--accent-blue)';
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
        container.appendChild(topCompleteCard);

        // ─── 6. Needs Most Work ───
        const leastComplete = allSets.filter(s => s.owned > 0 && parseFloat(s.percent) < 100).sort((a, b) => parseFloat(a.percent) - parseFloat(b.percent)).slice(0, 10);
        const leastCard = document.createElement('div');
        leastCard.className = 'stats-card';
        leastCard.innerHTML = `<h3>Needs Most Work</h3><div class="bar-chart">${
            leastComplete.map(s => `
                <div class="bar-item">
                    <span class="bar-label" style="width:140px;font-size:11px">${s.name.substring(0, 20)}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${Math.min(s.percent, 100)}%;background:var(--accent-red)"></div>
                    </div>
                    <span class="bar-value" style="color:var(--accent-red)">${s.percent}%</span>
                </div>
            `).join('')
        }</div>`;
        container.appendChild(leastCard);

        // ─── 7. Rarity Distribution ───
        const rarityEntries = Object.entries(rarityMap).sort((a, b) => b[1] - a[1]);
        const maxRarity = rarityEntries.length > 0 ? rarityEntries[0][1] : 1;
        const rarityCard = document.createElement('div');
        rarityCard.className = 'stats-card';
        rarityCard.innerHTML = `
            <h3>Rarity Distribution</h3>
            <div class="bar-chart">
                ${rarityEntries.slice(0, 12).map(([r, count]) => `
                    <div class="bar-item">
                        <span class="bar-label" style="width:140px;font-size:11px">${r}</span>
                        <div class="bar-track">
                            <div class="bar-fill" style="width:${count / maxRarity * 100}%;background:var(--accent-purple)"></div>
                        </div>
                        <span class="bar-value" style="color:var(--accent-purple)">${count.toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(rarityCard);

        // ─── 8. Type Distribution (Owned Cards) ───
        const typeEntries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);
        const maxType = typeEntries.length > 0 ? typeEntries[0][1] : 1;
        const typeCard = document.createElement('div');
        typeCard.className = 'stats-card';
        const typeColorMap = {
            'Fire': 'var(--type-fire)', 'Water': 'var(--type-water)', 'Grass': 'var(--type-grass)',
            'Lightning': 'var(--type-lightning)', 'Psychic': 'var(--type-psychic)', 'Fighting': 'var(--type-fighting)',
            'Colorless': 'var(--type-colorless)', 'Metal': 'var(--type-metal)', 'Darkness': 'var(--type-darkness)',
            'Fairy': 'var(--type-fairy)', 'Dragon': 'var(--type-dragon)', 'Trainer': 'var(--type-trainer)',
            'Energy': 'var(--type-energy)', 'Supporter': 'var(--type-supporter)'
        };
        typeCard.innerHTML = `
            <h3>Type Distribution</h3>
            <div class="bar-chart">
                ${typeEntries.map(([t, count]) => {
                    const color = typeColorMap[t] || 'var(--text-secondary)';
                    return `
                        <div class="bar-item">
                            <span class="bar-label" style="width:100px;font-size:11px">${t}</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width:${count / maxType * 100}%;background:${color}"></div>
                            </div>
                            <span class="bar-value" style="color:${color}">${count.toLocaleString()}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        container.appendChild(typeCard);

        // ─── 9. Condition Breakdown ───
        const conditionOrder = ['NM', 'LP', 'MP', 'HP', 'DMG'];
        const conditionLabels = { 'NM': 'Near Mint', 'LP': 'Lightly Played', 'MP': 'Moderately Played', 'HP': 'Heavily Played', 'DMG': 'Damaged' };
        const conditionColors = { 'NM': 'var(--accent-green)', 'LP': 'var(--accent-blue)', 'MP': 'var(--accent-orange)', 'HP': 'var(--accent-red)', 'DMG': '#ff375f' };
        const condCard = document.createElement('div');
        condCard.className = 'stats-card';
        condCard.innerHTML = `
            <h3>Condition Breakdown</h3>
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${conditionOrder.filter(c => conditionMap[c]).map(c => {
                    const count = conditionMap[c];
                    const pct = totalOwned > 0 ? (count / totalOwned * 100) : 0;
                    const color = conditionColors[c];
                    return `
                        <div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                                <span style="font-size:13px;font-weight:500">${conditionLabels[c]} <span style="color:var(--text-muted)">(${c})</span></span>
                                <span style="font-size:13px;font-weight:600;color:${color}">${count.toLocaleString()} <span style="color:var(--text-muted)">(${pct.toFixed(1)}%)</span></span>
                            </div>
                            <div class="bar-track" style="height:6px">
                                <div class="bar-fill" style="width:${pct}%;background:${color}"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        container.appendChild(condCard);

        // ─── 10. Quick Stats ───
        const quickCard = document.createElement('div');
        quickCard.className = 'stats-card';
        const grandTotals = this.store.getGrandTotals();
        const completeSets = allSets.filter(s => parseFloat(s.percent) >= 100).length;
        const inProgressSets = allSets.filter(s => s.owned > 0 && parseFloat(s.percent) < 100).length;
        const notStartedSets = allSets.filter(s => s.owned === 0).length;
        const totalGens = this.store.getGenerations().length;

        // Find largest set
        const largestSet = allSets.reduce((a, b) => a.total > b.total ? a : b, allSets[0] || { name: '—', total: 0 });
        // Find most owned single set
        const mostOwnedSet = allSets.reduce((a, b) => a.owned > b.owned ? a : b, allSets[0] || { name: '—', owned: 0 });

        quickCard.innerHTML = `
            <h3>Overview</h3>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Generations</span><span style="font-weight:700">${totalGens}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Total Sets</span><span style="font-weight:700">${allSets.length}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--accent-green)">Complete</span><span style="font-weight:700;color:var(--accent-green)">${completeSets}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--accent-blue)">In Progress</span><span style="font-weight:700;color:var(--accent-blue)">${inProgressSets}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted)">Not Started</span><span style="font-weight:700;color:var(--text-muted)">${notStartedSets}</span></div>
                <hr style="border:none;border-top:1px solid var(--border-color)">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Unique Cards</span><span style="font-weight:700">${grandTotals.total.toLocaleString()}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Cards Owned</span><span style="font-weight:700;color:var(--accent-green)">${grandTotals.owned.toLocaleString()}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Cards Needed</span><span style="font-weight:700;color:var(--accent-red)">${grandTotals.need.toLocaleString()}</span></div>
                <hr style="border:none;border-top:1px solid var(--border-color)">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Largest Set</span><span style="font-weight:600;font-size:12px">${largestSet.name.substring(0, 22)} (${largestSet.total})</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">Most Collected Set</span><span style="font-weight:600;font-size:12px">${mostOwnedSet.name.substring(0, 22)} (${mostOwnedSet.owned})</span></div>
            </div>
        `;
        container.appendChild(quickCard);

        // ─── 11. Closest to Completion ───
        const almostDone = allSets
            .filter(s => s.owned > 0 && parseFloat(s.percent) < 100 && parseFloat(s.percent) >= 70)
            .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent))
            .slice(0, 8);
        if (almostDone.length > 0) {
            const almostCard = document.createElement('div');
            almostCard.className = 'stats-card';
            almostCard.innerHTML = `
                <h3>Almost Complete</h3>
                <p style="color:var(--text-secondary);font-size:12px;margin-bottom:12px">Sets that are 70%+ complete — so close!</p>
                <div class="bar-chart">
                    ${almostDone.map(s => {
                        const need = s.total - s.owned;
                        return `
                            <div class="bar-item">
                                <span class="bar-label" style="width:140px;font-size:11px">${s.name.substring(0, 20)}</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width:${Math.min(s.percent, 100)}%;background:var(--accent-orange)"></div>
                                </div>
                                <span class="bar-value" style="color:var(--accent-orange);width:55px">${need} left</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            container.appendChild(almostCard);
        }
    }

    // =============================================
    // IMPORT / EXPORT
    // =============================================
    handleFileImport(e) {
        // For future: parse Excel in browser using SheetJS
        this.showToast('Excel import coming soon! Use JSON import for now.', 'error');
    }

    handleExport() {
        const collectionData = JSON.parse(this.store.exportData());
        const binderData = this.loadBinder();
        const backup = {
            collection: collectionData,
            binder: binderData,
            exportedAt: new Date().toISOString(),
            version: 2
        };
        const data = JSON.stringify(backup, null, 2);
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
                // Support v2 format (wrapper with collection + binder)
                if (data.version === 2 && data.collection) {
                    this.store.importData(data.collection);
                    if (Array.isArray(data.binder)) {
                        this.saveBinder(data.binder);
                    }
                    this.renderDashboard();
                    this.showView('dashboard');
                    this.showToast('✅ Collection & Binder imported successfully!', 'success');
                } else if (data.generations) {
                    // Legacy v1 format (raw collection data)
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
        if (confirm('Are you sure? This will reset ALL your collection data and binder!')) {
            this.store.reset();
            localStorage.removeItem('pokemon_tcg_binder');
            this.renderDashboard();
            this.showToast('Collection and Binder reset to defaults.', 'success');
        }
    }

    // =============================================
    // UTILITIES
    // =============================================
    getCardUrl(card, set) {
        // Use direct TCGPlayer URL if available from pokemontcg.io Phase 1, otherwise generate search URL
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
        const hasConditionPrices = price.conditionPrices && Object.keys(price.conditionPrices).length > 0;
        
        const variants = this.resolveCardVariants(card);
        const lines = [];

        for (const v of variants) {
            const vp = this.findVariantPrice(price.variantPrices, v.apiName);
            if (vp && vp.market) {
                // Use real condition price from JustTCG if available, else multiplier estimate
                let adj;
                let tip;
                if (hasConditionPrices && price.conditionPrices[v.apiName] && price.conditionPrices[v.apiName][condition] !== undefined) {
                    adj = price.conditionPrices[v.apiName][condition];
                    tip = `${v.label} ${condition}: $${adj.toFixed(2)} (market)`;
                } else {
                    adj = vp.market * multiplier;
                    tip = condition !== 'NM'
                        ? `${v.label} NM: $${vp.market.toFixed(2)} × ${(multiplier*100).toFixed(0)}% (est.)`
                        : `${v.label}: $${vp.market.toFixed(2)}`;
                }

                // Condition badge for non-NM
                const condBadge = condition !== 'NM'
                    ? `<span class="cond-badge cond-${condition.toLowerCase()}">${condition}</span>`
                    : '';

                lines.push(`<a href="${url}" target="_blank" rel="noopener" class="price-line" title="${tip}" style="text-decoration:none"><span class="price-label">${v.tag}</span>${condBadge}$${adj.toFixed(2)}</a>`);
            }
        }

        // 24h price trend indicator
        let trendHtml = '';
        if (price.priceChanges && price.priceChanges['24h'] !== undefined) {
            const change = price.priceChanges['24h'];
            if (change > 0) {
                trendHtml = `<span class="price-trend trend-up" title="24h: +${change.toFixed(1)}%">↑${change.toFixed(1)}%</span>`;
            } else if (change < 0) {
                trendHtml = `<span class="price-trend trend-down" title="24h: ${change.toFixed(1)}%">↓${Math.abs(change).toFixed(1)}%</span>`;
            }
        }

        if (lines.length > 0) return lines.join('') + trendHtml;

        // Fallback: show first available price
        if (price.market) {
            const adj = hasConditionPrices ? (price.market * multiplier) : price.market * multiplier;
            return `<a href="${url}" target="_blank" rel="noopener" class="price-cell" style="text-decoration:none">$${adj.toFixed(2)}</a>` + trendHtml;
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
        const hasConditionPrices = price.conditionPrices && Object.keys(price.conditionPrices).length > 0;

        if (price.variantPrices) {
            const variants = this.resolveCardVariants(card);
            
            // Sum distinct variant prices (each checked variant contributes once)
            let variantTotal = 0;
            let foundAny = false;
            const counted = new Set();
            
            for (const v of variants) {
                const vp = this.findVariantPrice(price.variantPrices, v.apiName);
                if (vp && vp.market) {
                    if (!counted.has(v.apiName)) {
                        counted.add(v.apiName);
                        // Use real condition price from JustTCG if available
                        if (hasConditionPrices && price.conditionPrices[v.apiName] && price.conditionPrices[v.apiName][condition] !== undefined) {
                            variantTotal += price.conditionPrices[v.apiName][condition];
                        } else {
                            variantTotal += vp.market * multiplier;
                        }
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
            this.showToast('No JustTCG API key — fetching base prices only. Add your key in Settings for condition pricing.', 'info');
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
        const lang = document.getElementById('api-explorer-lang').value || 'en';
        
        btn.disabled = true;
        container.innerHTML = '';
        
        try {
            let allSets = [];
            
            if (lang === 'en') {
                // English: use pokemontcg.io for richer data (images, legalities, etc.)
                status.textContent = '⏳ Fetching sets from pokemontcg.io...';
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
            } else {
                // Japanese: fetch JA sets from TCGdex with their native names
                status.textContent = '⏳ Fetching Japanese sets from TCGdex...';
                const jaResp = await fetch('https://api.tcgdex.net/v2/ja/sets');
                if (!jaResp.ok) throw new Error(`JA fetch failed: HTTP ${jaResp.status}`);
                const jaSets = await jaResp.json();
                
                // Fetch set details in batches
                status.textContent = `⏳ Loading details for ${jaSets.length} sets...`;
                const batchSize = 10;
                for (let i = 0; i < jaSets.length; i += batchSize) {
                    const batch = jaSets.slice(i, i + batchSize);
                    const results = await Promise.allSettled(
                        batch.map(s => fetch(`https://api.tcgdex.net/v2/ja/sets/${s.id}`).then(r => r.ok ? r.json() : null))
                    );
                    for (let j = 0; j < results.length; j++) {
                        const detail = results[j].status === 'fulfilled' ? results[j].value : null;
                        const listItem = batch[j];
                        allSets.push({
                            id: listItem.id,
                            name: detail?.name || listItem.name,
                            series: detail?.serie?.name || '',
                            releaseDate: detail?.releaseDate || '',
                            total: detail?.cardCount?.total || listItem.cardCount?.total || 0,
                            printedTotal: detail?.cardCount?.official || listItem.cardCount?.official || 0,
                            images: {
                                symbol: detail?.symbol ? detail.symbol + '.png' : '',
                                logo: detail?.logo ? detail.logo + '.png' : '',
                            },
                            legalities: detail?.legal || null,
                            _source: 'tcgdex',
                            _lang: 'ja',
                        });
                    }
                    status.textContent = `⏳ Loaded ${allSets.length}/${jaSets.length} sets...`;
                }
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
        
        container.innerHTML = sets.map(s => {
            const symUrl = s.images?.symbol || '';
            return `
            <div class="api-set-card" data-api-set-id="${s.id}">
                ${symUrl ? `<img class="api-set-logo" src="${symUrl}" alt="" onerror="this.style.display='none'">` : '<span class="api-set-logo-placeholder">🃏</span>'}
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
        `}).join('');
        
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
        
        // Check if set already exists in collection (match by name since IDs differ)
        const existsInCollection = this.store.findSetByName(apiSet.name) || this.store.findSetById(apiSet.id);
        
        // Render header
        const header = document.getElementById('api-set-header');
        const logoUrl = apiSet.images?.logo || apiSet.images?.symbol || '';
        const symbolUrl = apiSet.images?.symbol || '';
        header.innerHTML = `
            ${logoUrl ? `<img class="api-detail-logo" src="${logoUrl}" alt="" onerror="${symbolUrl && symbolUrl !== logoUrl ? `this.onerror=null;this.src='${symbolUrl}'` : `this.style.display='none'`}">` : ''}
            <div class="api-detail-info">
                <h2>${this.escapeHtml(apiSet.name)}</h2>
                <div class="api-detail-stats">
                    <span>📅 Released: ${apiSet.releaseDate || 'N/A'}</span>
                    <span>🃏 ${apiSet.printedTotal || '?'} printed / ${apiSet.total || '?'} total</span>
                    <span>📦 Series: ${this.escapeHtml(apiSet.series || 'N/A')}</span>
                    <span>🆔 ID: ${apiSet.id}</span>
                    ${apiSet.ptcgoCode ? `<span>PTCGO: ${apiSet.ptcgoCode}</span>` : ''}
                    ${apiSet.legalities ? `<span>⚖️ ${Object.entries(apiSet.legalities).map(([k,v]) => k + ': ' + (typeof v === 'boolean' ? (v ? 'Legal' : 'No') : v)).join(', ')}</span>` : ''}
                    <span style="background:${apiSet._source === 'tcgdex' ? 'rgba(76,175,80,0.15);color:#81C784' : 'rgba(33,150,243,0.15);color:#64B5F6'}">${apiSet._source === 'tcgdex' ? '🌏 TCGdex' : '🌐 pokemontcg.io'}</span>
                </div>
                <div style="margin-top:12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
                    ${existsInCollection 
                        ? `<span style="color:var(--accent-green, #4CAF50);font-size:13px">✅ Linked: ${this.escapeHtml(existsInCollection.set.name)} (${existsInCollection.gen.name})</span>
                           <button id="btn-sync-api-set" class="primary-btn" style="font-size:13px;padding:8px 16px;background:linear-gradient(135deg,#FF9800,#F57C00)">🔄 Sync from API</button>
                           <button id="btn-link-manual" class="primary-btn" style="font-size:13px;padding:8px 16px;background:rgba(255,255,255,0.08);border:1px solid var(--border-color);color:var(--text-secondary)" title="Change which collection set this is linked to">🔗 Re-link</button>`
                        : `<button id="btn-add-api-set" class="primary-btn" style="font-size:13px;padding:8px 16px">➕ Add Set to Collection</button>
                           <button id="btn-link-manual" class="primary-btn" style="font-size:13px;padding:8px 16px;background:linear-gradient(135deg,#7C4DFF,#651FFF)">🔗 Link to Collection Set</button>`
                    }
                </div>
            </div>
        `;
        
        // Bind the add button if it exists
        const addBtn = document.getElementById('btn-add-api-set');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddSetPicker());
        }
        
        // Bind the sync button if it exists
        const syncBtn = document.getElementById('btn-sync-api-set');
        if (syncBtn && existsInCollection) {
            syncBtn.addEventListener('click', () => this.syncSetFromApi(existsInCollection, apiSet));
        }
        
        // Bind the manual link button
        const linkBtn = document.getElementById('btn-link-manual');
        if (linkBtn) {
            linkBtn.addEventListener('click', () => this.showManualLinkPicker(apiSet));
        }
        
        // Fetch cards
        const cardsStatus = document.getElementById('api-set-cards-status');
        const tbody = document.getElementById('api-set-cards-body');
        tbody.innerHTML = '';
        cardsStatus.textContent = '⏳ Fetching cards...';
        
        try {
            let allCards = [];
            
            if (apiSet._source === 'tcgdex') {
                // TCGdex: fetch set detail which includes card list
                const resp = await fetch(`https://api.tcgdex.net/v2/${apiSet._lang}/sets/${apiSet.id}`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const setData = await resp.json();
                const cardList = setData.cards || [];
                cardsStatus.textContent = `⏳ Loading ${cardList.length} cards...`;
                
                // Normalize TCGdex cards to match pokemontcg.io format
                allCards = cardList.map(c => ({
                    number: c.localId || c.id || '',
                    name: c.name || '',
                    supertype: c.category || '',
                    types: c.types || [],
                    subtypes: c.stage ? [c.stage] : [],
                    rarity: c.rarity || '—',
                    artist: c.illustrator || '—',
                    hp: c.hp || '',
                    images: { small: c.image ? c.image + '/low.png' : '' },
                }));
            } else {
                // pokemontcg.io: paginated card fetch
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
            }
            
            // Sort by card number
            allCards.sort((a, b) => {
                const na = parseInt(a.number) || 0;
                const nb = parseInt(b.number) || 0;
                return na - nb || (a.number || '').localeCompare(b.number || '');
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

    async syncSetFromApi(collectionMatch, apiSet) {
        const { gen, set: collectionSet } = collectionMatch;
        const syncBtn = document.getElementById('btn-sync-api-set');
        if (syncBtn) { syncBtn.disabled = true; syncBtn.textContent = '⏳ Analyzing...'; }
        
        try {
            // Fetch all API cards
            let apiCards = [];
            if (apiSet._source === 'tcgdex') {
                const resp = await fetch(`https://api.tcgdex.net/v2/${apiSet._lang}/sets/${apiSet.id}`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const setData = await resp.json();
                apiCards = (setData.cards || []).map(c => ({
                    number: c.localId || c.id || '',
                    name: c.name || '',
                    type: (c.types || []).join('/') || c.category || '',
                    rarity: c.rarity || '',
                }));
            } else {
                let page = 1;
                while (true) {
                    const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${apiSet.id}&page=${page}&pageSize=250`);
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const data = await resp.json();
                    apiCards = apiCards.concat((data.data || []).map(c => ({
                        number: c.number || '',
                        name: c.name || '',
                        type: (c.types || []).join('/') || c.supertype || '',
                        rarity: c.rarity || '',
                    })));
                    if (apiCards.length >= (data.totalCount || 0)) break;
                    page++;
                }
            }
            
            // Sort API cards by number
            apiCards.sort((a, b) => {
                const na = parseInt(a.number) || 0;
                const nb = parseInt(b.number) || 0;
                return na - nb || (a.number || '').localeCompare(b.number || '');
            });
            
            // Normalize card number for matching: "001/086" -> "1", "1" -> "1"
            const normalizeNum = (n) => {
                if (!n) return '';
                return String(parseInt(String(n).split('/')[0]) || n).replace(/^0+/, '') || '0';
            };
            
            // Build diff
            const changes = [];
            const newCards = [];
            const collectionByNum = new Map();
            collectionSet.cards.forEach((c, idx) => {
                const key = normalizeNum(c.number);
                if (!collectionByNum.has(key)) collectionByNum.set(key, { card: c, index: idx });
            });
            
            for (const apiCard of apiCards) {
                const key = normalizeNum(apiCard.number);
                const match = collectionByNum.get(key);
                
                if (match) {
                    // Found matching card — check for differences
                    const diffs = [];
                    if (match.card.name !== apiCard.name && apiCard.name) {
                        diffs.push({ field: 'name', old: match.card.name, new: apiCard.name });
                    }
                    if (match.card.type !== apiCard.type && apiCard.type) {
                        diffs.push({ field: 'type', old: match.card.type || '—', new: apiCard.type });
                    }
                    if (match.card.rarity !== apiCard.rarity && apiCard.rarity) {
                        diffs.push({ field: 'rarity', old: match.card.rarity || '—', new: apiCard.rarity });
                    }
                    // Check number format (e.g. "1" vs "001/086")
                    const apiNumFormatted = apiCard.number.includes('/') ? apiCard.number : 
                        (apiSet.printedTotal ? apiCard.number.padStart(3,'0') + '/' + String(apiSet.printedTotal).padStart(3,'0') : apiCard.number);
                    if (match.card.number !== apiNumFormatted && apiNumFormatted) {
                        diffs.push({ field: 'number', old: match.card.number, new: apiNumFormatted });
                    }
                    
                    if (diffs.length > 0) {
                        changes.push({ index: match.index, card: match.card, diffs, apiCard, apiNumFormatted });
                    }
                    collectionByNum.delete(key); // mark as matched
                } else {
                    // New card not in collection
                    const apiNumFormatted = apiCard.number.includes('/') ? apiCard.number : 
                        (apiSet.printedTotal ? apiCard.number.padStart(3,'0') + '/' + String(apiSet.printedTotal).padStart(3,'0') : apiCard.number);
                    newCards.push({ ...apiCard, number: apiNumFormatted });
                }
            }
            
            // Check symbol update
            const currentSymbol = typeof SET_SYMBOLS !== 'undefined' && SET_SYMBOLS[collectionSet.name];
            const apiSymbol = apiSet.images?.symbol || '';
            const symbolChanged = apiSymbol && (!currentSymbol || currentSymbol !== apiSymbol);
            
            // Show preview overlay
            if (changes.length === 0 && newCards.length === 0 && !symbolChanged) {
                if (syncBtn) { syncBtn.disabled = false; syncBtn.textContent = '🔄 Sync from API'; }
                alert('✅ This set is already in sync! No changes needed.');
                return;
            }
            
            this._showSyncPreview(gen, collectionSet, changes, newCards, symbolChanged, apiSet, apiSymbol);
            if (syncBtn) { syncBtn.disabled = false; syncBtn.textContent = '🔄 Sync from API'; }
            
        } catch (e) {
            console.error('Sync error:', e);
            if (syncBtn) { syncBtn.disabled = false; syncBtn.textContent = '🔄 Sync from API'; }
            alert(`❌ Error syncing: ${e.message}`);
        }
    }

    _showSyncPreview(gen, collectionSet, changes, newCards, symbolChanged, apiSet, apiSymbol) {
        const overlay = document.createElement('div');
        overlay.id = 'sync-preview-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
        
        let previewHTML = `
            <div class="sync-preview-modal">
                <h3>🔄 Sync Preview — ${this.escapeHtml(collectionSet.name)}</h3>
                <p class="sync-preview-subtitle">Review changes before applying. Your have/need status, conditions, prices, and notes will be preserved.</p>
                <div class="sync-preview-summary">
                    <span class="sync-stat sync-stat-update">📝 ${changes.length} card${changes.length !== 1 ? 's' : ''} to update</span>
                    <span class="sync-stat sync-stat-new">➕ ${newCards.length} new card${newCards.length !== 1 ? 's' : ''} to add</span>
                    ${symbolChanged ? '<span class="sync-stat sync-stat-symbol">🎨 Symbol/images will update</span>' : ''}
                </div>`;
        
        // Show card updates
        if (changes.length > 0) {
            previewHTML += `<div class="sync-section"><h4>📝 Card Updates</h4><table class="sync-diff-table">
                <thead><tr><th>#</th><th>Field</th><th>Current</th><th></th><th>API</th></tr></thead><tbody>`;
            for (const ch of changes) {
                for (const d of ch.diffs) {
                    previewHTML += `<tr>
                        <td>${this.escapeHtml(ch.card.number)}</td>
                        <td><span class="sync-field-badge">${d.field}</span></td>
                        <td class="sync-old">${this.escapeHtml(d.old || '—')}</td>
                        <td class="sync-arrow">→</td>
                        <td class="sync-new">${this.escapeHtml(d.new || '—')}</td>
                    </tr>`;
                }
            }
            previewHTML += `</tbody></table></div>`;
        }
        
        // Show new cards
        if (newCards.length > 0) {
            previewHTML += `<div class="sync-section"><h4>➕ New Cards (will be added as NEED)</h4><table class="sync-diff-table">
                <thead><tr><th>#</th><th>Name</th><th>Type</th><th>Rarity</th></tr></thead><tbody>`;
            for (const c of newCards.slice(0, 50)) {
                previewHTML += `<tr>
                    <td>${this.escapeHtml(c.number)}</td>
                    <td>${this.escapeHtml(c.name)}</td>
                    <td>${this.escapeHtml(c.type || '—')}</td>
                    <td>${this.escapeHtml(c.rarity || '—')}</td>
                </tr>`;
            }
            if (newCards.length > 50) {
                previewHTML += `<tr><td colspan="4" style="text-align:center;color:var(--text-secondary)">... and ${newCards.length - 50} more</td></tr>`;
            }
            previewHTML += `</tbody></table></div>`;
        }
        
        // Symbol update
        if (symbolChanged) {
            previewHTML += `<div class="sync-section"><h4>🎨 Symbol & Image Update</h4>
                <p style="font-size:13px;color:var(--text-secondary)">Card thumbnails and set logo will use the correct API images.</p></div>`;
        }
        
        previewHTML += `
                <div class="sync-preview-actions">
                    <button id="sync-apply-btn" class="primary-btn" style="background:linear-gradient(135deg,#FF9800,#F57C00);padding:10px 24px">✅ Apply ${changes.length + newCards.length} Changes</button>
                    <button id="sync-cancel-btn" style="padding:10px 24px;background:transparent;border:1px solid var(--border-color);border-radius:8px;color:var(--text-secondary);cursor:pointer">Cancel</button>
                </div>
            </div>`;
        
        overlay.innerHTML = previewHTML;
        document.body.appendChild(overlay);
        
        // Bind actions
        document.getElementById('sync-cancel-btn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        
        document.getElementById('sync-apply-btn').addEventListener('click', () => {
            this._applySyncChanges(gen, collectionSet, changes, newCards, symbolChanged, apiSet, apiSymbol);
            overlay.remove();
        });
    }

    _applySyncChanges(gen, collectionSet, changes, newCards, symbolChanged, apiSet, apiSymbol) {
        const genId = gen.id;
        const setId = collectionSet.id;
        
        // Apply card updates
        for (const ch of changes) {
            const card = collectionSet.cards[ch.index];
            if (!card) continue;
            
            for (const d of ch.diffs) {
                const oldVal = card[d.field];
                card[d.field] = d.new;
                // Track changes for persistence
                this.store.changes[`${genId}/${setId}/${ch.index}/${d.field}`] = d.new;
            }
        }
        
        // Add new cards
        for (const newCard of newCards) {
            const cardObj = {
                number: newCard.number,
                name: newCard.name,
                type: newCard.type || '',
                status: 'NEED',
                stock: 0,
                quantities: { normal: 0, holofoil: 0, reverseHolofoil: 0, firstEdition: 0, unlimited: 0 },
                rarity: newCard.rarity || '',
                note: '',
                condition: ''
            };
            collectionSet.cards.push(cardObj);
        }
        
        // Re-sort cards by number
        collectionSet.cards.sort((a, b) => {
            const na = parseInt(a.number) || 0;
            const nb = parseInt(b.number) || 0;
            return na - nb || (a.number || '').localeCompare(b.number || '');
        });
        
        // Update symbol
        if (symbolChanged && apiSymbol && typeof SET_SYMBOLS !== 'undefined') {
            SET_SYMBOLS[collectionSet.name] = apiSymbol;
        }
        
        // Save
        this.store.save();
        
        // Show success
        const total = changes.length + newCards.length;
        const cardsStatus = document.getElementById('api-set-cards-status');
        if (cardsStatus) {
            cardsStatus.textContent = `✅ Synced! Updated ${changes.length} cards, added ${newCards.length} new cards.`;
        }
        
        // Update the sync button
        const syncBtn = document.getElementById('btn-sync-api-set');
        if (syncBtn) {
            syncBtn.outerHTML = `<span style="color:var(--accent-green, #4CAF50);font-size:13px">✅ Synced ${total} changes</span>`;
        }
    }

    showManualLinkPicker(apiSet) {
        const gens = this.store.getGenerations();
        const overlay = document.createElement('div');
        overlay.id = 'manual-link-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
        
        // Build list of all collection sets
        let setsHTML = '';
        for (const gen of gens) {
            for (const set of gen.sets) {
                setsHTML += `
                    <button class="manual-link-set-btn" data-gen-id="${gen.id}" data-set-id="${set.id}" style="
                        text-align:left;padding:10px 14px;background:rgba(255,255,255,0.04);
                        border:1px solid var(--border-color);border-radius:8px;color:var(--text-primary);
                        font-size:13px;cursor:pointer;transition:all 0.15s ease;
                        display:flex;justify-content:space-between;align-items:center;gap:12px
                    ">
                        <div style="min-width:0;flex:1">
                            <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${this.escapeHtml(set.name)}</div>
                            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${this.escapeHtml(gen.name)} · ${set.cards.length} cards</div>
                        </div>
                        <span style="color:var(--text-secondary);font-size:11px;white-space:nowrap">${set.releaseDate || ''}</span>
                    </button>`;
            }
        }
        
        overlay.innerHTML = `
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:24px;max-width:520px;width:95%;max-height:80vh;display:flex;flex-direction:column">
                <h3 style="color:var(--text-primary);margin:0 0 4px 0;font-size:18px">🔗 Link "${this.escapeHtml(apiSet.name)}" to Collection Set</h3>
                <p style="color:var(--text-secondary);font-size:12px;margin:0 0 12px 0">Pick the set in your collection that matches this API set. Sync will use this pairing.</p>
                <input type="text" id="manual-link-search" placeholder="Search your sets..." style="
                    padding:10px 14px;background:rgba(255,255,255,0.06);border:1px solid var(--border-color);
                    border-radius:8px;color:var(--text-primary);font-size:14px;margin-bottom:12px;width:100%;box-sizing:border-box
                ">
                <div id="manual-link-list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px">
                    ${setsHTML}
                </div>
                <button id="manual-link-cancel" style="margin-top:12px;padding:8px 20px;background:transparent;border:1px solid var(--border-color);border-radius:8px;color:var(--text-secondary);cursor:pointer;font-size:13px;align-self:flex-end">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Search filter
        const searchInput = document.getElementById('manual-link-search');
        const listEl = document.getElementById('manual-link-list');
        searchInput.focus();
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase();
            listEl.querySelectorAll('.manual-link-set-btn').forEach(btn => {
                const text = btn.textContent.toLowerCase();
                btn.style.display = text.includes(q) ? '' : 'none';
            });
        });
        
        // Hover effects + click handler
        listEl.querySelectorAll('.manual-link-set-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => { btn.style.borderColor = 'var(--accent-primary)'; btn.style.background = 'rgba(255,255,255,0.08)'; });
            btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'var(--border-color)'; btn.style.background = 'rgba(255,255,255,0.04)'; });
            btn.addEventListener('click', () => {
                const genId = btn.dataset.genId;
                const setId = btn.dataset.setId;
                const gen = gens.find(g => g.id === genId);
                const set = gen?.sets.find(s => s.id === setId);
                if (gen && set) {
                    overlay.remove();
                    // Update the header to show the link, then trigger sync
                    const collectionMatch = { gen, set };
                    // Update header UI
                    const headerActions = document.querySelector('#api-set-header .api-detail-info div:last-child');
                    if (headerActions) {
                        headerActions.innerHTML = `
                            <span style="color:var(--accent-green, #4CAF50);font-size:13px">✅ Linked: ${this.escapeHtml(set.name)} (${this.escapeHtml(gen.name)})</span>
                            <button id="btn-sync-api-set" class="primary-btn" style="font-size:13px;padding:8px 16px;background:linear-gradient(135deg,#FF9800,#F57C00)">🔄 Sync from API</button>
                            <button id="btn-link-manual" class="primary-btn" style="font-size:13px;padding:8px 16px;background:rgba(255,255,255,0.08);border:1px solid var(--border-color);color:var(--text-secondary)" title="Change which collection set this is linked to">🔗 Re-link</button>
                        `;
                        // Re-bind buttons
                        document.getElementById('btn-sync-api-set').addEventListener('click', () => this.syncSetFromApi(collectionMatch, apiSet));
                        document.getElementById('btn-link-manual').addEventListener('click', () => this.showManualLinkPicker(apiSet));
                    }
                    // Auto-start sync
                    this.syncSetFromApi(collectionMatch, apiSet);
                }
            });
        });
        
        // Cancel / close
        document.getElementById('manual-link-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
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

    // =============================================
    // DUPLICATES BINDER
    // =============================================

    loadBinder() {
        try {
            const saved = localStorage.getItem('pokemon_tcg_binder');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Failed to load binder:', e);
            return [];
        }
    }

    saveBinder(cards) {
        try {
            localStorage.setItem('pokemon_tcg_binder', JSON.stringify(cards));
        } catch (e) {
            console.warn('Failed to save binder:', e);
        }
    }

    async searchBinderCards(query) {
        const resultsContainer = document.getElementById('binder-search-results');
        const status = document.getElementById('binder-search-status');

        try {
            // Use pokemontcg.io name search with select for efficiency
            const cleanQ = query.replace(/"/g, '');
            const url = `https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(cleanQ)}"&pageSize=20&select=id,name,number,set,rarity,types,supertype,images,tcgplayer`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const cards = data.data || [];

            status.textContent = cards.length > 0 ? `${cards.length} results` : 'No results';

            if (cards.length === 0) {
                resultsContainer.innerHTML = '<p style="color:var(--text-muted);padding:16px;text-align:center">No cards found. Try a different search term.</p>';
                return;
            }

            resultsContainer.innerHTML = cards.map((c, i) => {
                const price = this._getApiCardMarketPrice(c);
                const priceStr = price > 0 ? `$${price.toFixed(2)}` : '';
                const types = (c.types || []).join(', ') || c.supertype || '';
                return `
                    <div class="binder-result-card" data-idx="${i}">
                        <img class="binder-result-thumb" src="${c.images?.small || ''}" alt="" loading="lazy" onerror="this.style.display='none'">
                        <div class="binder-result-info">
                            <h4>${this.escapeHtml(c.name)}</h4>
                            <p class="binder-result-set">${this.escapeHtml(c.set?.name || '—')} · #${c.number || '?'}</p>
                            <div class="binder-result-meta">
                                <span>${this.escapeHtml(c.rarity || '—')}</span>
                                ${types ? `<span>${this.escapeHtml(types)}</span>` : ''}
                                ${priceStr ? `<span class="binder-result-price">${priceStr}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Cache results for selection
            this._binderSearchResults = cards;

            // Click handlers
            resultsContainer.querySelectorAll('.binder-result-card').forEach(card => {
                card.addEventListener('click', () => {
                    const idx = parseInt(card.dataset.idx);
                    this.selectBinderCard(this._binderSearchResults[idx]);
                    resultsContainer.querySelectorAll('.binder-result-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                });
            });

        } catch (e) {
            status.textContent = '❌ Error';
            console.error('Binder search error:', e);
            resultsContainer.innerHTML = `<p style="color:var(--accent-red);padding:16px">Search failed: ${e.message}</p>`;
        }
    }

    _getApiCardMarketPrice(apiCard) {
        if (!apiCard.tcgplayer?.prices) return 0;
        const prices = apiCard.tcgplayer.prices;
        // Try common variant keys for market price
        for (const key of ['holofoil', 'reverseHolofoil', 'normal', '1stEditionHolofoil', '1stEditionNormal', 'unlimitedHolofoil']) {
            if (prices[key]?.market) return prices[key].market;
        }
        // Fallback: first variant with a market price
        for (const key of Object.keys(prices)) {
            if (prices[key]?.market) return prices[key].market;
        }
        return 0;
    }

    selectBinderCard(apiCard) {
        this._binderSelectedCard = apiCard;
        const form = document.getElementById('binder-add-form');
        form.style.display = 'block';

        document.getElementById('binder-add-img').src = apiCard.images?.small || '';
        document.getElementById('binder-add-name').textContent = apiCard.name;
        document.getElementById('binder-add-set').textContent = `${apiCard.set?.name || '—'} · #${apiCard.number || '?'}`;

        const price = this._getApiCardMarketPrice(apiCard);
        const meta = [
            apiCard.rarity || '',
            (apiCard.types || []).join(', '),
            price > 0 ? `Market: $${price.toFixed(2)}` : ''
        ].filter(Boolean).join(' · ');
        document.getElementById('binder-add-meta').textContent = meta;

        // Reset form fields
        document.getElementById('binder-add-qty').value = 1;
        document.getElementById('binder-add-condition').value = 'NM';
        document.getElementById('binder-add-price').value = '';
        document.getElementById('binder-add-notes').value = '';

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    confirmAddToBinder() {
        const apiCard = this._binderSelectedCard;
        if (!apiCard) return;

        const qty = parseInt(document.getElementById('binder-add-qty').value) || 1;
        const condition = document.getElementById('binder-add-condition').value;
        const pricePaid = parseFloat(document.getElementById('binder-add-price').value) || 0;
        const notes = document.getElementById('binder-add-notes').value.trim();

        const entry = {
            id: apiCard.id,
            name: apiCard.name,
            set: apiCard.set?.name || '',
            setId: apiCard.set?.id || '',
            number: apiCard.number || '',
            rarity: apiCard.rarity || '',
            type: (apiCard.types || []).join(', ') || apiCard.supertype || '',
            imageUrl: apiCard.images?.small || '',
            marketPrice: this._getApiCardMarketPrice(apiCard),
            quantity: qty,
            condition: condition,
            pricePaid: pricePaid,
            notes: notes,
            addedAt: new Date().toISOString()
        };

        const binder = this.loadBinder();
        binder.push(entry);
        this.saveBinder(binder);

        // Reset UI
        document.getElementById('binder-add-form').style.display = 'none';
        document.getElementById('binder-search-input').value = '';
        document.getElementById('binder-search-results').innerHTML = '';
        document.getElementById('binder-search-status').textContent = '';
        this._binderSelectedCard = null;

        this.showToast(`Added ${apiCard.name} to Binder!`, 'success');
        this.renderBinder();
    }

    renderBinder() {
        const binder = this.loadBinder();
        const statsEl = document.getElementById('binder-stats');
        const controlsEl = document.getElementById('binder-controls');
        const tableEl = document.getElementById('binder-table-wrapper');

        // Stats
        const totalCards = binder.reduce((sum, c) => sum + (c.quantity || 1), 0);
        const uniqueCards = binder.length;
        const totalValue = binder.reduce((sum, c) => sum + (c.marketPrice || 0) * (c.quantity || 1), 0);
        const totalPaid = binder.reduce((sum, c) => sum + (c.pricePaid || 0), 0);

        statsEl.innerHTML = `
            <div class="binder-stat-card">
                <div class="binder-stat-value" style="color:var(--text-primary)">${totalCards.toLocaleString()}</div>
                <div class="binder-stat-label">Total Cards</div>
            </div>
            <div class="binder-stat-card">
                <div class="binder-stat-value" style="color:var(--accent-blue)">${uniqueCards.toLocaleString()}</div>
                <div class="binder-stat-label">Unique Entries</div>
            </div>
            <div class="binder-stat-card">
                <div class="binder-stat-value" style="color:var(--accent-green)">$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="binder-stat-label">Market Value</div>
            </div>
            <div class="binder-stat-card">
                <div class="binder-stat-value" style="color:var(--accent-orange)">$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="binder-stat-label">Total Paid</div>
            </div>
        `;

        if (binder.length === 0) {
            controlsEl.style.display = 'none';
            tableEl.innerHTML = `
                <div class="binder-empty">
                    <h3>No cards in your binder yet</h3>
                    <p>Search for a card above to start tracking your duplicates, trade stock, and extras.</p>
                </div>
            `;
            return;
        }

        controlsEl.style.display = 'flex';

        // Filter
        const filterQuery = (document.getElementById('binder-filter').value || '').toLowerCase();
        let filtered = binder.map((c, i) => ({ ...c, _idx: i }));
        if (filterQuery.length >= 2) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(filterQuery) ||
                c.set.toLowerCase().includes(filterQuery) ||
                (c.rarity || '').toLowerCase().includes(filterQuery) ||
                (c.notes || '').toLowerCase().includes(filterQuery)
            );
        }

        // Sort
        const sortVal = document.getElementById('binder-sort').value;
        filtered.sort((a, b) => {
            switch (sortVal) {
                case 'added-asc': return new Date(a.addedAt) - new Date(b.addedAt);
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'value-desc': return (b.marketPrice || 0) - (a.marketPrice || 0);
                case 'value-asc': return (a.marketPrice || 0) - (b.marketPrice || 0);
                case 'set-asc': return a.set.localeCompare(b.set);
                default: return new Date(b.addedAt) - new Date(a.addedAt); // added-desc
            }
        });

        const conditions = ['NM', 'LP', 'MP', 'HP', 'DMG'];

        tableEl.innerHTML = `
            <table class="binder-table">
                <thead>
                    <tr>
                        <th style="width:50px"></th>
                        <th>Card</th>
                        <th>Set</th>
                        <th>Rarity</th>
                        <th>Type</th>
                        <th>Qty</th>
                        <th>Condition</th>
                        <th>Paid</th>
                        <th>Market</th>
                        <th>Notes</th>
                        <th style="width:40px"></th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(c => `
                        <tr data-binder-idx="${c._idx}">
                            <td><img class="binder-card-thumb" src="${c.imageUrl || ''}" alt="" loading="lazy" onerror="this.style.display='none'"></td>
                            <td style="font-weight:600;white-space:nowrap">${this.escapeHtml(c.name)}<br><span style="font-weight:400;color:var(--text-muted);font-size:11px">#${c.number}</span></td>
                            <td style="font-size:12px;color:var(--text-secondary)">${this.escapeHtml(c.set)}</td>
                            <td style="font-size:12px">${this.escapeHtml(c.rarity || '—')}</td>
                            <td style="font-size:12px">${this.escapeHtml(c.type || '—')}</td>
                            <td><input type="number" class="binder-inline-input" data-field="quantity" value="${c.quantity || 1}" min="1" max="999"></td>
                            <td><select class="binder-inline-select" data-field="condition">${conditions.map(k => `<option value="${k}" ${c.condition === k ? 'selected' : ''}>${k}</option>`).join('')}</select></td>
                            <td><input type="number" class="binder-inline-input" data-field="pricePaid" value="${c.pricePaid || ''}" min="0" step="0.01" style="width:65px" placeholder="$"></td>
                            <td style="color:var(--accent-green);font-weight:600">${c.marketPrice > 0 ? '$' + c.marketPrice.toFixed(2) : '—'}</td>
                            <td><input type="text" class="binder-inline-text" data-field="notes" value="${this.escapeHtml(c.notes || '')}" placeholder="..."></td>
                            <td><button class="binder-delete-btn" title="Remove">✕</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Inline edit handlers
        tableEl.querySelectorAll('.binder-inline-input, .binder-inline-select, .binder-inline-text').forEach(input => {
            input.addEventListener('change', (e) => {
                const row = e.target.closest('tr');
                const idx = parseInt(row.dataset.binderIdx);
                const field = e.target.dataset.field;
                const binder = this.loadBinder();
                if (!binder[idx]) return;

                if (field === 'quantity') {
                    binder[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                } else if (field === 'pricePaid') {
                    binder[idx].pricePaid = parseFloat(e.target.value) || 0;
                } else if (field === 'condition') {
                    binder[idx].condition = e.target.value;
                } else if (field === 'notes') {
                    binder[idx].notes = e.target.value;
                }
                this.saveBinder(binder);
                // Update stats without full re-render to keep focus
                this.updateBinderStats(binder);
            });
        });

        // Delete handlers
        tableEl.querySelectorAll('.binder-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const idx = parseInt(row.dataset.binderIdx);
                this.deleteBinderCard(idx);
            });
        });
    }

    updateBinderStats(binder) {
        const statsEl = document.getElementById('binder-stats');
        const totalCards = binder.reduce((sum, c) => sum + (c.quantity || 1), 0);
        const uniqueCards = binder.length;
        const totalValue = binder.reduce((sum, c) => sum + (c.marketPrice || 0) * (c.quantity || 1), 0);
        const totalPaid = binder.reduce((sum, c) => sum + (c.pricePaid || 0), 0);

        const cards = statsEl.querySelectorAll('.binder-stat-value');
        if (cards.length >= 4) {
            cards[0].textContent = totalCards.toLocaleString();
            cards[1].textContent = uniqueCards.toLocaleString();
            cards[2].textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            cards[3].textContent = '$' + totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    deleteBinderCard(idx) {
        const binder = this.loadBinder();
        if (idx < 0 || idx >= binder.length) return;
        const name = binder[idx].name;
        binder.splice(idx, 1);
        this.saveBinder(binder);
        this.showToast(`Removed ${name} from Binder`, 'success');
        this.renderBinder();
    }
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
