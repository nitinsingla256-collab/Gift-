import fs from 'fs';
const content = fs.readFileSync('src/components/EditorialMemoryExperience.tsx', 'utf8');

const startMarker = "{section === 'shayari_section' && (";
const startIndex = content.indexOf(startMarker);

let endIndex = content.indexOf("{/*", startIndex + startMarker.length);
while(endIndex !== -1 && !content.substring(endIndex, endIndex + 200).includes("SECTION 3: SPECIAL NOTE")) {
  endIndex = content.indexOf("{/*", endIndex + 1);
}

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{section === 'shayari_section' && (
        <CinematicShayariSequence onComplete={() => setSection('special_note')} />
      )}

      `;
  
  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/components/EditorialMemoryExperience.tsx', newContent);
  console.log("Patch applied successfully!");
} else {
  console.log("Could not find markers.", startIndex, endIndex);
}
