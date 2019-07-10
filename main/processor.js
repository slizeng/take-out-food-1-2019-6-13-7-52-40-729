import { loadPromotions } from "./promotions"

export function getPromotionWithProcessors() {
  const promotions = loadPromotions();
  return assembleProcessorsWithPromotions(promotions);
}

function assembleProcessorsWithPromotions(promotionList) {
  return promotionList.map(({ type, items }) => items ? {
    type,
    items,
    processor: PROCESSOR_MAPPING[type](items)
  } : {
    type,
    processor: PROCESSOR_MAPPING[type]()
  });
}

const PROCESSOR_MAPPING = {
  '满30减6元': () => items => {
    const THRESHOLD = 30;
    const COUPON_AMOUNT = 6;

    const sum = items.reduce((total, { price, count }) => total + price * count, 0);
    const discountedSum = sum >= THRESHOLD ? sum - COUPON_AMOUNT : sum;

    return {
      total: discountedSum,
      saved: sum - discountedSum
    }
  },
  '指定菜品半价': limitIdPool => items => {
    return items.reduce(({ total, discountItems, saved }, { price, count, id }) => {
      const shouldBeDiscounted = limitIdPool.includes(id);
      const rate = shouldBeDiscounted ? 0.5 : 1.0;
      const originalPrice = price * count;
      const newDiscountItems = shouldBeDiscounted ? [...discountItems, id] : discountItems;

      return {
        total: total + rate * originalPrice,
        discountItems: newDiscountItems,
        saved: saved + (1 - rate) * originalPrice
      };
    }, { total: 0, discountItems: [], saved: 0 });
  }
};
