# 罗氏SDK调用指南（小程序版）


## 总则
罗氏SDK是基于微信BLE生长的SDK，使用罗氏SDK之前首先需要保证微信自身的jsBridge可用

罗氏SDK本身并不处理小程序各种兼容性以及应用层面的问题。同时，调用风格，数据返回格式也尽可能与微信保持一致，SDK自己的业务数据会在微信的返回格式中包装一层，再向上传递给应用层。


## 使用

curl -OL https://static.91jkys.com/blesdk/dist/sdk.js

MD5:65223a4b6959fa00902c3476bd2c794c


## 方法

 
###bleSDK.searchRoche(Object)
> 搜索罗氏血糖仪，SDK内部会启用蓝牙发现，当成功搜索到罗氏后，会在success回调中传入罗氏设备相关的信息
> 
> 在成功发现罗氏设备后，SDK会主动停止蓝牙搜索，以节省电量


入参

```json
{
	success: successFn //成功后的回调
	fail: failFn //失败回调
	complete: completeFn //接口调用结束的回调函数（调用成功、失败都会执行)
}
```
成功回调结果

```json
{
	name: 'Acc-check'，//蓝牙设备名称
	deviceId: 'deviceId' //用于区分设备的id，Android 上获取到的deviceId为设备 MAC 地址，iOS 上则为设备 uuid。
    ...
}
```
异常回调结果参考微信文档，包括打开蓝牙适配器失败等

###bleSDK.pair(Object)
> 与罗氏血糖仪进行配对操作
> 
> 需要指出的是，在pair之后的成功回调中，如果在断开蓝牙链接之前又重新建立了新的链接，在某些Android设备上会报BLE connection: already connected的错误。IOS无此问题。
> 
> 此外，对于取消配对的操作，除了上层业务自行做取消配对的逻辑之外，还需要提示用户在系统里的蓝牙设置中取消配对
> 
> ### **重要**：由于微信底层的限制，实质上微信sdk里面并没有pair相关的任何方法，因此，该函数中的success回调实质上模拟的，调用pair方法后4秒以后执行，**不能保证准确**。上层业务可以考虑由用户自行确认是否配对成功，进入下一步逻辑。

入参

```json
{
	success: successFn //成功后的回调
	fail: failFn //每一步接口调用的失败回调函数
	deviceId: deviceId //蓝牙设备的deviceId
}
```
成功回调结果

```json
 无参数
```
异常回调结果参考微信文档


###bleSDK.syncData(Object)
> 同步血糖仪的数据至蓝牙SDK，该方法会依次打开蓝牙适配器，建立链接，获得设备的的service列表和characteristic列表，启用characteristic的notify和indicate属性，最后发出写命令
> 
> 注意：实际数据会逐条通过事件返回给应用层,参考事件一节

> 


入参

```json
{
	success: successFn //成功后的回调
	fail: failFn //每一步接口调用的失败回调函数
	complete: completeFn //每一步接口调用结束的回调函数（调用成功、失败都会执行）
	deviceId: deviceId //蓝牙设备的deviceId
}
```
成功回调结果

```json
 无参数
```
异常回调结果参考微信文档

###bleSDK.disconnectDevice(Object)
> 断开与设备的链接


入参

```json
{
	success: successFn //成功后的回调
	fail: failFn //每一步接口调用的失败回调函数
	complete: completeFn //每一步接口调用结束的回调函数（调用成功、失败都会执行）
	deviceId: deviceId //蓝牙设备的deviceId
}
```

异常回调结果参考微信文档

## 事件

###bleSDK.on('EVENT\_GLYCEMIA\_DATA\_RECEIVED', callback)
> 获取每条血糖记录的详情，该事件会逐条触发

callback入参

```json
{
	seqNum: 12,  //血糖记录的序列号
	date: '2018-12-12 12:12:12', //血糖记录的时间
	data: 3.333,//血糖值，单位mol/L，我这里保留了3位小数，上层业务自行决定保留几位
	isQualityControl: false, //是否属于质控数据，如果是质控数据，罗氏血糖仪上不会出现该条记录，上层业务自行决定是否保留
	...
}
```


###bleSDK.on('EVENT\_GLYCEMIA\_CONTEXT\_RECEIVED', callback)
> 获取血糖记录的附加信息，即餐点
> 
> 餐点信息并不是每条记录都有

callback入参

```json
{
	seqNum: 23,  //血糖记录的序列号
	mealPoint: 1
}
```
#### 餐点信息的枚举值

| mealPoint | 含义 |
| ---- | ---- |
| 1 | 餐前 |
| 2 | 餐后 |
| 3 | 空腹 | 
| 5 | 就寝前 | 


###bleSDK.on('EVENT\_BLE\_TRANSFER\_END', callback)
> 血糖数据传输成功结束后，会触发该事件

callback无入参

###bleSDK.on('EVENT\_BLE\_TRANSFER\_FAILED', callback)
> 若传输过程中发生异常，会触发该事件

callback无入参

###bleSDK.on('EVENT\_BLE\_STATE\_CHANGE', callback)
> 监听罗氏设备蓝牙连接状态的改变事件，包括开发者主动连接或断开连接，设备丢失，连接异常断开等等



callback入参

```json
{
	deviceId: 'xxxxx' //蓝牙设备id
	connected: false //连接目前的状态
}
```


###bleSDK.off('eventName', callbackFnReference)
> 取消事件注册，callbackFnReference为之前注册的函数引用



## 错误码

| 错误码 | 说明 | 备注 |
| ---- | ---- | ---- |
| 0 | ok | 正常|
| 10000 | not init | 未初始化蓝牙适配器 |
| 10001 | not available | 当前蓝牙适配器不可用 |
| 10002 | no device | 没有找到指定设备 |
| 10003 | connection fail | 连接失败 |
| 10004 | no service| 没有找到指定服务 |
| 10005 | no characteristic	| 没有找到指定特征值 |
| 10006 | no connection| 当前连接已断开 |
| 10007 | property not support| 当前特征值不支持此操作 |
| 10008 | system error| 其余所有系统上报的异常 |
| 10009 | system not support| Android 系统特有，系统版本低于 4.3 不支持BLE |

## bug & tip
1. Android在蓝牙发现过程中的问题

	+ 高于Android5的机型需要同时开启蓝牙和定位，同时需要允许微信授权

	
2. Android在传输数据过程的中的问题

	+ 在执行流程一切正常的前提下，某些安卓机型在调用syncdata方法时可能会报10004或10005的错误，首次配对完成后可能出现，提示用户开启/关闭蓝牙后可以解决。

2. Android在链接过程的中的问题

	+ 如果反复创建链接而不断开，android设备上会报蓝牙already connected的错误

