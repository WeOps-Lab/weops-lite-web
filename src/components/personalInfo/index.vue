<template>
    <div>
        <drawer-component
            title="个人信息"
            :visible="isShow"
            :size="600"
            :before-close="beforeClose"
            custom-class="common-dialog-wrapper"
            @changeVisible="changeVisible">
            <div slot="content" class="common-dialog-wrapper-main content-box" v-loading="pageLoading">
                <el-form label-width="80px" :model="formData" ref="validateForm"
                    v-loading="isInfoLoading" :rules="formRules">
                    <el-form-item label="用户名" :required="true" prop="username">
                        <el-input
                            :disabled="true"
                            size="small"
                            v-model="formData.username"
                            placeholder="请输入用户名">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="中文名" prop="display_name">
                        <el-input
                            :disabled="!isEdit"
                            size="small"
                            v-model="formData.display_name"
                            placeholder="请输入中文名">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input
                            :disabled="!isEdit"
                            size="small"
                            v-model="formData.email"
                            placeholder="请输入邮箱">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="isEdit" class="form-btn">
                        <el-button type="primary" size="small" @click="onFormSubmit">提交</el-button>
                        <el-button type="default" size="small" @click="onFormCancel">取消</el-button>
                    </el-form-item>
                </el-form>
                <div class="btn-box">
                    <el-button
                        type="text"
                        style="margin-right: 20px;"
                        @click="updateFormData">
                        修改信息
                    </el-button>
                    <el-button type="text" @click="showPasswordForm">
                        重置密码
                    </el-button>
                </div>
                <el-form
                    :model="passwordFormData"
                    ref="validatePsdForm"
                    :rules="passwordRules"
                    label-width="80px"
                    v-show="showPassword"
                    v-loading="isPsdLoading">
                    <el-form-item label="密码" :required="true" prop="password">
                        <el-input
                            show-password
                            size="small"
                            v-model="passwordFormData.password"
                            placeholder="请输入密码">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :required="true" prop="confirmPassword" error-display-type="normal">
                        <el-input
                            show-password
                            size="small"
                            v-model="passwordFormData.confirmPassword"
                            placeholder="请输入密码">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="form-btn">
                        <el-button type="primary" size="small" @click="onPasswordSubmit">提交</el-button>
                        <el-button type="default" size="small" @click="onPasswordCancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <template slot="footer">
                <el-button type="default" size="small" @click="isShow = false">取消</el-button>
            </template>
        </drawer-component>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped>
@import "./index.scss"
</style>
