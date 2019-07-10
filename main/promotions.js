export function loadPromotions() {
  return [{
    type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX
  }, {
    type: PROMOTION_TYPES.FIFTY_OFF,
    items: ['ITEM0001', 'ITEM0022']
  }];
}

export const PROMOTION_TYPES = {
  OVER_THIRTY_MINUS_SIX: '满30减6元',
  FIFTY_OFF: '指定菜品半价'
};
