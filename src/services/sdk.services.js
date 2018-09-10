
import SDK                      from 'utils/sdk.util'
import Loading                  from 'plugins/loading.plugin'

export default {
    // 搜索
    searchRoche: () => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
                SDK.searchRoche({
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                Loading.hideNavigationBarLoading();
            }
        });
    }),

    // 配对
    pairRoche: (deviceId) => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        SDK.pair({
            deviceId,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                Loading.hideNavigationBarLoading();
            }
        });
    }),

    //
}
