import { getPromotionWithProcessors } from "../main/processor";


describe('Processors with promotion', function () {
  const promotions = [{
    type: '满30减6元'
  }, {
    type: '指定菜品半价',
    items: ['ITEM0001', 'ITEM0022']
  }];

  it('should assemble processors with promotions', () => {
    const processorsWithPromotions = getPromotionWithProcessors();

    const typesAndItemsFromResult = processorsWithPromotions.map(({ type, items }) => items ? {
      type,
      items
    } : { type });
    expect(typesAndItemsFromResult).toEqual(promotions);
    expect(typeof processorsWithPromotions[0].processor).toEqual('function');
    expect(typeof processorsWithPromotions[1].processor).toEqual('function');
  });

  it('should process money off promotion successfully', () => {
    const processorsWithPromotions = getPromotionWithProcessors();
    const moneyOffProcessor = processorsWithPromotions[0].processor;

    const shouldNotMoneyOffCase = [{
      id: 'ITEM0001',
      price: 29.00,
      count: 1
    }];

    const shouldMoneyOffCase = [{
      id: 'ITEM0001',
      price: 29.00,
      count: 1
    }, {
      id: 'ITEM0013',
      price: 1.00,
      count: 1
    }];

    expect(moneyOffProcessor(shouldNotMoneyOffCase)).toEqual({ total: 29, saved: 0 });
    expect(moneyOffProcessor(shouldMoneyOffCase)).toEqual({ total: 24, saved: 6 });
  });

  it('should process discount promotion successfully', () => {
    const processorsWithPromotions = getPromotionWithProcessors();
    const discountProcessor = processorsWithPromotions[1].processor;

    const shouldNotDiscountCase = [{
      id: 'ITEM0002',
      price: 2.00,
      count: 1
    }];

    const shouldDiscountCase = [{
      id: 'ITEM0001',
      price: 2.00,
      count: 1
    }, {
      id: 'ITEM002',
      price: 2.00,
      count: 1
    }];

    expect(discountProcessor(shouldNotDiscountCase)).toEqual({ total: 2, saved: 0, discountItems: [] });
    expect(discountProcessor(shouldDiscountCase)).toEqual({ total: 3, saved: 1, discountItems: ['ITEM0001'] });
  });
});
