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
    outputDir: path.join(pathAssets, 'resources', 'sprites'),
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
        const spritesContent = '';
        // const spritesContent = generatorSprites.generateAndGetContent(
        //     [
        //         path.join(pathAssets, 'resources', 'icons', 'sun.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'avatar.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'lang.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'notifications.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'hamburger.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'home.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'exchange.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'buy-crypto.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'activities.svg'),
        //         path.join(pathAssets, 'resources', 'icons', 'wallets.svg'),
        //     ],
        //     'sprites.svg',
        //     'icon-'
        // );

        const assets = [
            {
                id: 1,
                name: 'Bitcoin',
                symbol: 'BTC',
                icon: '/imgs/cryptoicons/btc.svg',
                price: '$105543.98',
                gain: '0.186%',
            },
            {
                id: 2,
                name: 'Ethereum',
                symbol: 'ETH',
                icon: '/imgs/cryptoicons/eth.svg',
                price: '$2541.49',
                gain: '-0.806%',
            },
            {
                id: 3,
                name: 'Tether',
                symbol: 'USDT',
                icon: '/imgs/cryptoicons/btc.svg',
                price: '$1.00',
                gain: '0.005%',
            },
            {
                id: 4,
                name: 'Binance Coin',
                symbol: 'BNB',
                icon: '/imgs/cryptoicons/eth.svg',
                price: '$312.45',
                gain: '-1.215%',
            },
            {
                id: 5,
                name: 'Ripple',
                symbol: 'XRP',
                icon: '/imgs/cryptoicons/btc.svg',
                price: '$0.74',
                gain: '2.03%',
            },
            {
                id: 6,
                name: 'Cardano',
                symbol: 'ADA',
                icon: '/imgs/cryptoicons/eth.svg',
                price: '$0.35',
                gain: '-0.92%',
            },
            {
                id: 7,
                name: 'Solana',
                symbol: 'SOL',
                icon: '/imgs/cryptoicons/btc.svg',
                price: '$24.16',
                gain: '1.54%',
            },
            {
                id: 8,
                name: 'Polkadot',
                symbol: 'DOT',
                icon: '/imgs/cryptoicons/eth.svg',
                price: '$5.18',
                gain: '-0.23%',
            },
            {
                id: 9,
                name: 'Litecoin',
                symbol: 'LTC',
                icon: '/imgs/cryptoicons/btc.svg',
                price: '$89.32',
                gain: '0.73%',
            },
            {
                id: 10,
                name: 'Dogecoin',
                symbol: 'DOGE',
                icon: '/imgs/cryptoicons/eth.svg',
                price: '$0.072',
                gain: '-2.45%',
            },
        ];

        const balances = {
            balancesList: [
                {
                    imgSrc: '/imgs/balance-b.svg',
                    imgAlt: 'Asset Balance icon',
                    title: 'Asset Balance',
                    cryptoAmount: '1.91450666 BTC',
                    fiatAmount: '~ 200967.35 $',
                },
                {
                    imgSrc: '/imgs/balance-a.svg',
                    imgAlt: 'Exchange Balance icon',
                    title: 'Exchange Balance',
                    cryptoAmount: '2.91450666 BTC',
                    fiatAmount: '~ 300967.35 $',
                },
            ],
        };

        const footerNavSections = [
            {
                title: 'About',
                links: [
                    { label: 'Fee Rate', href: 'fees' },
                    {
                        label: 'Careers',
                        href: 'https://docs.google.com/forms/d/1MWVL6ztsvlxUmt9k3mnKZ6VA9unHeh8Ux4PKx6LXK0I/viewform?edit_requested=true',
                        target: '_blank',
                    },
                ],
            },
            {
                title: 'Service',
                links: [{ label: 'Buy crypto', href: '../profile/buy-crypto' }],
            },
            {
                title: 'Legal',
                links: [
                    { label: 'AML&CFT', href: 'aml-kyc-policy', target: '_blank' },
                    { label: 'Privacy policy', href: 'privacy-notice', target: '_blank' },
                    { label: 'Terms of service', href: 'terms', target: '_blank' },
                ],
            },
            {
                title: 'Trade crypto',
                links: [
                    { label: 'BTC/USDT', href: '../trading?pair=BTC' },
                    { label: 'ETH/USDT', href: '../trading?pair=ETH' },
                    { label: 'BNB/USDT', href: '../trading?pair=BNB' },
                    { label: 'TRX/USDT', href: '../trading?pair=TRX' },
                ],
            },
            {
                title: 'Contact Us',
                links: [],
            },
        ];

        const mainMenu = {
            activeLabel: 'Home',
            menuItems: [
                { label: 'Home', href: '/home', icon: 'icon-home' },
                { label: 'Exchange', href: '/trading', icon: 'icon-exchange' },
                { label: 'Wallets', href: '/profile/wallet', icon: 'icon-wallets' },
                { label: 'Buy crypto', href: '/profile/buy-crypto', icon: 'icon-buy-crypto' },
                { label: 'Activities', href: '/profile/transactions', icon: 'icon-activities' },
            ],
        };

        const avatar = {
            avatarSrc: '/imgs/avatar.svg',
            avatarId: 'my_profile_photo',

            headerButtons: [{ icon: 'icon-sun' }, { icon: 'icon-lang' }],
        };

        const dataGeneral = {
            // для head
            title: 'Заголовок страницы',
            headPartial: 'partials/head',

            // для общего layout
            svgSprite: spritesContent ?? '',

            // для главного меню
            navMain: 'partials/main-nav',
            activeLabel: mainMenu.activeLabel,
            menuItems: mainMenu.menuItems,
            // avatarSrc: avatar.avatarSrc,
            // avatarId: avatar.avatarId,

            // для header
            headerButtons: avatar.headerButtons,
            // header: 'partials/header',
            header: 'partials/header-auth',

            // для footer
            footer: 'partials/footer',
            footerNavSections: footerNavSections,

            // Данные для баланса
            balancesList: balances.balancesList,

            // Данные для активов
            assets: assets,

            // список блоков для рендеринга
            blocks: ['partials/block-balance', 'partials/block-assets'],
        };

        await ejsRenderer.renderMultipleFiles([
            { templateName: 'partials/head', data: { title: 'Заголовок страницы' }, outputFile: 'partials/head.html' },
            // { templateName: 'blocks/block1', data: {}, outputFile: 'blocks/block1.html' },
            // { templateName: 'blocks/block2', data: {}, outputFile: 'blocks/block2.html' },
            {
                templateName: 'layout',
                data: dataGeneral,
                outputFile: 'layout.html',
            },
        ]);

        res.render('layout', dataGeneral);
    } catch (e) {
        console.error(e);
        res.status(500).send('Ошибка сервера');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
