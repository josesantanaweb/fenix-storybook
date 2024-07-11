
/**
 * Returns the appropriate Tailwind CSS classes for a given variant.
 *
 * This function maps a variant string to a corresponding set of Tailwind CSS classes.
 * If the provided variant does not match any of the predefined variants, an empty string is returned.
 *
 * @param {string} variant - The variant name for which to get the CSS classes.
 * @returns {string} - The Tailwind CSS classes associated with the given variant.
 */
export const getVariantClasses = (variantMappings: { [key: string]: string } ,variant: string) => {
  return `${variantMappings[variant] || ""}`.trim();
};
