<template>
  <div>123</div>
</template>
<style lang="scss">
.dt-c-application-info-header {
  border: 1px solid $border-color;
  border-radius: 4px;
  padding: 10px;

  h1 {
    font-size: 14px;
  }

  ul {
    padding-top: 20px;
    li {
      display: inline-block;
      padding: 0 10px;
      min-width: 100px;
      &:nth-child(2) {
        border-left: 1px solid $gray;
        border-right: 1px solid $gray;
      }
      
      i {
        color: $btn-font-color;
        margin-right: 5px;
        font-size: 20px;
        vertical-align: middle;
      }
    }
  }
}
</style>
