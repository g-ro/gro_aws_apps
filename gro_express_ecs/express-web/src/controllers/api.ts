import * as addressServices from '../services/address-services';

export const getAllContacts = (req, content) => {
    return addressServices.getAllContacts()
}

export const getContact = (req, content) => {
    var id = decodeURI(req.params.id);
    return addressServices.getContact(id);
}

