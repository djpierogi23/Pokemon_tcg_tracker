#!/usr/bin/env python3
"""Fetch prices for all Gen 1 HAVE cards via PokéWallet API."""
import json, time, re, urllib.parse, urllib.request, os

API_KEY = "pk_live_fb31a524b05a8ea0bd363cac0d1abd952cc0438fe88bb745"
COLLECTION = "/Users/danodomirok/.gemini/antigravity/scratch/Pokemon_tcg_tracker/data/collection.json"
CACHE_OUT = "/Users/danodomirok/.gemini/antigravity/scratch/Pokemon_tcg_tracker/data/price_cache_gen1.json"
DELAY = 1.2

def clean_name(name):
    return re.sub(r'[^\x00-\x7f]', '', name).strip()

def clean_set(name):
    name = re.sub(r'\s*\(.*?\)\s*', '', name).strip()
    name = re.sub(r'^EX\s+', '', name, flags=re.IGNORECASE).strip()
    return name

def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

def norm_num(n):
    return re.sub(r'^0+', '', (n or '')).lower()

SET_API_MAP = {
    'Base Set (1st Edition)': 'Base Set (Shadowless)',
    'Base Set (Unlimited)': 'Base Set',
    'Base Set (Shadowless)': 'Base Set (Shadowless)',
}

def find_best_match(results, card_name, set_name, card_number):
    target_card = norm(card_name)
    target_set_base = norm(clean_set(set_name))
    target_num = norm_num(card_number)
    mapped = SET_API_MAP.get(set_name)
    mapped_norm = norm(mapped) if mapped else None
    best, best_score = None, -1
    for r in results:
        ci = r.get('card_info', {})
        api_set = norm(ci.get('set_name', ''))
        api_set_base = norm(re.sub(r'\s*\(.*?\)\s*', '', ci.get('set_name', '')).strip())
        api_card = norm(ci.get('name', '') or ci.get('clean_name', ''))
        api_num = norm_num(ci.get('card_number', ''))
        score = 0
        if mapped_norm and api_set == mapped_norm: score += 150
        elif api_set_base == target_set_base: score += 75
        elif target_set_base in api_set or api_set in target_set_base: score += 50
        if target_num and api_num and target_num == api_num: score += 200
        if api_card == target_card: score += 10
        elif target_card in api_card or api_card in target_card: score += 5
        if score > best_score: best_score, best = score, r
    return best if best_score >= 50 else None

def fetch_price(card_name, set_name, card_number):
    query = f"{clean_name(card_name)} {clean_set(set_name)}".replace('(','').replace(')','').strip()
    query = re.sub(r'\s+', ' ', query)
    url = f"https://api.pokewallet.io/search?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={'X-API-Key': API_KEY})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        return None, str(e)
    results = data.get('results', [])
    if not results: return None, 'no results'
    match = find_best_match(results, card_name, set_name, card_number)
    if not match: return None, 'no match'
    prices = match.get('tcgplayer', {}).get('prices', [])
    vp, fm, fl = {}, None, None
    for p in prices:
        sub = p.get('sub_type_name', 'Normal')
        m, l = p.get('market_price'), p.get('low_price')
        if m is not None:
            vp[sub] = {'market': m, 'low': l}
            if fm is None: fm, fl = m, l
    ci = match.get('card_info', {})
    return {'market': fm, 'low': fl, 'variantPrices': vp,
            'tcgplayerUrl': match.get('tcgplayer',{}).get('url',''),
            'rarity': ci.get('rarity'), 'image': ci.get('image_url',''),
            'fetchedAt': int(time.time()*1000)}, None

def main():
    with open(COLLECTION) as f: data = json.load(f)
    cache = {}
    if os.path.exists(CACHE_OUT):
        with open(CACHE_OUT) as f: cache = json.load(f)
    gen1 = next((g for g in data['generations'] if g['id']=='gen1'), None)
    if not gen1: print("Gen 1 not found!"); return
    todo = []
    for s in gen1['sets']:
        for c in s['cards']:
            if c['status'] != 'HAVE': continue
            k = f"{c['name']}|{s['name']}|{c['number']}"
            if k not in cache: todo.append((c, s, k))
    total = len(todo)
    print(f"Fetching {total} cards ({len(cache)} already cached)...")
    fetched = errors = 0
    for i, (card, sset, key) in enumerate(todo):
        price, err = fetch_price(card['name'], sset['name'], card['number'])
        if price:
            cache[key] = price
            fetched += 1
            v = f"${price['market']}" if price['market'] else "no $"
            print(f"  [{i+1}/{total}] OK {card['name']} ({sset['name']}) {v}")
        else:
            errors += 1
            print(f"  [{i+1}/{total}] !! {card['name']} ({sset['name']}) {err}")
        if (i+1) % 25 == 0:
            with open(CACHE_OUT, 'w') as f: json.dump(cache, f)
            print(f"  -- saved ({len(cache)} cached)")
        if i < total-1: time.sleep(DELAY)
    with open(CACHE_OUT, 'w') as f: json.dump(cache, f)
    print(f"\nDone! {fetched} fetched, {errors} errors, {len(cache)} total cached")

if __name__ == '__main__':
    main()
