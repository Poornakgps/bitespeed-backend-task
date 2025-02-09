const validateIdentifyRequest = (req, res, next) => {
    const { email, phoneNumber } = req.body;
  
    if (!email && !phoneNumber) {
      return res.status(400).json({
        error: "Either email or phoneNumber is required"
      });
    }
  
    if (email && typeof email !== 'string') {
      return res.status(400).json({
        error: "Email must be a string"
      });
    }
  
    if (phoneNumber && typeof phoneNumber !== 'string') {
      return res.status(400).json({
        error: "Phone number must be a string"
      });
    }
  
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format"
      });
    }
  
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        error: "Invalid phone number format"
      });
    }
  
    next();
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  module.exports = {
    validateIdentifyRequest
  };