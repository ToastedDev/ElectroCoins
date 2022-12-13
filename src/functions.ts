export function addCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.toLowerCase().slice(1).replace(/_/gi, " ");
}

export function unabbreviate(num: string) {
  var base = parseInt(num);
  if (num.toLowerCase().match(/k/)) return Math.round(base * 1000);
  else if (num.toLowerCase().match(/m/)) return Math.round(base * 1000000);
  else if (num.toLowerCase().match(/b/)) return Math.round(base * 1000000000);
  else return base;
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
