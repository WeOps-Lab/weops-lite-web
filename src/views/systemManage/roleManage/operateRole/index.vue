<template>
    <el-dialog
        :visible.sync="visible"
        width="600px"
        :close-on-click-modal="false"
        :title="title"
        @closed="closeDialog"
    >
        <div class="content-box" v-loading="loading">
            <el-form ref="roleValidateForm" label-width="90px" :model="formData" :rules="rules">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="formData.role_name" placeholder="请输入角色名称" :disabled="type === 'edit'"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="formData.describe" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="请输入角色描述" type="textarea"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template slot="footer">
            <el-button :disabled="loading" type="primary" @click="confirm">
                确认
            </el-button>
            <el-button @click="close">
                取消
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import "./index.scss"
</style>
