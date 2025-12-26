import axios from "axios";

/**
 * 解析 B23.TV 短链接并提取 BV 号
 * @param inputUrl
 * @returns 返回提取到的 BV 号
 */
async function resolveBilibiliData(inputUrl: string) {
    let targetUrl = inputUrl;

    if (inputUrl.includes('b23.tv')) {
        try {
            const response = await axios(inputUrl, {
                maxRedirects: 0,
                validateStatus: (status) => status >= 200 && status < 400,
                headers: { 'User-Agent': 'Mozilla/5.0...' }
            });
            targetUrl = response.headers['location'] || inputUrl;
        } catch (error) {
            targetUrl = error.response?.headers?.location || inputUrl;
        }
    }

    try {
        const normalizedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
        const urlObj = new URL(normalizedUrl);
        const bvMatch = urlObj.pathname.match(/BV[a-zA-Z0-9]{10}/i);
        if (!bvMatch) return null;

        const bvid = bvMatch[0];
        const pParam = urlObj.searchParams.get('p');

        if (pParam) {
            const pNum = parseInt(pParam, 10);
            return {
                url: `bilibili://video/${bvid}?page=${Math.max(0, pNum - 1)}`,
                bvid: bvid,
                pNum: pNum
            };
        }

        return {
            url: `bilibili://video/${bvid}`,
            bvid: bvid,
            pNum: 0
        };
    } catch (e) {
        return null;
    }
}

export { resolveBilibiliData };
