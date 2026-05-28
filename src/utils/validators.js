// Malaysia-specific validators
// SSM Registration Number:
// - 12-digit unified number, e.g., 201901012345
// - Legacy ROC/ROB like 1234567-A or PG0329492-U
// - LLP like LLP0001234-LGN
export const MY_SSM_REGEX = /^(?:\d{12}|\d{1,7}-[A-Z]|[A-Z]{1,3}\d{6,9}-[A-Z]{1,3}|LLP\d{1,6}-[A-Z]{3})$/

// Malaysia mobile numbers (10-11 digits) with +60 or 0 prefix
export const MY_MOBILE_REGEX = /^(?:\+?60|0)1(?:0|1|2|3|4|6|7|8|9)\d{7,8}$/

// Generic helpers
export const createPatternRule = (pattern, message, trigger = 'blur') => ({ pattern, message, trigger })
export const requiredRule = (message, trigger = 'blur') => ({ required: true, message, trigger })


