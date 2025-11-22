import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.getAllContacts(req.user.id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getOneContact(id, req.user.id);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    await contactsService.deleteContact(id, req.user.id);
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactsService.createContact(req.body, req.user.id);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.updateContact(
      id,
      req.user.id,
      req.body
    );
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
