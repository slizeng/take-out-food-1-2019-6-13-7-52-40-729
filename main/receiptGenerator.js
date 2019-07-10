import { PROMOTION_TYPES } from "./promotions";

const head = '============= 订餐明细 =============\n';
const cutoffLine = '-----------------------------------\n';
const foot = '===================================';

export function generateReceiptAsString(selectedItems, { total, saved, discountItems, type }) {
  const itemsBlock = selectedItems.map(({ name, count, price }) =>
    `${name} x ${count} = ${price * count}元\n`).join('') + cutoffLine;
  const totalPriceBlock = `总计：${total}元\n`;
  const promotionBlock = type ? buildDiscountDetails(type, saved, discountItems) : '';

  return head +
    itemsBlock +
    promotionBlock +
    totalPriceBlock +
    foot;
}

const buildDiscountDetails = (type, saved, discountItems) => {
  switch (type) {
    case PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX:
      return `使用优惠:\n${type}，省${saved}元\n${cutoffLine}`;
    case PROMOTION_TYPES.FIFTY_OFF:
      return `使用优惠:\n${type}(${discountItems.join('，')})，省${saved}元\n${cutoffLine}`;
    default:
      return '';
  }
};
