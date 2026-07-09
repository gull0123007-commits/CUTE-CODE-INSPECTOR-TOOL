export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Website responded with status: ${response.status}`);
        }

        const htmlText = await response.text();

        return res.status(200).json({
            html: htmlText,
            scripts: [
                { filename: 'main.js', code: '// Static script analyzer placeholder' }
            ],
            styles: [
                { filename: 'style.css', code: '/* Static CSS analyzer placeholder */' }
            ],
            endpoints: [url + '/api/v1', url + '/wp-json'],
            leaks: []
        });

    } catch (error) {
        return res.status(500).json({ error: `Could not fetch website: ${error.message}` });
    }
}
