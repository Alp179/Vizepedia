import selectionDocumentRules from "./selectionDocumentRules";

// Bu fonksiyon, belirli bir başvuru ID'sine göre belgeleri filtreler
export function getDocumentsForSelections(userSelections) {
  if (!userSelections || !userSelections.length) {
    console.error("No selections found for the specified ID.");
    return [];
  }

  let requiredDocuments = new Set([...selectionDocumentRules.all]); // Genel belgeleri ekle

  userSelections.forEach((selection) => {
    Object.entries(selection).forEach(([key, value]) => {
      const selectionKey = key.replace("ans_", ""); // 'ans_country' -> 'country'
      if (
        selectionDocumentRules[selectionKey] &&
        selectionDocumentRules[selectionKey][value]
      ) {
        selectionDocumentRules[selectionKey][value].forEach((doc) =>
          requiredDocuments.add(doc)
        );
      }
    });

    // Kombinasyon kontrolü
    selectionDocumentRules.combinations.forEach((combination) => {
      if (
        selection.ans_country === combination.country &&
        selection.ans_purpose === combination.purpose
      ) {
        combination.documents.forEach((doc) => requiredDocuments.add(doc));
      }
    });
  });

  return Array.from(requiredDocuments); // Set'i diziye dönüştür
}
