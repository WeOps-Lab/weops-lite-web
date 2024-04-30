<template>
    <div class="asso-info">
        <el-radio-group v-model="active" size="small" class="mb20">
            <el-radio-button label="列表"></el-radio-button>
            <el-radio-button label="拓扑"></el-radio-button>
        </el-radio-group>
        <component :is="commentsMap[active]" v-bind="$attrs">
        </component>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
