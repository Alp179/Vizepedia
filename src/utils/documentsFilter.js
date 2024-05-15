import selectionDocumentRules from "./selectionDocumentRules";

// Bu fonksiyon, belirli bir başvuru ID'sine göre belgeleri filtreler
export function getDocumentsForSelections(userSelections) {
  if (!userSelections || !userSelections.length) {
    console.error("No selections found for the specified ID.");
    return [];
  }

  let requiredDocuments = new Set([...selectionDocumentRules.all]); // Herkes için gerekli olan belgeleri ekleyin

  // Kullanıcı seçimlerine göre ek belgeleri belirleyin
  userSelections.forEach((selection) => {
    Object.entries(selection).forEach(([key, value]) => {
      const selectionKey = key.replace("ans_", ""); // 'ans_country' gibi bir anahtarı 'country' olarak düzeltilir

      if (
        selectionDocumentRules[selectionKey] &&
        selectionDocumentRules[selectionKey][value]
      ) {
        selectionDocumentRules[selectionKey][value].forEach((document) =>
          requiredDocuments.add(document)
        );
      }
    });
  });

  return Array.from(requiredDocuments); // Set'i diziye dönüştürüp döndürün
}
