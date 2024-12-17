import Dashboard from './dashboard/dashboard'
import Shape from './shapes/index'
import {shapeReducer} from './shapes/duck'
import Theme from './themes/index'
import {themeReducer} from './themes/duck'


// Reducers do projeto
export const reducers = {
    shape: shapeReducer,
    theme: themeReducer 
}

// Rotas do projeto
export const routes = [
    { exact: true, path: '/', component: Dashboard },
    { exact: true, path: '/shapes', component: Shape },
    { exact: true, path: '/themes', component: Theme },
]

// Menu do projeto
export const menu = {
    '/': { title: 'Dashboard', icon: 'dashboard' },
    '/shapes': { title: 'Shapes', icon: 'dashboard' },
    '/themes': { title: 'Temas', icon: 'dashboard' },
    // 'profiles': {
    //     title: 'Perfis', icon: 'users',
        //Exemplo de menu cascateado
        // children: {
        //     '/permissions': { title: 'Permissões', icon: 'user' },
        // }
    // }
}