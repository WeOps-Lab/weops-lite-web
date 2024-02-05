<template>
    <drawer-component
        :title="`${isAdd ? '新增' : '编辑'}外链`"
        :visible="isShow"
        :size="500"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box">
            <div class="form-box">
                <el-form label-width="90px" :model="formData" :rules="rules" ref="validateForm">
                    <el-form-item label="显示名称" :required="true" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="链接" :required="true" prop="url">
                        <el-input v-model="formData.url"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="foot-box">
                <el-button @click="cancel">
                    取消
                </el-button>
                <el-button type="primary" class="mr10" @click="confirm">
                    确认
                </el-button>
            </div>
        </div>
    </drawer-component>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="scss">
@import "./index.scss"
</style>
