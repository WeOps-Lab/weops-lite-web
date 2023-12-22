<template>
    <bk-exception class="exception-wrap-item" type="403">
        <span>无菜单权限</span>
        <div class="text-subtitle" style="margin-top: 20px;">您没有相应菜单的访问权限，请前往申请相关菜单权限</div>
    </bk-exception>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    @Component({
        name: 'no-purview'
    })
    export default class NoPurview extends Vue {}
</script>
