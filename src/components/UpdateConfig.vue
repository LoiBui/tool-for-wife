<template>
    <div style="display: flex; justify-content: center; margin-top: 100px">
        <div v-if="!isLogged">
            <el-form
                ref="ruleFormRef"
                style="max-width: 600px"
                :model="ruleForm"
                status-icon
                :rules="rules"
                label-width="auto"
                class="demo-ruleForm"
            >
                <el-form-item label="Username" prop="username">
                    <el-input v-model="ruleForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input
                        v-model="ruleForm.password"
                        type="password"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-form-item>
                    <div
                        style="
                            display: flex;
                            justify-content: end;
                            margin-top: 20px;
                        "
                    >
                        <el-button
                            type="primary"
                            @click="submitForm(ruleFormRef)"
                        >
                            Submit
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div v-else style="width: 400px">
            <div>
                <el-radio-group v-model="config.project" size="large">
                    <el-radio-button :label="1">Solana PVT1</el-radio-button>
                    <el-radio-button :label="2">Solana PVT2</el-radio-button>
                </el-radio-group>

                <el-card style="margin-top: 20px">
                    <template #header>
                        <div class="card-header">
                            <span>PushMessage.js</span>
                        </div>
                    </template>

                    <div>
                        <label for="">LIQUIDITY</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <el-input-number v-model="config.liquid.from" />
                            <span>to</span>
                            <el-input-number v-model="config.liquid.to" />
                        </div>
                    </div>
                    <hr style="margin: 20px 0px" />
                    <div>
                        <label for="">TRADING VOLUME</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <el-input-number
                                v-model="config.tradingVolume.from"
                            />
                            <span>to</span>
                            <el-input-number
                                v-model="config.tradingVolume.to"
                            />
                        </div>
                    </div>
                    <hr style="margin: 20px 0px" />
                    <div>
                        <label for="">MARKETCAP</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <el-input-number v-model="config.marketCap.from" />
                            <span>to</span>
                            <el-input-number v-model="config.marketCap.to" />
                        </div>
                    </div>
                    <hr style="margin: 20px 0px" />
                    <div>
                        <label for="">TOP 10 WALLET</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <el-input-number
                                v-model="config.top10Wallet.from"
                            />
                            <span>to</span>
                            <el-input-number v-model="config.top10Wallet.to" />
                        </div>
                    </div>
                    <hr style="margin: 20px 0px" />
                    <div>
                        <label for="">DEV WALLET WALLET</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <el-input-number v-model="config.devWallet.from" />
                            <span>to</span>
                            <el-input-number v-model="config.devWallet.to" />
                        </div>
                    </div>
                </el-card>
                <div
                    style="
                        display: flex;
                        justify-content: end;
                        margin-top: 20px;
                    "
                    @click="handleClick"
                >
                    <el-button type="primary">Save</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElNotification } from "element-plus";
import { reactive, ref } from "vue";

const ruleFormRef = ref();
const isLogged = ref(false);

const username = "admin";
const password = "Hasan@203040";

if (
    localStorage.getItem("username") === username &&
    localStorage.getItem("password") === password
) {
    isLogged.value = true;
}

const ruleForm = reactive({
    username: "",
    password: "",
});

const rules = reactive({
    password: [{ required: true, trigger: "blur" }],
    username: [{ required: true, trigger: "blur" }],
});

const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            if (
                ruleForm.username.trim() === "admin" &&
                ruleForm.password.trim() === "Hasan@203040"
            ) {
                localStorage.setItem("username", ruleForm.username.trim());
                localStorage.setItem("password", ruleForm.password.trim());
                isLogged.value = true;
            } else {
                ElNotification({
                    title: "Error",
                    message: "wrong username or password!!",
                    type: "error",
                });
            }
        } else {
            console.log("error submit!");
        }
    });
};

const config = reactive({
    project: 1,
    liquid: {
        from: 10000,
        to: 80000,
    },
    tradingVolume: {
        from: 90000,
        to: 150000,
    },
    marketCap: {
        from: 55000,
        to: 80000,
    },
    top10Wallet: {
        from: 0,
        to: 40,
    },
    devWallet: {
        from: 0,
        to: 10,
    },
});

const handleClick = () => {
    console.log(config);
};
</script>
