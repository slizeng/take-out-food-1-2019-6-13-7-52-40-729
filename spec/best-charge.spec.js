import {
  bestCharge,
  calculateChargesWithAllPromotionStrategies, chooseBestCharge,
  transformInputStringsToItems
} from "../main/best-charge";
import { PROMOTION_TYPES } from "../main/promotions";

describe('Take out food', function () {
  it('should choose best charge by how much of saved money', () => {
    const charges = [
      { total: 24, saved: 6, type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX },
      { total: 15, saved: 15, discountItems: ['ITEM0001'], type: PROMOTION_TYPES.FIFTY_OFF }
    ];

    const bestCharge = chooseBestCharge(charges);

    expect(bestCharge).toEqual(charges[1]);
  });

  it('should choose basic charge without promotion if no charge saves money', () => {
    const charges = [
      { total: 1, saved: 0, type: PROMOTION_TYPES.OVER_THIRTY_MINUS_SIX },
      { total: 1, saved: 0, discountItems: [], type: PROMOTION_TYPES.FIFTY_OFF },
      { total: 1, saved: 0, type: undefined }
    ];

    const bestCharge = chooseBestCharge(charges);

    expect(bestCharge).toEqual(charges[2]);
  });

  it('should parse input string list and translate to items ', () => {
    const inputStrings = ["ITEM0001 x 1", "ITEM0013 x 2"];

    const selectedItems = transformInputStringsToItems(inputStrings);

    expect(selectedItems).toEqual([{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18,
      count: 1
    }, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00,
      count: 2
    }]);
  });

  it('should invoke 3 processors to calculate two results when calculate charges with all strategies given two' +
    ' promotions', () => {
    const inputItems = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 30,
      count: 1
    }];

    const charges = calculateChargesWithAllPromotionStrategies(inputItems);

    expect(charges.length).toBe(3);
    charges.forEach(charge => {
      expect(charge.total).toBeDefined();
      expect(charge.saved).toBeDefined();
    })
  });

  it('should generate best charge when best is 指定菜品半价', function () {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function () {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

});
