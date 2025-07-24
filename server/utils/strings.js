export const validateEmailSubject = (subject) => {
  // Check if subject is a string
  if (typeof subject !== 'string') {
    return { isValid: false, error: 'Subject must be a string' }
  }

  // Check length (typical email clients limit subjects to 78-998 characters)
  if (subject.length === 0) {
    return { isValid: false, error: 'Subject cannot be empty' }
  }

  if (subject.length > 998) {
    return { isValid: false, error: 'Subject too long (max 998 characters)' }
  }

  // Check for prohibited characters (control characters except tab)
  const hasControlChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(subject)
  if (hasControlChars) {
    return { isValid: false, error: 'Subject contains invalid control characters' }
  }

  // Check for leading/trailing whitespace (optional - you might want to allow this)
  if (subject.trim() !== subject) {
    return { isValid: false, error: 'Subject has leading or trailing whitespace' }
  }

  return { isValid: true }
}

// Usage examples:
console.log(validateEmailSubject('Hello World')) // { isValid: true }
console.log(validateEmailSubject('')) // { isValid: false, error: 'Subject cannot be empty' }
console.log(validateEmailSubject('  Hello  ')) // { isValid: false, error: 'Subject has leading or trailing whitespace' }
