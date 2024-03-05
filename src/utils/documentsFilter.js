import selectionDocumentRules from "./selectionDocumentRules";

export function getDocumentsForSelections(userSelections) {
  let requiredDocuments = new Set([...selectionDocumentRules.all]); // Herkes için gerekli olan belgeleri ekleyin

  // Kullanıcı seçimlerine göre ek belgeleri belirleyin
  Object.entries(userSelections).forEach(([key, value]) => {
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

  return Array.from(requiredDocuments); // Set'i diziye dönüştürüp döndürün
}
