const { Contact } = require('../models');
const { Op } = require('sequelize');

class ContactController {
  static async identify(req, res) {
    const { email, phoneNumber } = req.body;

    try {
      if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phoneNumber is required" });
      }

      const existingContacts = await Contact.findAll({
        where: {
          [Op.or]: [
            ...(email ? [{ email }] : []),
            ...(phoneNumber ? [{ phoneNumber }] : [])
          ]
        },
        order: [['createdAt', 'ASC']]
      });

      if (existingContacts.length === 0) {
        const newContact = await Contact.create({
          email,
          phoneNumber,
          linkPrecedence: "primary"
        });

        return res.json({
          contact: {
            primaryContactId: newContact.id,
            emails: email ? [email] : [],
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
            secondaryContactIds: []
          }
        });
      }

      const allRelatedContacts = await ContactController.findAllRelatedContacts(existingContacts);

      const primaryContact = allRelatedContacts.reduce((oldest, current) => 
        oldest.createdAt < current.createdAt ? oldest : current
      );

      const existingEntry = await Contact.findOne({
        where: {
          email: email || null,
          phoneNumber: phoneNumber || null
        }
      });

      if (!existingEntry) {
        await Contact.create({
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary"
        });

        allRelatedContacts.push(await Contact.findOne({
          where: { email, phoneNumber },
          order: [['createdAt', 'DESC']]
        }));
      }

      await ContactController.consolidateContacts(primaryContact.id, allRelatedContacts);

      const response = await ContactController.formatResponse(primaryContact.id);
      return res.json(response);

    } catch (error) {
      console.error('Error in identify:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async findAllRelatedContacts(initialContacts) {
    const visited = new Set();
    const allRelated = [];
    const toVisit = [...initialContacts];

    while (toVisit.length > 0) {
      const contact = toVisit.pop();

      if (visited.has(contact.id)) continue;
      visited.add(contact.id);
      allRelated.push(contact);

      const relatedContacts = await Contact.findAll({
        where: {
          [Op.or]: [
            ...(contact.email ? [{ email: contact.email }] : []),
            ...(contact.phoneNumber ? [{ phoneNumber: contact.phoneNumber }] : []),
            { linkedId: contact.id },
            { id: contact.linkedId }
          ]
        }
      });

      toVisit.push(...relatedContacts);
    }

    return allRelated;
  }

  static async consolidateContacts(primaryId, allContacts) {
    const updatePromises = allContacts
      .filter(contact => contact.id !== primaryId && (contact.linkPrecedence === 'primary' || contact.linkedId !== primaryId))
      .map(contact =>
        Contact.update(
          {
            linkPrecedence: 'secondary',
            linkedId: primaryId
          },
          {
            where: { id: contact.id }
          }
        )
      );

    await Promise.all(updatePromises);
  }

  static async formatResponse(primaryId) {
    const allContacts = await Contact.findAll({
      where: {
        [Op.or]: [
          { id: primaryId },
          { linkedId: primaryId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    const primaryContact = allContacts.find(c => c.id === primaryId);
    const secondaryContacts = allContacts.filter(c => c.id !== primaryId);

    const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))];

    return {
      contact: {
        primaryContactId: primaryId,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryContacts.map(c => c.id)
      }
    };
  }
}

module.exports = ContactController;
