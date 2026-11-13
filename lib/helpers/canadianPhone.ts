// Canadian / North American numbers: (780) 555-1234
export const formatCanadianPhone = (raw: string) => {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("1")) digits = digits.slice(1); // drop the +1 country code
  digits = digits.slice(0, 10);
  if (digits.length < 4) return digits.length ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// 10 digits; area code and exchange cannot start with 0 or 1
export const isValidCanadianPhone = (value: string) =>
  /^[2-9]\d{2}[2-9]\d{6}$/.test(value.replace(/\D/g, ""));
