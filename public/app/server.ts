import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
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
const pathConfig = path.join(__projectRoot, 'configs');
const pathLangs = path.join(__projectRoot, 'langs');
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

app.get('/api/set-language', async (req: Request, res: Response) => {
    const lang = req.query['lang'] as string;
    let page = req.query['page'] as string;

    if (!lang || !page) {
        res.status(400).json({ error: 'Missing lang or page parameter' });
        return;
    }

    // Нормализуем page (например, '/' -> 'index', '/about' -> 'about')
    if (page === '/') page = 'index';
    else page = page.replace(/^\//, '').replace(/\//g, '_'); // например для '/my/about' -> 'my_about'

    try {
        const filePath = path.join(pathLangs, `${page}.json`);
        const file = await fs.promises.readFile(filePath, 'utf-8');
        const translations = JSON.parse(file);

        const pageTranslations = translations[page];
        if (!pageTranslations) {
            res.status(404).json({ error: 'Page not found in translation file' });
            return;
        }

        const langTranslations = pageTranslations[lang];
        if (!langTranslations) {
            res.status(404).json({ error: 'Language not found in translation file' });
            return;
        }

        res.json({
            [page]: {
                [lang]: langTranslations,
            },
        });
    } catch (error) {
        console.error('Error reading translation file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/signin', async (req, res) => {
    const jsonData = fs.readFileSync(path.join(pathConfig, 'singInUp.json'), 'utf-8');
    const singInUp = JSON.parse(jsonData);

    const spritesContent = '';
    const dataGeneral = {
        // для head
        title: 'Заголовок страницы',
        headScripts: ['/js/applyLanguageContent.js', '/js/setupLanguageSwitcher.js', '/js/new/ToggleMenu.js'],
        headPartial: 'partials/head-auth',

        // для Спрайтов
        svgSprite: spritesContent ?? '',

        modalLang: 'partials/modals/modal-header-lang',

        // для signin
        mainText: singInUp.singInTitle,
        titleForm: singInUp.singInTitleForm,

        // форма для signin
        blockForm: 'partials/signin-form',

        // scripts
        bodyScripts: ['/js/main-auth.js'],
    };

    await ejsRenderer.renderMultipleFiles([
        {
            templateName: 'authorization',
            data: dataGeneral,
            outputFile: 'signin.html',
        },
    ]);

    res.render('authorization', dataGeneral);
});

app.get('/signup', async (req, res) => {
    const jsonData = fs.readFileSync(path.join(pathConfig, 'singInUp.json'), 'utf-8');
    const singInUp = JSON.parse(jsonData);

    const spritesContent = '';
    const dataGeneral = {
        // для head
        title: 'Заголовок страницы',
        headScripts: ['/js/applyLanguageContent.js', '/js/setupLanguageSwitcher.js', '/js/new/ToggleMenu.js'],
        headPartial: 'partials/head-auth',

        // для Спрайтов
        svgSprite: spritesContent ?? '',

        modalLang: 'partials/modals/modal-header-lang',

        // для signup
        mainText: singInUp.singUpTitle,
        titleForm: singInUp.singUpTitleForm,

        // форма для signup
        blockForm: 'partials/signup-form',

        // scripts
        bodyScripts: ['/js/main-auth.js'],
    };

    await ejsRenderer.renderMultipleFiles([
        {
            templateName: 'authorization',
            data: dataGeneral,
            outputFile: 'signup.html',
        },
    ]);

    res.render('authorization', dataGeneral);
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

        let jsonData = fs.readFileSync(path.join(pathConfig, 'profileSettingsData.json'), 'utf-8');
        const profileSettingsData = JSON.parse(jsonData);

        jsonData = fs.readFileSync(path.join(pathConfig, 'profileMenuItems.json'), 'utf-8');
        const profileMenuItems = JSON.parse(jsonData);

        jsonData = fs.readFileSync(path.join(pathConfig, 'assets.json'), 'utf-8');
        const assets = JSON.parse(jsonData);

        jsonData = fs.readFileSync(path.join(pathConfig, 'balances.json'), 'utf-8');
        const balances = JSON.parse(jsonData);

        jsonData = fs.readFileSync(path.join(pathConfig, 'footerNavSections.json'), 'utf-8');
        const footerNavSections = JSON.parse(jsonData);

        jsonData = fs.readFileSync(path.join(pathConfig, 'mainMenu.json'), 'utf-8');
        const mainMenu = JSON.parse(jsonData);

        jsonData = fs.readFileSync(path.join(pathConfig, 'avatar.json'), 'utf-8');
        const avatar = JSON.parse(jsonData);

        const dataGeneral = {
            // для head
            title: 'Заголовок страницы',
            headScripts: [
                '/js/toggleDisplay.js',
                '/js/hideOnOutsideClick.js',
                '/js/setupProfileNavigation.js',
                '/js/applyLanguageContent.js',
                '/js/setupLanguageSwitcher.js',
                '/js/setupResponsiveToggleClick.js',
                '/js/setupCustomSelect.js',

                '/js/new/ProfileMenuToggle.js',
                '/js/new/ToggleMenu.js',
            ],
            headPartial: 'partials/head',

            // для модальных оберток
            profileMenuItems: profileMenuItems,
            profileSettingsData: profileSettingsData,

            modals: [
                { class: 'modal-profile-menu', name: 'modal-header-menu' },
                { class: 'modal-profile-settings', name: 'modal-profile-settings', id: 'modal-account-setting' },
                { class: 'modal-header-lang', name: 'modal-header-lang' },
                { class: 'modal-profile-settings', name: 'modal-voucher', id: 'modal-voucher' },
            ],
            modalWrappers: 'partials/modals/modal-wrappers',

            // для Спрайтов
            svgSprite: spritesContent ?? '',

            // для главного меню
            navMain: 'partials/main-nav',
            activeLabel: mainMenu.activeLabel,
            menuItems: mainMenu.menuItems,

            // для header
            avatarSrc: avatar.avatarSrc,
            avatarId: avatar.avatarId,
            headerButtons: avatar.headerButtons,
            header: 'partials/header',
            // header: 'partials/header-auth',

            // для footer
            footer: 'partials/footer',
            footerNavSections: footerNavSections,

            // Данные для баланса
            balancesList: balances.balancesList,

            // Данные для активов
            assets: assets,

            // список блоков для рендеринга
            blocks: [
                'partials/blocks/block-balance',
                'partials/blocks/block-carousel',
                'partials/blocks/block-assets',
                'partials/blocks/block-information',
                'partials/blocks/block-advantages',
            ],

            // scripts
            bodyScripts: ['/js/main-new.js'],
        };

        const tab_2fa = profileSettingsData.tabs[3].data;
        const tab_account = profileSettingsData.tabs[0].data;
        const tab_id = profileSettingsData.tabs[4].data;
        const tab_password = profileSettingsData.tabs[2].data;
        const tab_referrals = profileSettingsData.tabs[1].data;

        await ejsRenderer.renderMultipleFiles([
            { templateName: 'partials/head', data: dataGeneral, outputFile: 'partials/head.html' },
            { templateName: 'partials/head-auth', data: dataGeneral, outputFile: 'partials/head-auth.html' },
            { templateName: 'partials/modals/modal-wrappers', data: dataGeneral, outputFile: 'partials/modals/modal-wrappers.html' },
            { templateName: 'partials/main-nav', data: dataGeneral, outputFile: 'partials/main-nav.html' },
            { templateName: 'partials/header', data: dataGeneral, outputFile: 'partials/header.html' },
            { templateName: 'partials/header-auth', data: dataGeneral, outputFile: 'partials/header-auth.html' },
            { templateName: 'partials/modals/modal-header-menu', data: dataGeneral, outputFile: 'partials/modals/modal-header-menu.html' },
            { templateName: 'partials/modals/modal-header-lang', data: dataGeneral, outputFile: 'partials/modals/modal-header-lang.html' },
            { templateName: 'partials/modals/modal-voucher', data: dataGeneral, outputFile: 'partials/modals/modal-voucher.html' },
            {
                templateName: 'partials/modals/modal-profile-settings',
                data: dataGeneral,
                outputFile: 'partials/modals/modal-profile-settings.html',
            },
            { templateName: 'partials/footer', data: dataGeneral, outputFile: 'partials/footer.html' },

            { templateName: 'partials/blocks/block-balance', data: dataGeneral, outputFile: 'partials/blocks/block-balance.html' },
            { templateName: 'partials/blocks/block-assets', data: dataGeneral, outputFile: 'partials/blocks/block-assets.html' },
            { templateName: 'partials/blocks/block-carousel', data: dataGeneral, outputFile: 'partials/blocks/block-carousel.html' },
            { templateName: 'partials/blocks/block-information', data: dataGeneral, outputFile: 'partials/blocks/block-information.html' },
            { templateName: 'partials/blocks/block-advantages', data: dataGeneral, outputFile: 'partials/blocks/block-advantages.html' },

            {
                templateName: 'partials/profile-settings/2fa-setting',
                data: tab_2fa,
                outputFile: 'partials/profile-settings/2fa-setting.html',
            },
            {
                templateName: 'partials/profile-settings/account-setting',
                data: tab_account,
                outputFile: 'partials/profile-settings/account-setting.html',
            },
            {
                templateName: 'partials/profile-settings/id-setting',
                data: tab_id,
                outputFile: 'partials/profile-settings/id-setting.html',
            },
            {
                templateName: 'partials/profile-settings/password-setting',
                data: tab_password,
                outputFile: 'partials/profile-settings/password-setting.html',
            },
            {
                templateName: 'partials/profile-settings/referrals-setting',
                data: tab_referrals,
                outputFile: 'partials/profile-settings/referrals-setting.html',
            },
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
