function addCommas(nStr) {
  const localN = nStr.toFixed(0).toString();
  const x = localN.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1,$2');
  }
  return x1 + x2;
}

export const formatNumber = value => {
  if (value > 1000000) {
    return `${+(value / 1000000).toFixed(2)} mil`;
  }

  return addCommas(value);
};
