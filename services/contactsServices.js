import Contact from "../models/Contact.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (userId, query) => {
  const { page = 1, limit = 20, favorite } = query;
  const offset = (page - 1) * limit;

  const where = { owner: userId };
  if (favorite !== undefined) {
    where.favorite = favorite === "true";
  }

  const { count, rows } = await Contact.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    contacts: rows,
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

const getOneContact = async (contactId, userId) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });

  if (!contact) {
    throw HttpError(404, "Not found");
  }

  return contact;
};

const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });

  if (!contact) {
    throw HttpError(404, "Not found");
  }

  await contact.destroy();
  return contact;
};

const createContact = async (data, userId) => {
  const contact = await Contact.create({
    ...data,
    owner: userId,
  });

  return contact;
};

const updateContact = async (contactId, userId, data) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });

  if (!contact) {
    throw HttpError(404, "Not found");
  }

  await contact.update(data);
  return contact;
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};

