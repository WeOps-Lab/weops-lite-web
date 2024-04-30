<template>
    <div class="asso-info">
        <el-radio-group v-model="active" size="small" class="mb20">
            <el-radio-button label="列表"></el-radio-button>
            <el-radio-button label="拓扑"></el-radio-button>
        </el-radio-group>
        <div v-if="active === '列表'">
            <list
                :group-list="groupList"
                :user-list="userList"
                :connect-type-list="connectTypeList"
                :model-info-list="modelInfoList"
                :property-list="propertyList"
            />
        </div>
        <asso-topo v-else
            :model-info-list="modelInfoList"
            :connect-type-list="connectTypeList"
            :group-list="groupList"
            :user-list="userList"
        />
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
