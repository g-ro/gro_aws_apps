import Rest from 'connect-rest'

import { home } from './controllers/ui';
import { getAllContacts, getContact } from './controllers/api';

//ui routes init


const apiRoutes = (app) => {
    // rest init
    const restOptions = {
        context: '/api',
        logger: { file: 'rest.log', level: 'debug' },
        // domain: require('domain').create(),
    };
    const rest = Rest.create(restOptions)
    app.use(rest.processRequest());
    // route definitions
    rest.get('/contacts/:id', getContact);
    rest.get('/contacts', getAllContacts);
}

const uiRoutes = (app) => {
    app.get("/home", home);
}

export default (app) => {
    uiRoutes(app);
    apiRoutes(app);

}