import { generateReceiptAsString } from "../main/receiptGenerator";
import { PROMOTION_TYPES } from "../main/promotions";

describe('Receipt generator', function () {
  it('should generate receipt with items and charge without any promotion', () => {
    const selectedItems = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 1,
      count: 1
    }];
    const charge = { total: 1, saved: 0, type: undefined };

    const receiptAsString = generateReceiptAsString(selectedItems, charge);

    expect(receiptAsString).toBe(`
============= 订餐明细 =============
黄焖鸡 x 1 = 1元
-----------------------------------
总计：1元
===================================
    `.trim());
  });

  it('should generate receipt with charge of over thirty minus six promotion', () => {
    const selectedItems = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 15,
      count: 2
    }];
    const charge = { total: 24, saved: 6, type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX };

    const receiptAsString = generateReceiptAsString(selectedItems, charge);

    expect(receiptAsString).toBe(`
============= 订餐明细 =============
黄焖鸡 x 2 = 30元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：24元
===================================
    `.trim());
  });

  it('should generate receipt with charge of fifty off promotion', () => {
    const selectedItems = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 10,
      count: 1
    }, {
      id: 'ITEM0001',
      name: '肉夹馍',
      price: 20,
      count: 1
    }];
    const charge = { total: 15, saved: 15, type: PROMOTION_TYPES.FIFTY_OFF, discountItems: ['黄焖鸡', '肉夹馍'] };

    const receiptAsString = generateReceiptAsString(selectedItems, charge);

    expect(receiptAsString).toBe(`
============= 订餐明细 =============
黄焖鸡 x 1 = 10元
肉夹馍 x 1 = 20元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，肉夹馍)，省15元
-----------------------------------
总计：15元
===================================
    `.trim());
  });
});

