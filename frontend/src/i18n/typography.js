/**
 * French typography: accents are kept on lowercase letters, but they are not
 * required on capitals. Menus/eyebrows use CSS uppercase, so those labels are
 * shown without diacritics. Sentence-case titles only drop the accent on an
 * already-capital letter (Églises → Eglises, Pèlerinage stays Pèlerinage).
 */

const UPPER_UNACCENTED = {
  À: 'A',
  Á: 'A',
  Â: 'A',
  Ã: 'A',
  Ä: 'A',
  Å: 'A',
  Ç: 'C',
  È: 'E',
  É: 'E',
  Ê: 'E',
  Ë: 'E',
  Ì: 'I',
  Í: 'I',
  Î: 'I',
  Ï: 'I',
  Ñ: 'N',
  Ò: 'O',
  Ó: 'O',
  Ô: 'O',
  Õ: 'O',
  Ö: 'O',
  Ù: 'U',
  Ú: 'U',
  Û: 'U',
  Ü: 'U',
  Ý: 'Y',
  Ÿ: 'Y',
  Æ: 'AE',
  Œ: 'OE',
}

export function stripDiacritics(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/æ/gi, (ch) => (ch === 'Æ' ? 'AE' : 'ae'))
    .replace(/œ/gi, (ch) => (ch === 'Œ' ? 'OE' : 'oe'))
}

export function withoutAccentsOnCapitals(text) {
  return String(text ?? '').replace(/[À-ŸÆŒ]/g, (ch) => UPPER_UNACCENTED[ch] || ch)
}

export function displayCapsLabel(text, locale) {
  if (locale !== 'fr') return text
  return stripDiacritics(text)
}

export function displayTitleLabel(text, locale) {
  if (locale !== 'fr') return text
  return withoutAccentsOnCapitals(text)
}
