export function createProduct({
  name,
  unitPrice,
  price,
  category,
  description,
  image
}) {
  return {
    id: crypto.randomUUID(),
    name,
    unitPrice,
    price,
    category,
    description,
    image,
    dateCreated: new Date().toISOString()
  };
}
