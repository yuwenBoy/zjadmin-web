import request from "@/utils/request";
// // 使用你的API密钥和城市名称调用函数
// const apiKey = 'YOUR_API_KEY';
// const city = 'London';
// /***
//  * 获取天气
//  */
// export const getWeather = async (city, apiKey='483569520b741ebca59287681f3a6427')  =>{
//     try {
//         const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
//         const response = await axios.get(url);
//         const { main, weather, name } = response.data;
//         return {
//             cityName: name,
//             temperature: main.temp,
//             description: weather[0].description,
//             humidity: main.humidity,
//             windSpeed: main.wind_speed
//         };
//     } catch (error) {
//         console.error('Error fetching the weather:', error);
//     }
// }

export const getCityDataApi = async params => {
    return request({
        url:'staff_info/getCityInfo',
        method: "get",
        params
    })
}


/**
 * 获取验证码
 * @param {*} params
 * @returns
 */
export const getCodeData = async params => {
  return request({
    url: "auth/authcode",
    method: "get",
    params
  });
};

/**
 * crud.js 统一请求接口【加载分页列表】
 * @param {*} url
 * @param {*} params
 * @returns
 */
export const getTableData = (url, params) => {
  return request({
    url: url,
    method: "post",
    data: params
  });
}; 

export const chinaRegions = ()=>{
    return request({
       url: "auth/chinaRegions",
       method: "get",
    })
}

// // 上传用户头像
// export const uploadAvatar = (params) => {
//     return request({
//         url:'/basic-api/oss/uploadAvatar',
//         method:'post',
//         data:params
//     })
// }
