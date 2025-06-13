import path from 'path';
import fs from 'fs/promises';
import ejs from 'ejs';

export class EjsRenderer {
    private viewsDir: string;
    private outputDir: string;

    constructor(viewsDir: string, outputDir: string) {
        this.viewsDir = viewsDir;
        this.outputDir = outputDir;
    }

    // Рендер одного файла и сохраняет в outputDir + относительный путь outputFile
    async renderToFile(templateName: string, data: object, outputFile: string) {
        const templatePath = path.join(this.viewsDir, templateName + '.ejs');
        const html = await ejs.renderFile(templatePath, data, { async: true, root: this.viewsDir });

        const fullOutputPath = path.join(this.outputDir, outputFile);
        await fs.mkdir(path.dirname(fullOutputPath), { recursive: true });
        await fs.writeFile(fullOutputPath, html, 'utf-8');
        console.log(`Rendered and saved: ${fullOutputPath}`);
    }

    // Рендер и сохранение нескольких файлов
    async renderMultipleFiles(files: Array<{ templateName: string; data: object; outputFile: string }>) {
        for (const file of files) {
            await this.renderToFile(file.templateName, file.data, file.outputFile);
        }
    }
}
