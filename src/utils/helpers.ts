export const isIsoDate = (dateString: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date) && date.toISOString() === dateString;
}

type TypeErrorObject = {field: string, message: string};

export const showError = (field: string, message:string): TypeErrorObject=> ({field, message});
