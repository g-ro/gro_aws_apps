import * as addressServices from '../services/address-services';


export const mirror = (req, res) => {
    res.json(req.query);
};


export const home = (req, res) => {
    res.render('home/home', { addresses: addressServices.getAllContacts() });
    // optionally add , { layout: 'plain' } should you chose to use another Layout
}
