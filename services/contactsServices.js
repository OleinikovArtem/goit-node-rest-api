import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    
    if (index === -1) {
      return null;
    }
    
    const removedContact = contacts[index];
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    
    return removedContact;
  } catch (error) {
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    
    // Generate a unique ID similar to existing IDs
    const generateId = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let id = "";
      for (let i = 0; i < 20; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    };
    
    const newContact = {
      id: generateId(),
      name,
      email,
      phone,
    };
    
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    
    return newContact;
  } catch (error) {
    throw error;
  }
}

async function updateContact(contactId, data) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    
    if (index === -1) {
      return null;
    }
    
    // Update only provided fields
    const updatedContact = {
      ...contacts[index],
      ...data,
    };
    
    contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    
    return updatedContact;
  } catch (error) {
    return null;
  }
}

export { listContacts, getContactById, removeContact, addContact, updateContact };