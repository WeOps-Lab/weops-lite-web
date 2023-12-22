const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const fse = require('fs-extra');

const projectsDir = path.join(__dirname, '../src/projects');

function findRouterConfigs(dir, isFirst, firstName) {
    const files = fs.readdirSync(dir);
    let routerConfigs = [];

    for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            routerConfigs = routerConfigs.concat(...findRouterConfigs(filePath, false, isFirst ? file : firstName));
        } else if (file === 'frameRouter.ts') {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const configPath = path.resolve(filePath, '../frameRouterConfig.js')
            const newContent = fileContent.replace(/export\s+const\s+(.*)\s+=\s+(.*)/g, 'const $1 = $2')
                           .replace(/\s*$/, ' \nmodule.exports = { frameRouter }');
            fs.writeFileSync(configPath, newContent, 'utf-8')  
            const config = require(configPath).frameRouter;
            const components = config.map(route => {
            const componentPath = route.component.toString().replace(/^.*\(\s*require\s*\(\s*'([^']+)'\s*\).*\).*$/, '$1');
            const regex = /import\(([^)]+)\)/g;
            const importValue = regex.exec(componentPath.toString())[1].replace(/'/g, '').replace(/"/g, '');
            return {
                    ...route,
                    component: componentPath.includes('@') ? importValue : path.resolve(path.dirname(filePath), importValue).replace(/.*\/src\//, '@/'),
                    project: isFirst ? file : firstName
                }
            });
            routerConfigs = routerConfigs.concat(components);
        }
    }

    return routerConfigs;
}

const allRouterConfigs = findRouterConfigs(projectsDir, true);
allRouterConfigs.forEach(item => {
    const options = {
        importName: item.name,
        importUrl: item.component
    }
    const _path = path.join(`./src/projects/${item.project}`, 'microService')
    const filePath = path.resolve(_path, `${item.name}.ts`)
    const htmlTplPath = path.resolve(__dirname, '../build/renderTemp.ts')
    const htmlTpl = fs.readFileSync(htmlTplPath, 'utf-8')
    const template = handlebars.compile(htmlTpl)
    const htmlString = template(options)
    fse.mkdirpSync(_path)
    fs.writeFileSync(filePath, htmlString, 'utf-8')  
})