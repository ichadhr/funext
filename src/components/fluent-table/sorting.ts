// No Item import needed here anymore

// Helper function to get nested value from object using dot notation
export const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key: string) => {
    return (current && typeof current === 'object' && key in current) ? (current as Record<string, unknown>)[key] : undefined;
  }, obj);
};

// Helper function to extract sortable value from complex objects
export const extractSortableValue = (value: unknown): string | number | boolean => {
  if (value === null || value === undefined) return '';

  // If it's already a primitive, return it
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  // If it's an object with a label property, use the label
  if (typeof value === 'object' && 'label' in value && typeof value.label === 'string') {
    return value.label;
  }

  // If it's an object with a timestamp property, use the timestamp for better sorting
  if (typeof value === 'object' && 'timestamp' in value && typeof value.timestamp === 'number') {
    return value.timestamp;
  }

  // Fall back to string representation
  return String(value);
};

// Automatic comparison function generator
export const createAutoCompare = <T extends Record<string, unknown>>(columnId: string, accessorKey?: string) => {
  return (a: T, b: T): number => {
    const path = accessorKey || columnId;

    const valA = getNestedValue(a, path);
    const valB = getNestedValue(b, path);

    // Extract sortable values
    const sortableA = extractSortableValue(valA);
    const sortableB = extractSortableValue(valB);

    // Handle string comparison with locale support
    if (typeof sortableA === 'string' && typeof sortableB === 'string') {
      return sortableA.localeCompare(sortableB);
    }

    // Handle numeric comparison
    if (typeof sortableA === 'number' && typeof sortableB === 'number') {
      return sortableA - sortableB;
    }

    // Handle boolean comparison
    if (typeof sortableA === 'boolean' && typeof sortableB === 'boolean') {
      return sortableA === sortableB ? 0 : sortableA ? 1 : -1;
    }

    // Mixed type comparison - convert to strings
    const stringA = String(sortableA);
    const stringB = String(sortableB);
    return stringA.localeCompare(stringB);
  };
};