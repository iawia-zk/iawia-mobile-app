export default function capitalizeName(firstName?: string, lastName?: string) {
  const name = `${firstName} ${lastName}`.trim();

  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
