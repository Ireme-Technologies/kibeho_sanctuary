/** Correct known CMS misspellings without waiting for a re-seed. */
const TITLE_FIXES = [
  [/magnicicat/gi, 'Magnificat'],
  [/\bVh Hotel\b/gi, 'MV Hotel'],
]

export function displayFacilityName(title) {
  return TITLE_FIXES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), String(title || ''))
}
