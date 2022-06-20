<template>
	<view class="container">
	   <view class="title">
	   	收款信息
	   </view>
	   <view class="main-message">
		   <view class="desc">
		   	  <text>收款单位:</text>南京擎盾信息科技有限公司
		   </view>
		   <view class="desc">
			   <text class="amount">收款金额:</text>
		   	   <u-input :value="value" @input="changePrice" type="number" border class="input" />
			   <text>元/人民币</text>
		   </view>
		   <view class="upper">
		   	大写:人民币{{upperValue}}
		   </view>
		   <view class="desc">
			  <text class="amount">备注:</text>
		   	  <u-input v-model="remark" type="text" border class="input" />
		   </view>
	   </view>
	   <view class="qrcode" @click="getQrcode">
	   	  生成收款码
	   </view>
<!-- 	   <view class="record" @click="viewPage">
	   	   收款记录
	   </view> -->
		<u-popup v-model="showPopup" mode="center" >
			<view class="popup">
				<view style="text-align: left;">
					收款码
				</view>
				<image :src="qrcodeUrl" ></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				value: '',
				showPopup:false,
				upperValue:'',
				remark: '',
				qrcodeUrl: ''
			}
			
		},
		methods:{
			viewPage(){
				wx.navigateTo({
					url:'../receipt-record/index'
				})
			},
			getQrcode(){
				if(!this.value){
					wx.showToast({
						title: '请输入收款金额',
						icon:'error',
					})
					return
				}
				if(!this.remark){
					wx.showToast({
						title: '请输入备注',
						icon:'error',
					})
					return
				}

				const params = {
					amount: this.value,
					remark: this.remark
				}
				this.$u.api.buildPayQrCode(params).then(res=>{
					console.log(res)
					this.qrcodeUrl = res.data.codeUrl
					this.showPopup = true
				})
			},
			changePrice(val){
				this.upperValue = this.numbertoUpperCase(val)
				this.value = val
				console.log(val)
			},
			numbertoUpperCase(money) {
			  function moneyToCapital(num) {
			    var fuhao = "";
			    var text = num + "";
			
			    if (text.indexOf("-") > -1) {
			      num = text.replace("-", "");
			      fuhao = "负";
			    }
			
			    var money1 = new Number(num);
			    var monee = Math.round(money1 * 100).toString(10);
			    var leng = monee.length;
			    var monval = "";
			
			    for (var i = 0; i < leng; i++) {
			      monval = monval + to_upper(monee.charAt(i)) + to_mon(leng - i - 1);
			    }
			
			    return fuhao + repace_acc(monval);
			  } // 将数字转为大写的中文字
			
			
			  function to_upper(a) {
			    switch (a) {
			      case "0":
			        return "零";
			        break;
			
			      case "1":
			        return "壹";
			        break;
			
			      case "2":
			        return "贰";
			        break;
			
			      case "3":
			        return "叁";
			        break;
			
			      case "4":
			        return "肆";
			        break;
			
			      case "5":
			        return "伍";
			        break;
			
			      case "6":
			        return "陆";
			        break;
			
			      case "7":
			        return "柒";
			        break;
			
			      case "8":
			        return "捌";
			        break;
			
			      case "9":
			        return "玖";
			        break;
			
			      default:
			        return "";
			    }
			  }
			
			  function to_mon(a) {
			    if (a > 10) {
			      a = a - 8;
			      return to_mon(a);
			    }
			
			    switch (a) {
			      case 0:
			        return "分";
			        break;
			
			      case 1:
			        return "角";
			        break;
			
			      case 2:
			        return "元";
			        break;
			
			      case 3:
			        return "拾";
			        break;
			
			      case 4:
			        return "佰";
			        break;
			
			      case 5:
			        return "仟";
			        break;
			
			      case 6:
			        return "万";
			        break;
			
			      case 7:
			        return "拾";
			        break;
			
			      case 8:
			        return "佰";
			        break;
			
			      case 9:
			        return "仟";
			        break;
			
			      case 10:
			        return "亿";
			        break;
			    }
			  }
			
			  function repace_acc(Money) {
			    Money = Money.replace("零分", "");
			    Money = Money.replace("零角", "零");
			    var yy;
			    var outmoney;
			    outmoney = Money;
			    yy = 0;
			
			    while (true) {
			      var lett = outmoney.length;
			      outmoney = outmoney.replace("零元", "元");
			      outmoney = outmoney.replace("零万", "万");
			      outmoney = outmoney.replace("零亿", "亿");
			      outmoney = outmoney.replace("零仟", "零");
			      outmoney = outmoney.replace("零佰", "零");
			      outmoney = outmoney.replace("零零", "零");
			      outmoney = outmoney.replace("零拾", "零");
			      outmoney = outmoney.replace("亿万", "亿零");
			      outmoney = outmoney.replace("万仟", "万零");
			      outmoney = outmoney.replace("仟佰", "仟零");
			      yy = outmoney.length;
			
			      if (yy == lett) {
			        break;
			      }
			    }
			
			    yy = outmoney.length;
			
			    if (outmoney.charAt(yy - 1) == "零") {
			      outmoney = outmoney.substring(0, yy - 1);
			    }
			
			    yy = outmoney.length;
			
			    if (outmoney.charAt(yy - 1) == "元") {
			      outmoney = outmoney + "整";
			    }
			
			    return outmoney;
			  }
			
			  return moneyToCapital(money);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		padding:10upx 20upx;
	}
	.container{
		background-color: #F2F2F2;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
        height: 100%;
	}
	.main-message{
		padding: 10upx 20upx ;
		background-color: #FFFFFF;
		.desc{
			display: flex;
			align-items: center;
			position: relative;
			margin: 30upx 0;
			text{
				width: 140upx;
				text-align: right;
				margin-right: 10upx;
			}
			.amount{
				position: relative;
			}
			.amount::after{
				position: absolute;
				left: 0;
				top: 0;
				color: red;
				content: '*';
			}
			.input{
				flex: 1;
			}

		}
		.upper{
			height: 40upx;
			margin: 20upx 0 20upx 160upx;
			
		}
	}
	.qrcode{
		height: 60upx;
		width: 230upx;
		text-align: center;
		line-height: 60upx;
		margin: 30upx auto;
		border-radius: 30upx;
		color: #FFFFFF;
		background-color: #178BFF;
	}
	.record{
		color:#178BFF;
		width: 200upx;
		text-align: center;
		margin: 100upx auto;
	}
	.popup{
		height: 600upx;
		width: 600upx;
		margin: 0 auto;
		padding: 20upx;
		overflow: hidden;
		image{
			display: block;
			height: 500upx;
			width: 500upx;
			margin: 0 auto;
		}
	}
</style>
