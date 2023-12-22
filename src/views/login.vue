<template>
    <div class="page-content">
        <img class="login-img" src="../assets/img/canway_logo.png" height="64" alt="" style="margin-bottom: 5%; margin-top: -5%;">
        <div class="login-wraper-weops">
            <div class="login-left" style="display: flex; align-items: center; flex-direction: column; height: 400px;">
                <img src="../assets/svg/logo.svg" height="80" alt="">
                <div style="font-size: 12px;color: #ffffff;">致力于打造最好的运维平台</div>
            </div>
            <div class="login-from">
                <h2 style="font-size: 20px; text-align: center; margin-top: 50px; color: #333333;">欢迎登录WeOps</h2>
                <div class="from-detail">
                    <form id="login-form">
                        <div class="is-danger-tip">{{ errorTip }}</div>
                        <div class="form-login">
                            <div class="user group-control">
                                <input id="user" type="text" name="username" placeholder="账号" v-model="formData.username">
                            </div>
                            <div class="pwd group-control">
                                <input class="password" id="password" type="password" name="password" v-model="formData.password" placeholder="密码">
                            </div>
                            <div class="btn-content clearfix">
                                <button class="login-btn" v-bkloading="{ isLoading: isLoading, zIndex: 10 }" @click.prevent="handleLogin(formData)">登录</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    @Component({
        name: 'login'
    })
    export default class Login extends Vue {
        formData: any = {
            username: '',
            password: ''
        }
        errorTip: string = ''
        isLoading: boolean = false
        handleLogin(formData) {
            this.errorTip = ''
            if (formData.username === '' || formData.password === '') {
                this.errorTip = '账号或密码不能为空'
                return
            }
            this.isLoading = true
            this.$api.User.login(this.formData).then(res => {
                if (res.result) {
                    const token = res.data.token
                    document.cookie = `token=${token}`
                    localStorage.setItem('loginToken', token)
                    const goto = this.$route.query.from
                    if (goto && goto !== 'Login') {
                        this.$router.push({name: goto})
                    } else {
                        this.$router.push('/')
                    }
                } else {
                    this.errorTip = '账号或密码不正确'
                }
            }).finally(() => {
                this.isLoading = false
            })
        }
        mounted() {
            this.$bus.$emit('setAppLoading', false)
        }
    }
</script>

<style scoped>
    a, a:hover, button {
        text-decoration: none;
    }

    .page-content, body, html {
        height: 100%;
        position: relative;
    }

    * {
        box-sizing: border-box;
    }

    b, blockquote, body, button, dd, div, dl, dt, fieldset, form, h1, h2, h3, h4, h5, h6, i, input, li, ol, p, pre, span, td, textarea, th, ul {
        margin: 0;
        padding: 0;
    }

    body, html {
        font-size: 14px;
        font-family: "PingFang SC", "Microsoft YaHei";
    }

    a, button {
        -webkit-transition: all .5s;
        -moz-transition: all .5s;
        -ms-transition: all .5s;
        transition: all .5s;
    }

    li, ol, ul {
        list-style: none;
    }

    h1, h2, h3, h4, h5, h6 {
        font-weight: 400;
    }

    input::-webkit-input-placeholder {
        color: #C4C6CC;
    }

    input:-moz-placeholder {
        color: #C4C6CC;
    }

    input::-moz-placeholder {
        color: #C4C6CC;
    }

    input:-ms-input-placeholder {
        color: #C4C6CC;
    }

    textarea::-webkit-input-placeholder {
        color: #C4C6CC;
    }

    textarea:-moz-placeholder {
        color: #C4C6CC;
    }

    textarea::-moz-placeholder {
        color: #C4C6CC;
    }

    textarea:-ms-input-placeholder {
        color: #C4C6CC;
    }

    .pb110 {
        padding-bottom: 110px;
    }

    .clearfix::after, .clearfix::before {
        content: "";
        display: table;
    }

    .clearfix::after {
        clear: both;
    }

    .hide {
        display: none !important;
        visibility: hidden;
    }

    #login-form {
        padding-top: 42px;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

    input, input[disabled], select {
        background: 0 0;
    }

    input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .page-content {
        width: 100%;
        background: url(../assets/img/bg.png) center bottom no-repeat;
        margin: 0 auto;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .page-content .login-from {
        width: 385px;
        min-height: 400px;
        /*border-radius: 2px;*/
        /*position: absolute;*/
        /*top: 50%;*/
        /*left: 50%;*/
        /*margin-left: -200px;*/
        /*z-index: 100;*/
        overflow: visible;
        /*margin-top: -200px;*/
    }

    .page-content .login-from .logo-title {
        width: 100%;
        height: 110px;
        border-bottom: 1px solid #F0F1F5;
        border-radius: 2px 2px 0 0;
        background: #fff;
        text-align: center;
        line-height: 110px;
    }

    .page-content .login-from .logo-title img {
        height: 35px;
        vertical-align: top;
        margin-top: 37px;
    }

    .page-content .login-from .from-detail {
        position: relative;
        background: #fff;
        padding-bottom: 44px;
    }

    .page-content .login-from .from-detail .is-danger-tip {
        position: absolute;
        color: #EA3636;
        top: 11px;
        /* left: 50%; */
        font-size: 12px;
        width: 100%;
        text-align: center;
    }

    .page-content .login-from .from-detail .is-danger-tip .icon-exclamation-circle-shape {
        margin-right: 10px;
    }

    .page-content .login-from .check-box {
        padding: 20px;
        text-align: right;
    }

    .page-content .login-from .check-box .switch-btn {
        display: inline-block;
        width: 52px;
        height: 24px;
        border-radius: 12px;
        overflow: hidden;
        /* // background: url(../img/logo/button.png) -28px no-repeat; */
        cursor: pointer;
        transition: .5s;
    }

    .page-content .login-from .check-box .switch-btn.en {
        background-position: 0;
    }

    .page-content .login-from .form-login {
        width: 100%;
        padding: 0 55px 0 56px;
    }

    .page-content .login-from .form-login.is-danger .group-control i {
        color: #ff5656;
    }

    .page-content .login-from .form-login.is-danger .group-control input {
        border-color: #ff5656;
        color: #ff5656;
    }

    .page-content .login-from .form-login.is-danger .group-control input:focus {
        border-color: #ff5656;
    }

    .page-content .login-from .form-login.is-danger .group-control input::-webkit-input-placeholder {
        color: #ff5656;
    }

    .page-content .login-from .form-login.is-danger .group-control input:-moz-placeholder {
        color: #ff5656;
    }

    .page-content .login-from .form-login.is-danger .group-control input::-moz-placeholder {
        color: #ff5656;
    }

    .page-content .login-from .form-login.is-danger .group-control input:-ms-input-placeholder {
        color: #ff5656;
    }

    .page-content .login-from .form-login.certificate-expired .group-control i {
        color: #cad3dc;
    }

    .page-content .login-from .form-login.certificate-expired .group-control input {
        border-color: #dde4eb;
        color: #cad3dc;
    }

    .page-content .login-from .form-login.certificate-expired .group-control input:focus {
        border-color: #ff5656;
    }

    .page-content .login-from .form-login.certificate-expired .group-control input::-webkit-input-placeholder {
        color: #cad3dc;
    }

    .page-content .login-from .form-login.certificate-expired .group-control input:-moz-placeholder {
        color: #cad3dc;
    }

    .page-content .login-from .form-login.certificate-expired .group-control input::-moz-placeholder {
        color: #cad3dc;
    }

    .page-content .login-from .form-login.certificate-expired .group-control input:-ms-input-placeholder {
        color: #cad3dc;
    }

    .page-content .login-from .form-login.certificate-expired .btn-content .login-btn {
        background: #9dafdd;
        cursor: not-allowed;
    }

    .page-content .login-from .form-login.certificate-expired .btn-content .login-btn:hover {
        background: #9dafdd;
    }

    .page-content .login-from .form-login .group-control {
        /*width: 290px;*/
        height: 42px;
        border-radius: 2px;
        position: relative;
    }

    .page-content .login-from .form-login .group-control i {
        position: absolute;
        font-size: 16px;
        top: 12px;
        left: 14px;
        color: #979BA5;
    }

    .page-content .login-from .form-login .group-control + .group-control {
        margin-top: 15px;
    }

    .page-content .login-from .form-login .group-control input {
        width: 100%;
        height: 100%;
        outline: 0;
        border: none;
        border-bottom: 1px solid #C4C6CC;
        /* padding: 0 20px 0 37px; */
        color: #737987;
        /*border-radius: 2px;*/
        /* border: none; */
        padding: 0 5px;
    }

    .page-content .login-from .form-login .action {
        margin-top: 12px;
    }

    .page-content .login-from .form-login .group-control input:focus {
        border-color: #3c96ff;
    }

    .page-content .login-from .form-login .btn-content {
        font-size: 0;
        padding-top: 10px;
    }

    .page-content .login-from .form-login .login-btn {
        width: 100%;
        height: 42px;
        display: inline-block;
        background-color: #5898E4;
        border-radius: 2px;
        outline: 0;
        border: none;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0;
        color: #fff;
        cursor: pointer;
        float: left;
        margin-top: 30px;
    }

    .page-content .login-from .form-login .login-btn:hover {
        background: #526eb5;
    }

    .page-content .login-from .form-login .domain {
        position: relative;
    }

    .page-content .login-from .form-login .domain input {
        cursor: pointer;
    }

    .page-content .login-from .form-login .domain .angle {
        border: solid #979ba5;
        border-width: 0 1px 1px 0;
        display: inline-block;
        padding: 4px;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        position: absolute;
        right: 9px;
        color: #979ba5;
    }

    .page-content .login-from .form-login .domain .down {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        top: 13px;
    }

    .page-content .login-from .form-login .domain .up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
        top: 18px;
    }

    .page-content .login-from .form-login .domain .close-circle {
        position: absolute;
        right: 9px;
        top: 12px;
        background: #e7e9ef;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        text-align: center;
        line-height: 7px;
        cursor: pointer;
    }

    .page-content .login-from .form-login .domain .close {
        display: inline-block;
        width: 10px;
        height: 2px;
        background: #ffffff;
        transform: rotate(45deg);
    }

    .page-content .login-from .form-login .domain .close::after {
        content: "";
        display: block;
        width: 10px;
        height: 2px;
        background: #ffffff;
        transform: rotate(-90deg);
    }

    .page-content .login-from .form-login .domain-wrap {
        position: relative;
        margin-bottom: 15px;
    }

    .page-content .login-from .form-login .domain-wrap .domain-option {
        position: absolute;
        top: 40px;
        width: 100%;
        max-height: 150px;
        z-index: 999;
        border: 1px solid #dcdee5;
        border-radius: 2px;
        line-height: 32px;
        background: #fff;
        color: #63656e;
    }

    .page-content .login-from .form-login .domain-wrap .domain-option li {
        color: #737987;
        line-height: 28px;
        height: 28px;
        padding: 0 5px;
    }

    .page-content .login-from .form-login .domain-wrap .domain-option li:hover {
        color: #5898E4;
        background: #eaeff7;
        cursor: pointer;
    }

    .page-content .login-from .form-login .password-btn, .page-content .login-from .form-login .protocol-btn {
        font-size: 14px;
        letter-spacing: 0;
        color: #4D66C6;
        display: inline-block;
        cursor: pointer;
        float: right;
    }

    .page-content .login-from .form-login .password-btn:hover, .page-content .login-from .form-login .protocol-btn:hover {
        color: #526eb5;
    }

    .footer, .footer .footer-menu a {
        color: #73787e;
    }

    .language-switcher {
        text-align: right;
        margin-top: 13px;
    }

    .language-switcher a img {
        height: 24px;
    }

    .footer {
        width: 100%;
        height: 148px;
        position: absolute;
        bottom: 0;
        padding-top: 80px;
        font-size: 12px;
        /* // background: url(../img/logo/bg_footer.png) center center no-repeat */
    }

    .footer .footer-menu {
        text-align: center;
    }

    .footer .footer-menu p {
        line-height: 24px;
    }

    .protocol-pop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        z-index: 101;
    }

    .protocol-pop .protocol-detail {
        width: 1200px;
        height: 700px;
        background-color: #fff;
        border-radius: 2px;
        top: 10%;
        left: 50%;
        margin-left: -600px;
        position: absolute;
        padding: 59px 23px 40px 37px;
    }

    .protocol-pop .protocol-detail .del-text {
        position: absolute;
        top: 0;
        right: 0;
        width: 27px;
        height: 27px;
        line-height: 26px;
        text-align: center;
        margin: 4px 4px 0 0;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-size: 11px 11px;
        background-position: 50% 50%;
        cursor: pointer;
        display: inline-block;
    }

    .protocol-pop .protocol-detail .del-text:hover {
        background-color: #f3f3f3;
    }

    .protocol-pop .protocol-detail .del-text > i {
        font-size: 10px;
        color: #50525f;
        font-weight: 700;
    }

    .protocol-pop .protocol-detail .detail-content {
        height: 536px;
        overflow-y: auto;
    }

    .protocol-pop .protocol-detail .detail-content::-webkit-scrollbar {
        width: 6px;
        height: 5px;
    }

    .protocol-pop .protocol-detail .detail-content::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: #a5a5a5;
        box-shadow: inset 0 0 6px rgba(204, 204, 204, .3);
    }

    .protocol-pop .protocol-detail .detail-content > .title {
        text-align: center;
        font-size: 32px;
        font-weight: 400;
        font-stretch: normal;
        line-height: 36px;
        letter-spacing: 1px;
        color: #4f515e;
        position: relative;
        margin-bottom: 67px;
    }

    .protocol-pop .protocol-detail .detail-content > .title::after {
        content: "";
        position: absolute;
        width: 30px;
        height: 2px;
        background: #5c7ac6;
        top: 46px;
        left: 50%;
        margin-left: -15px;
    }

    .protocol-pop .protocol-detail .detail-content .detail-list {
        padding-right: 23px;
    }

    .protocol-pop .protocol-detail .detail-content .detail-list > .title {
        font-weight: 700;
    }

    .protocol-pop .protocol-detail .detail-content .detail-list p {
        text-align: left;
        font-size: 12px;
        line-height: 32px;
        letter-spacing: 0;
        color: #7b7d8a;
    }

    .protocol-pop .protocol-detail .consent-content {
        text-align: center;
        margin-top: 25px;
    }

    .protocol-pop .protocol-detail .consent-content .consent-btn {
        width: 160px;
        height: 42px;
        display: inline-block;
        background-color: #5c7ac6;
        border-radius: 2px;
        border: none;
        font-size: 16px;
        font-weight: 400;
        font-stretch: normal;
        line-height: 18px;
        letter-spacing: 0;
        color: #fff;
    }

    .protocol-pop .protocol-detail .consent-content .consent-btn:hover {
        background: #526eb5;
    }

    .error-message-content {
        position: fixed;
        top: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: none;
    }

    .error-message-content i {
        cursor: pointer;
        color: #ff5656;
        display: inline-block;
    }

    .error-message-content.is-chrome {
        background: #f8f6db;
    }

    .error-message-content.is-certificate {
        background: #fbd9d9;
        color: #ff5656;
    }

    .error-message-content span {
        color: #ff5656;
        display: inline-block;
        margin-right: 20px;
    }

    @media screen and (max-width: 1680px) {
        .page-content .login-from {
            top: 50%;
        }

        .protocol-pop .protocol-detail {
            top: 5%;
        }
    }

    @media screen and (max-height: 786px) and (max-width: 1366px) {
        .page-content {
            width: 100%;
        }

        .footer {
            padding-top: 64px;
            height: 126px;
            /* // background: url(../img/logo/md_bg_footer.png) center center no-repeat */
        }

        .protocol-pop .protocol-detail {
            height: 600px;
        }

        .protocol-pop .protocol-detail .detail-content {
            height: 420px;
        }

        .page-content .login-from {
            top: 3%;
        }

        .protocol-pop .protocol-detail {
            top: 5%;
        }
    }

    @media screen and (max-width: 1280px) {
        .protocol-pop .protocol-detail {
            height: 600px;
        }

        .protocol-pop .protocol-detail .detail-content {
            height: 420px;
        }

        .page-content .login-from, .protocol-pop .protocol-detail {
            top: 5%;
        }
    }

    @media screen and (min-width: 1921px) {

        .footer {
            padding-top: 100px;
            height: 171px;
            /* // background: url(../img/logo/big_bg_footer.png) center center no-repeat */
        }
    }

    @media screen and (max-width: 400px) and (max-height: 400px) {
        .page-content {
            background: 0 0;
        }

        .page-content .login-from, .protocol-pop .protocol-detail {
            top: 0;
        }

        .page-content .login-from .language-switcher {
            display: none;
        }
    }

    .user-domain-list {
        position: absolute;
        border-radius: 2px;
        background: #fff;
        border: 1px solid #eee;
        width: 100%;
        z-index: 1000;
        margin-top: 5px;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, .1);
        display: none;
        font-size: 13px;
    }

    .user-domain-list::before {
        content: "请选择登录域";
        font-size: 12px;
        padding: 10px 20px;
        display: block;
    }

    .user-domain-list li {
        line-height: 44px;
        padding: 0 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: normal;
        cursor: pointer;
    }

    .user-domain-list li strong {
        font-weight: 400;
        color: #4D66C6;
    }

    .user-domain-list li.selected {
        background: rgba(105, 157, 244, .1) !important;
    }

    .user-domain-list li:hover {
        background: #fefafa;
        color: #4D66C6;
    }

    .login-from {
        background-color: #fff;
        /*border-radius: 2px;*/
    }

    .login-left {
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 400px;
        width: 235px;
        justify-content: center;
        /*position: absolute;*/
        /*top: 50%;*/
        /*margin-top: -200px;*/
        /*left: 23%;*/
        background-color: #5898E4;
        padding-bottom: 60px;
    }

    .login-left img {
        margin-bottom: 30px;
        margin-top: 0;
    }

    .login-wraper-weops {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 2px 4px 28px 2px rgba(237, 237, 237, 0.8), -4px -4px 48px 2px rgba(36, 129, 216, 0.2);
        border-radius: 2px;
        overflow: hidden;
    }

    input {
        box-shadow: inset 0 0 0 1000px #ffffff !important;
    }

</style>
