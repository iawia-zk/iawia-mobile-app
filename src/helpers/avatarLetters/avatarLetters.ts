function getAvatarLetters(name: string = '') {
  const fullNameLetters = name.trim().split(' ');
  const firstLetter = fullNameLetters[0]?.[0];
  const hasSecondLetter = fullNameLetters.length > 1;
  const lastLetter = hasSecondLetter ? fullNameLetters[fullNameLetters.length - 1]?.[0] : '';
  return `${firstLetter}${lastLetter}`.toUpperCase();
}

export default getAvatarLetters;
