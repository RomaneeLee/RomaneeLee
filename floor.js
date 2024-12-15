export default {
    data(){
      return {
        scrollInfo:[], // 页码滚动初始化
        scrollSize:1,  // 滚动页码位置判断  
      }
    },
      // 监听滚动传值
      onPageScroll(res) {
        let _this = this
        _this.type = 1
        this.$emit('gunShowPage', res)
        // console.log('页面正在滚动',res.scrollTop)
        var pageIndex =null ;
        // scrollSize  所处的高度在哪个哪个页码的下标下   
        // currentPage 当前页码
          // 下滑页码改变时 记录页码增加时的高度，上拉页码改变时
        if(this.currentPage > this.scrollSize){
          this.scrollSize = this.currentPage
          this.scrollInfo.push(res.scrollTop)
          // console.log(this.scrollInfo)
        }else if(this.currentPage < this.scrollSize){
          this.scrollSize = this.currentPage
          console.log(this.scrollInfo)
        }
        // 判断滚动条有历史记录的情况下 返回
        if(this.scrollInfo[this.scrollSize-2] >res.scrollTop){
          this.currentPage--
          this.scrollSize = this.currentPage
        }
         // 判断滚动条在有历史记录的情况下 下滑
        if(this.scrollInfo[this.currentPage-1] < res.scrollTop ){
         this.currentPage++
         this.scrollSize = this.currentPage
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(function () {
          console.log('悬浮按钮状态切换', this.timer)
          _this.type = 2
        }, 800)
        // console.log(this.model)
        if (res.scrollTop > 50) {
          this.isShow = true
        } else {
          this.isShow = false
        }
      }
  }
  