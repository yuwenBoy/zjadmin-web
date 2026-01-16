
/**
 * datetime:2025-3-28 18:07:56
 * createBy：zhao.jian
 * descript:常量数据
 */
class ProductData {
    quantityUnit () {
        let option =[{
            value: '1',
            label: '重量单位',
            children: [{
              value: '101',
              label: '克',
            }, {
              value: '102',
              label: '千克',
            },{
                value: '103',
                label: '两',
              }, {
                value: '104',
                label: '斤',
              },{
                value: '105',
                label: '磅',
              }, {
                value: '106',
                label: '盎司',
              },{
                  value: '107',
                  label: '毫升',
                }, {
                  value: '108',
                  label: '升',
                },{
                    value: '108',
                    label: '厘米',
                  }, {
                    value: '109',
                    label: '米',
                  },{
                    value: '110',
                    label: '寸',
                  }, {
                    value: '111',
                    label: '英寸',
                  }]
          }, {
            value: '2',
            label: '数量单位',
            children: [{
              value: '201',
              label: '个'
            },  {
                value: '202',
                label: '串'
              }, {
                value: '203',
                label: '枚'
              }, {
                value: '204',
                label: '粒'
              }, {
                value: '204',
                label: '块'
              }, {
                value: '205',
                label: '只'
              },{
                value: '206',
                label: '副'
              },  {
                  value: '207',
                  label: '卷'
                }, {
                  value: '208',
                  label: '片'
                }, {
                  value: '209',
                  label: '贯'
                }, {
                  value: '210',
                  label: '碗'
                }, {
                  value: '211',
                  label: '杯'
                },{
                    value: '212',
                    label: '袋'
                  },  {
                      value: '213',
                      label: '瓶'
                    }, {
                      value: '214',
                      label: '包'
                    }, {
                      value: '215',
                      label: '锅'
                    }, {
                      value: '216',
                      label: '罐'
                    }, {
                      value: '217',
                      label: '扎'
                    }, {
                        value: '218',
                        label: '条'
                      }, {
                        value: '219',
                        label: '盒'
                      }]
          }, {
            value: '3',
            label: '适用人数',
            children: [{
              value: '301',
              label: '1人份'
            }, {
              value: '302',
              label: '2人份'
            }, {
              value: '303',
              label: '3人份'
            },{
                value: '304',
                label: '4人份'
              }, {
                value: '305',
                label: '5人份'
              }, {
                value: '306',
                label: '6人份'
              },{
                value: '307',
                label: '7人份'
              }, {
                value: '308',
                label: '8人份'
              }, {
                value: '309',
                label: '9人份'
              },{
                value: '310',
                label: '10人份'
              }]
          }]
          return option;
    } 
    
}


export default {
    ProductData: new ProductData(),
}




