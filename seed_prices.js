// Run this in the browser console to seed some test prices
// so you can see the pricing UI while the API rate limit resets.
// Paste this into the browser DevTools Console (F12 > Console):

(function() {
    const testPrices = {
        "alakazam|base set (shadowless)": { market: 89.99, low: 65.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86275", image: null, fetchedAt: Date.now() },
        "blastoise|base set (shadowless)": { market: 299.99, low: 220.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86271", image: null, fetchedAt: Date.now() },
        "chansey|base set (shadowless)": { market: 39.99, low: 25.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86269", image: null, fetchedAt: Date.now() },
        "charizard|base set (shadowless)": { market: 8499.99, low: 5000.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86274", image: null, fetchedAt: Date.now() },
        "clefairy|base set (shadowless)": { market: 29.99, low: 18.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86268", image: null, fetchedAt: Date.now() },
        "gyarados|base set (shadowless)": { market: 49.99, low: 35.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86267", image: null, fetchedAt: Date.now() },
        "hitmonchan|base set (shadowless)": { market: 34.99, low: 22.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86266", image: null, fetchedAt: Date.now() },
        "machamp|base set (shadowless)": { market: 19.99, low: 12.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86265", image: null, fetchedAt: Date.now() },
        "magneton|base set (shadowless)": { market: 29.99, low: 18.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86264", image: null, fetchedAt: Date.now() },
        "mewtwo|base set (shadowless)": { market: 89.99, low: 60.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86263", image: null, fetchedAt: Date.now() },
        "nidoking|base set (shadowless)": { market: 39.99, low: 25.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86262", image: null, fetchedAt: Date.now() },
        "ninetales|base set (shadowless)": { market: 34.99, low: 22.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86261", image: null, fetchedAt: Date.now() },
        "poliwrath|base set (shadowless)": { market: 29.99, low: 18.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86260", image: null, fetchedAt: Date.now() },
        "raichu|base set (shadowless)": { market: 39.99, low: 25.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86259", image: null, fetchedAt: Date.now() },
        "venusaur|base set (shadowless)": { market: 299.99, low: 200.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86273", image: null, fetchedAt: Date.now() },
        "zapdos|base set (shadowless)": { market: 49.99, low: 30.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86258", image: null, fetchedAt: Date.now() },
        "pikachu|base set (shadowless)": { market: 29.99, low: 15.00, tcgplayerUrl: "https://www.tcgplayer.com/product/86230", image: null, fetchedAt: Date.now() },
    };

    localStorage.setItem('price_cache', JSON.stringify({
        timestamp: Date.now(),
        data: testPrices
    }));

    console.log('✅ Seeded ' + Object.keys(testPrices).length + ' test prices for Base Set (Shadowless)');
    console.log('Refresh the page to see them!');
})();
