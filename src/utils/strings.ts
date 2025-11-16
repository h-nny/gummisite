export const slugify = (value: string = ''): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]|_/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-')
