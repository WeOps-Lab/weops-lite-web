<template>
    <div>
        <bk-exception class="exception-wrap-item" type="403">
            <span>抱歉，您暂无该功能的权限</span>
            <div class="text-subtitle">你没有该功能的权限，请联系您的专属客户经理进行申请</div>
        </bk-exception>
    </div>
</template>

<style lang="scss">
.exception-wrap-item {
    margin: 10px;
    height: 420px;
    padding-top: 22px;
    .text-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3A84FF;
        font-size: 14px;
        margin-top: 12px;
    }
    .text-subtitle {
        color: #979BA5;
        font-size: 14px;
        text-align: center;
        margin-top: 14px;
    }
}
</style>
