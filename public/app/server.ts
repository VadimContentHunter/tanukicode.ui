import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { EjsRenderer } from './EjsRenderer.js';
import { SvgSpriteGenerator } from './SvgSpriteGenerator.js';

const app = express();
const port = 9003;

const __filename = fileURLToPath(import.meta.url); // полный путь к файлу /var/www/browser-game-bang/dist/server.js
const __dirname = path.dirname(__filename); // путь к папке файла /var/www/browser-game-bang/dist
const __projectRoot = path.resolve(__dirname, '../app'); // /var/www/browser-game-bang/app

const pathAssets = path.join(__projectRoot, 'assets');
const pathView = path.join(__projectRoot, 'views');
const ejsRenderer = new EjsRenderer(pathView, path.join(__projectRoot, 'render-views'));
const generatorSprites = new SvgSpriteGenerator({
    outputDir: 'public/app/assets/resources/sprites',
});

app.set('view engine', 'ejs');
app.set('views', pathView);

// Настройка для обслуживания статических файлов
app.use('/css', express.static(path.join(pathAssets, 'css')));
app.use('/js', express.static(path.join(pathAssets, 'js')));
app.use('/resources', express.static(path.join(pathAssets, 'resources')));
app.use('/icons', express.static(path.join(pathAssets, 'resources', 'icons')));
app.use('/imgs', express.static(path.join(pathAssets, 'resources', 'imgs')));
app.use('/fonts', express.static(path.join(pathAssets, 'resources', 'fonts')));

// Маршрут по умолчанию
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.get('/site', async (req, res) => {
    try {
        const spriteContent = generatorSprites.generateAndGetContent(
            [
                path.join(pathAssets, 'resources', 'icons', 'sun.svg'),
                path.join(pathAssets, 'resources', 'icons', 'avatar.svg'),
                path.join(pathAssets, 'resources', 'icons', 'lang.svg'),
                path.join(pathAssets, 'resources', 'icons', 'notifications.svg'),
            ],
            'ui-sprite.svg',
            'ui-'
        );

        await ejsRenderer.renderMultipleFiles([
            { templateName: 'partials/head', data: { title: 'Заголовок страницы' }, outputFile: 'partials/head.html' },
            { templateName: 'blocks/block1', data: {}, outputFile: 'blocks/block1.html' },
            { templateName: 'blocks/block2', data: {}, outputFile: 'blocks/block2.html' },
            {
                templateName: 'layout',
                data: {
                    title: 'Заголовок страницы',
                    svgSprite: spriteContent,
                    headPartial: 'partials/head',
                    blocks: ['blocks/block1', 'blocks/block2'],
                },
                outputFile: 'layout.html',
            },
        ]);

        res.render('layout', {
            title: 'Заголовок страницы',
            svgSprite: spriteContent,
            headPartial: 'partials/head',
            blocks: ['blocks/block1', 'blocks/block2'],
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Ошибка сервера');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
