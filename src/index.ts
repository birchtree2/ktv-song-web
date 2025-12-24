import * as dotenv from "dotenv";
dotenv.config();
import * as process from "node:process";
import { runKTVServer } from "@/ktvServer";
import ktvLogger from "@/logger";

console.log(process.env.NODE_ENV);
// assets 目录
const staticDir = './static';

// 启动 KTV Koa 服务器
const koaApp = runKTVServer(staticDir, process.env.REDIS_URL);
koaApp.use(async (ctx) => {
    ctx.status = 404;
    ctx.body = '404 Not Found - 路径错误';
});
const port: number = parseInt(process.env.PORT || '3002');
const host: string = process.env.HOST || "localhost";

if (isNaN(port)) {
    ktvLogger.error('port is not a number');
    process.exit(1);
}

koaApp.listen(port, host, () => {
    ktvLogger.info(`HTTP Server running on http://${host}:${port}`);
    ktvLogger.info(`Website is available on http://localhost:${port}`);
});






