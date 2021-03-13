<template>
  <div class="mask">
    <div class="popup">
      <h1 class="title">ヾ(◍°∇°◍)ﾉﾞ工作辛苦啦~</h1>
      <p class="txt"><span class="label">工作时长</span>&nbsp;:&nbsp;8小时</p>
      <p class="txt"><span class="label">工作活跃度</span>&nbsp;:&nbsp;非常高</p>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(../../assets/bg-mask.png) center center/cover no-repeat;
}
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 320px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.45), inset 0 1px 4px 0 rgba(33, 118, 154, 0.25);
  background: url(../../assets/popup-bg.png) center center/cover no-repeat;
  color: #fff;
  .title {
    font-family: FZLTZHK--GBK1-0;
    font-size: 36px;
    color: #ffffff;
  }
  .txt {
    display: block;
    width: 300px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    line-height: 24px;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.75);
    .label {
      height: 24px;
      line-height: 24px;
      width: 150px;
      text-align: justify;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      &:after {
        content: ' ';
        display: inline-block;
        width: 100%;
        height: 0px;
      }
    }
  }
  .letter-spaceing {
    letter-spacing: 8px;
  }
}
</style>
