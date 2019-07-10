import { getCalculationProcessors } from "./processor";
import { loadAllItems } from "./items";

export function bestCharge(input) {


}

export function chooseBestCharge(charges) {
  let bestCharge = charges[charges.length - 1];
  charges.forEach(charge => {
    if (charge.total < bestCharge.total) {
      bestCharge = charge;
    }
  });

  return bestCharge;
}

export function transformInputStringsToItems(input) {
  const itemPool = loadAllItems();

  return parseInput(input).map(({ barcode, count }) => {
    const selectedItem = selectItemFromItemPool(barcode, itemPool);
    return selectedItem ? { ...selectedItem, count } : undefined;
  }).filter(item => item !== undefined);
}

export function calculateChargesWithAllPromotionStrategies(items) {
  const promotionWithProcessors = getCalculationProcessors();
  return promotionWithProcessors.map(processor => processor(items))
}

function selectItemFromItemPool(barcode, itemPool) {
  return itemPool.find(({ id }) => id === barcode);
}

function parseInput(input) {
  const SEPARATOR = 'x';

  return input.map(inputString => {
    const barcodeAndCount = inputString.split(SEPARATOR);
    const barcode = barcodeAndCount[0].trim();
    const count = Number.parseInt(barcodeAndCount[1].trim());
    return { barcode, count };
  });
}
