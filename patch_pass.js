import fs from 'fs';
const content = fs.readFileSync('src/config/experienceConfig.ts', 'utf8');

const replacement = `
const SPECIAL_CODE = '3131';
const VALID_CODES = ['121112', '120711', '3130'];

export function verifyPasscode(input: string): 'simple' | 'special' | 'invalid' {
  const sanitized = input.trim();
  if (sanitized === SPECIAL_CODE) {
    return 'special';
  }
  if (VALID_CODES.includes(sanitized)) {
    return 'simple';
  }
  return 'invalid';
}
`;

const startIndex = content.indexOf('const SIMPLE_CODE');
const endIndex = content.indexOf('export const EXPERIENCE_CONFIG');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/config/experienceConfig.ts', newContent);
  console.log("Patched!");
} else {
  console.log("Could not find markers.");
}
