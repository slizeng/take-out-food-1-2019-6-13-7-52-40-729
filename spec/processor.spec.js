import { getCalculationProcessors } from "../main/processor";
import { PROMOTION_TYPES } from "../main/promotions";

describe('Processors with promotion', function () {
  it('should assemble processors with promotions', () => {
    const processors = getCalculationProcessors();

    processors.forEach(processor => expect(typeof processor).toEqual('function'));
  });

  it('should process money off promotion successfully', () => {
    const moneyOffProcessor = getCalculationProcessors()[0];

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

    expect(moneyOffProcessor(shouldNotMoneyOffCase)).toEqual({
      total: 29,
      saved: 0,
      type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX
    });
    expect(moneyOffProcessor(shouldMoneyOffCase)).toEqual({
      total: 24,
      saved: 6,
      type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX
    });
  });

  it('should process discount promotion successfully', () => {
    const discountProcessor = getCalculationProcessors()[1];

    const shouldNotDiscountCase = [{
      id: 'ITEM0002',
      price: 2.00,
      count: 1
    }];

    const shouldDiscountCase = [{
      id: 'ITEM0001',
      name: 'anyName',
      price: 2.00,
      count: 1
    }, {
      id: 'ITEM002',
      price: 2.00,
      count: 1
    }];

    expect(discountProcessor(shouldNotDiscountCase)).toEqual({
      total: 2,
      saved: 0,
      discountItems: [],
      type: PROMOTION_TYPES.FIFTY_OFF
    });
    expect(discountProcessor(shouldDiscountCase)).toEqual({
      total: 3,
      saved: 1,
      discountItems: ['anyName'],
      type: PROMOTION_TYPES.FIFTY_OFF
    });
  });

  it('should process calculation without any promotion', () => {
    const processorWithoutPromotion = getCalculationProcessors()[2];
    const testItems = [{
      id: 'ITEM0001',
      price: 30.00,
      count: 1
    }];

    expect(processorWithoutPromotion(testItems)).toEqual({ total: 30, saved: 0, type: undefined });
  });
});
