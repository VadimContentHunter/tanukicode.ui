import fs from 'fs';
import path from 'path';

/**
 * Опции генератора SVG-спрайтов.
 */
interface SvgSpriteGeneratorOptions {
    /**
     * Папка, в которую будет сохраняться сгенерированный спрайт.
     */
    outputDir: string;

    /**
     * ViewBox по умолчанию, если он отсутствует в SVG-файле.
     * По умолчанию: "0 0 24 24".
     */
    fallbackViewBox?: string;
}

/**
 * Класс для генерации SVG-спрайтов из отдельных SVG-файлов.
 * Полезен для объединения и оптимизации иконок.
 */
export class SvgSpriteGenerator {
    private outputDir: string;
    private fallbackViewBox: string;

    constructor(options: SvgSpriteGeneratorOptions) {
        this.outputDir = path.resolve(options.outputDir);
        this.fallbackViewBox = options.fallbackViewBox || '0 0 24 24';
    }

    /**
     * Генерация SVG-спрайта из списка SVG-файлов.
     *
     * @param svgPaths - массив путей к SVG-файлам
     * @param spriteName - имя выходного файла (например, "icons.svg")
     * @param prefix - префикс для ID в `<symbol>` (например, "ui-" → `<symbol id="ui-alert">`)
     * @returns Полный путь к созданному файлу спрайта или `null`, если не удалось сгенерировать
     */
    public generateSpriteFromFiles(svgPaths: string[], spriteName: string, prefix: string = ''): string | null {
        if (svgPaths.length === 0) {
            console.warn('⚠️ Пустой список файлов для генерации спрайта');
            return null;
        }

        const usedIds = new Set<string>();
        const symbols = svgPaths
            .map((svgPath) => {
                const resolvedPath = path.resolve(svgPath);
                if (!fs.existsSync(resolvedPath)) {
                    console.warn(`⚠️ Файл не найден: ${resolvedPath}`);
                    return null;
                }

                let content = fs.readFileSync(resolvedPath, 'utf-8');
                content = this.patchFillAttributes(content);
                const baseName = path.basename(resolvedPath, '.svg');
                let id = prefix + baseName;

                // Уникализируем ID
                let counter = 2;
                while (usedIds.has(id)) {
                    id = `${prefix}${baseName}-${counter++}`;
                }
                usedIds.add(id);

                const viewBox = this.extractViewBox(content) || this.fallbackViewBox;
                const inner = this.extractSvgContent(content);

                return `<symbol id="${id}" viewBox="${viewBox}" fill="inherit">${inner}</symbol>`;
            })
            .filter(Boolean);

        const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none">\n${symbols.join('\n')}\n</svg>`;

        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        const outFile = path.join(this.outputDir, spriteName);
        fs.writeFileSync(outFile, spriteContent, 'utf-8');
        console.log(`✅ Спрайт "${spriteName}" успешно сгенерирован: ${outFile}`);

        return outFile;
    }

    /**
     * Генерация спрайта и возврат его содержимого.
     *
     * @param svgPaths - массив путей к SVG-файлам
     * @param spriteName - имя выходного файла
     * @param prefix - префикс для ID в `<symbol>`
     * @returns Строка с содержимым SVG-спрайта или `null`, если не удалось
     */
    public generateAndGetContent(svgPaths: string[], spriteName: string, prefix: string = ''): string | null {
        const outPath = this.generateSpriteFromFiles(svgPaths, spriteName, prefix);
        if (!outPath || !fs.existsSync(outPath)) return null;

        return fs.readFileSync(outPath, 'utf-8');
    }

    /**
     * Возвращает путь к существующему спрайту или `null`, если файла нет.
     *
     * @param spriteName - имя файла спрайта
     * @returns Абсолютный путь или `null`
     */
    public getSpritePath(spriteName: string): string | null {
        const outFile = path.join(this.outputDir, spriteName);
        return fs.existsSync(outFile) ? outFile : null;
    }

    /**
     * Возвращает содержимое ранее сгенерированного спрайта, если он существует.
     *
     * @param spriteName - имя файла спрайта
     * @returns Содержимое файла или `null`, если он не найден
     */
    public getSpriteContent(spriteName: string): string | null {
        const outFile = this.getSpritePath(spriteName);
        return outFile ? fs.readFileSync(outFile, 'utf-8') : null;
    }

    private patchFillAttributes(svg: string): string {
        return svg.replace(/(<path[^>]*?)\sfill=(["'])(?!none)(#[^"']+|[a-zA-Z]+)\2/gi, '$1 fill="inherit"');
    }

    /**
     * Извлекает содержимое SVG без тега <svg>.
     *
     * @param svg - строка SVG-файла
     * @returns Внутреннее содержимое SVG
     */
    private extractSvgContent(svg: string): string {
        return svg
            .replace(/<svg[^>]*>/i, '')
            .replace(/<\/svg>/i, '')
            .trim();
    }

    /**
     * Извлекает значение атрибута viewBox из SVG.
     *
     * @param svg - строка SVG-файла
     * @returns Значение viewBox или `null`, если не найден
     */
    private extractViewBox(svg: string): string | null {
        const match = svg.match(/viewBox="([\d\s.-]+)"/i);
        return match?.[1] ?? null;
    }
}
