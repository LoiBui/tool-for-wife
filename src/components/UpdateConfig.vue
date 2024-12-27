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
                <el-radio-group v-model="project" size="large">
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
                    <hr style="margin: 20px 0px" />
                    <div>
                        <label for="">EXCHANGE</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <el-input
                                v-model="config.exchange"
                                style="width: 240px"
                                placeholder="Please input"
                            />
                        </div>
                    </div>

                    <hr style="margin: 20px 0px" />
                    <div>
                        <label for="">BOT CONFIG</label>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <p>Bot TOKEN</p>
                            <el-input
                                v-model="config.bot.BotToken"
                                style="width: 240px"
                                placeholder="Please input"
                                type="textarea"
                                :rows="4"
                            />
                        </div>
                        <div
                            style="
                                margin-top: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <p>CHANNEL ID</p>
                            <el-input
                                v-model="config.bot.ChannelId"
                                style="width: 240px"
                                placeholder="Please input"
                            />
                        </div>
                    </div>
                </el-card>
                <div
                    style="
                        display: flex;
                        justify-content: end;
                        margin-top: 20px;
                        margin-bottom: 20px;
                    "
                    @click="handleClick"
                >
                    <el-button type="primary">Save</el-button>
                </div>
            </div>
            <div
                style="
                    margin-top: 10px;
                    margin-bottom: 10px;
                "
            >
                <div>LOG</div>
                <el-input
                    :disabled="true"
                    v-model="log"
                    type="textarea"
                    :rows="4"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElLoading, ElNotification } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";

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

const project = ref(1);
const config = reactive({
    liquid: {
        from: 0,
        to: 0,
    },
    tradingVolume: {
        from: 0,
        to: 0,
    },
    marketCap: {
        from: 0,
        to: 0,
    },
    top10Wallet: {
        from: 0,
        to: 0,
    },
    devWallet: {
        from: 0,
        to: 0,
    },
    exchange: "",
    bot: {
        ChannelId: "",
        BotToken: "",
    },
});

const fetchConfig = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("username", localStorage.getItem("username"));
        myHeaders.append("password", localStorage.getItem("password"));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        return await fetch(
            "http://42.116.105.237:8000/get-params",
            requestOptions
        ).then((response) => response.json());
    } catch (error) {
        alert("server error!!!");
    }
};

const dataObj = ref();

onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    const data = await fetchConfig();

    if (data) {
        dataObj.value = data;
    }
    loading.close();
});

const combineValue = computed(() => {
    return { dataObj: dataObj.value, project: project.value };
});

watch(
    combineValue,
    (val) => {
        if (val.project === 1 && val.dataObj[1]) {
            Object.assign(config, val.dataObj[1]);
        } else if (val.dataObj[2]) {
            Object.assign(config, val.dataObj[2]);
        }
    },
    {
        deep: true,
    }
);

const log = ref('');
const handleClick = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    try {
        const myHeaders = new Headers();
        myHeaders.append("username", localStorage.getItem("username"));
        myHeaders.append("password", localStorage.getItem("password"));

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            body: JSON.stringify({
                project: project.value,
                config: config,
            }),
        };

        const res = await fetch(
            "http://42.116.105.237:8000/update-params",
            requestOptions
        ).then((response) => response.json());
        log.value = res?.msg;
    } catch (error) {
        console.log(error);
        alert("server error!!!");
    } finally {
        loading.close();
    }
};
</script>
