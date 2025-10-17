/**
 * Utilitaires pour l'export de données en CSV
 */

/**
 * Convertit un tableau d'objets en CSV
 */
export const convertToCSV = (
  data: any[],
  headers: { key: string; label: string }[]
): string => {
  if (data.length === 0) return "";

  // En-têtes
  const headerRow = headers.map((h) => `"${h.label}"`).join(",");

  // Données
  const dataRows = data
    .map((row) => {
      return headers
        .map((h) => {
          const value = row[h.key];
          // Gérer les valeurs null/undefined
          if (value === null || value === undefined) return '""';
          // Gérer les dates
          if (value instanceof Date)
            return `"${value.toLocaleDateString("fr-TN")}"`;
          // Gérer les objets
          if (typeof value === "object") return `"${JSON.stringify(value)}"`;
          // Échapper les guillemets dans les chaînes
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
    })
    .join("\n");

  return `${headerRow}\n${dataRows}`;
};

/**
 * Télécharge un fichier CSV
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const BOM = "\uFEFF"; // UTF-8 BOM pour Excel
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Exporte des données en CSV
 */
export const exportToCSV = (
  data: any[],
  headers: { key: string; label: string }[],
  filename: string
): void => {
  const csv = convertToCSV(data, headers);
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `${filename}_${timestamp}.csv`);
};

/**
 * Formate une date pour l'export
 */
export const formatDateForExport = (date: string | Date): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-TN");
};

/**
 * Formate un montant pour l'export
 */
export const formatAmountForExport = (amount: number): string => {
  return amount.toFixed(2) + " TND";
};

/**
 * Formate un kilométrage pour l'export
 */
export const formatMileageForExport = (mileage: number): string => {
  return mileage.toLocaleString("fr-TN") + " km";
};
