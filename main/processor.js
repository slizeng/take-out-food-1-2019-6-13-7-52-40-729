import { loadPromotions, PROMOTION_TYPES } from "./promotions"

export function getCalculationProcessors() {
  const promotions = loadPromotions();
  return assembleProcessors(promotions);
}

function assembleProcessors(promotionList) {
  const promotionProcessors = promotionList.map(({ type, items }) => PROCESSOR_MAPPING[type](items));
  return [...promotionProcessors, processorWithoutPromotion];
}

const processorWithoutPromotion = items => {
  const total = items.reduce((total, { price, count }) => total + price * count, 0);
  return {
    total,
    saved: 0
  }
};

const PROCESSOR_MAPPING = {
  [PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX]: () => items => {
    const THRESHOLD = 30;
    const COUPON_AMOUNT = 6;

    const sum = items.reduce((total, { price, count }) => total + price * count, 0);
    const discountedSum = sum >= THRESHOLD ? sum - COUPON_AMOUNT : sum;

    return {
      total: discountedSum,
      saved: sum - discountedSum,
      type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX
    }
  },
  [PROMOTION_TYPES.FIFTY_OFF]: limitIdPool => items => {
    return items.reduce(({ total, discountItems, saved }, { price, count, id, name }) => {
      const shouldBeDiscounted = limitIdPool.includes(id);
      const rate = shouldBeDiscounted ? 0.5 : 1.0;
      const originalPrice = price * count;
      const newDiscountItems = shouldBeDiscounted ? [...discountItems, name] : discountItems;

      return {
        total: total + rate * originalPrice,
        discountItems: newDiscountItems,
        saved: saved + (1 - rate) * originalPrice,
        type: PROMOTION_TYPES.FIFTY_OFF
      };
    }, { total: 0, discountItems: [], saved: 0 });
  }
};
