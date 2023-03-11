import db from "../file-db.json";

const memDB = db.entities;

export const getAllContacts = () => {
  const contact = memDB.find((e) => e.name === "contact");
  const allContacts = contact.data.map((record) => ({ ...record }));
  return allContacts;
};

export const getContact = (id) => {
  const contact = memDB.find((e) => e.name === "contact");
  const result = contact.data.find((rec) => rec["id"] === id);
  return { ...result };
};
