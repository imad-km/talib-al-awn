const { translations } = require('./src/translations.js');

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const enKeys = getKeys(translations.en).sort();
const arKeys = getKeys(translations.ar).sort();

console.log('Keys in EN but not in AR:');
console.log(enKeys.filter(k => !arKeys.includes(k)));

console.log('Keys in AR but not in EN:');
console.log(arKeys.filter(k => !enKeys.includes(k)));
