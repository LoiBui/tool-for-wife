<template>
    <div
        style="padding: 10px 15px; display: flex; justify-content: center"
        v-if="!isLoading"
    >
        <div style="max-width: 400px">
            <div
                style="
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    gap: 10px;
                "
            >
                <p>Ngày: <br />{{ currentDay }}</p>
                <div style="width: 10px"></div>
                <p>
                    <span style="white-space: nowrap">Hôm nay:</span> <br />
                    {{
                        ((totalPriceToday || 0) * 1000).toLocaleString("vi-VI")
                    }}
                </p>
                +
                <p>
                    <span style="white-space: nowrap">Hiện tại:</span> <br />
                    <input
                        type="text"
                        v-model="totalPriceGlobal"
                        style="
                            border: none;
                            width: 66px;
                            outline: none;
                            font-weight: bold;
                        "
                        :readonly="!isAllowModifier"
                        @blur="onPriceGlobalBlur"
                    />
                </p>
                =
                <p>
                    <span style="white-space: nowrap">Sau hôm nay:</span> <br />
                    <span>{{ priceAfterDay.toLocaleString("vi-VI") }} VND</span>
                </p>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col
                        :span="12"
                        v-for="item in usersToday"
                        :key="item._id"
                    >
                        <div style="display: flex; margin-top: 8px">
                            <p style="margin-bottom: 6px; font-size: 12px">
                                {{ item.name }}
                                <span v-if="item.countMatch > 0"
                                    >(<span
                                        style="color: red; font-weight: bold"
                                        >{{ item.dayPrice / 10 }}</span
                                    >
                                    /
                                    <span style="font-weight: bold">{{
                                        item.countMatch
                                    }}</span
                                    >)</span
                                >
                            </p>
                            <el-popconfirm
                                width="220"
                                confirm-button-text="OK"
                                cancel-button-text="No, Thanks"
                                icon-color="#626AEF"
                                title="Xóa User?, số tiền của user sẽ thêm vào user bị xóa"
                                @confirm="removeUser(item)"
                                v-if="isAllowModifier"
                            >
                                <template #reference>
                                    <el-button
                                        style="margin-top: -8px"
                                        icon="remove"
                                        link
                                        type="danger"
                                    ></el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <div style="display: flex">
                            <el-input
                                class="counter-input"
                                placeholder="Tổng số trận thi đấu"
                                style="width: 35%"
                                v-model="item.countMatch"
                                :disabled="!isAllowModifier"
                                @focus="onFocus"
                                @blur="
                                    onDayPriceChange(
                                        item._id,
                                        item.dayPrice,
                                        item.countMatch
                                    )
                                "
                            ></el-input>
                            <div style="width: 4px"></div>
                            <el-input-number
                                v-model="item.dayPrice"
                                :min="0"
                                :step="10"
                                @change="
                                    onDayPriceChange(
                                        item._id,
                                        item.dayPrice,
                                        item.countMatch + 1
                                    )
                                "
                                :disabled="!isAllowModifier"
                                style="width: 100%"
                                :style="{
                                    border:
                                        maxPriceToday === item.dayPrice &&
                                        item.dayPrice != 0
                                            ? '1px solid red'
                                            : 'unset',
                                    'border-radius':
                                        maxPriceToday === item.dayPrice
                                            ? '4px'
                                            : 'unset',
                                }"
                            />
                        </div>
                    </el-col>
                </el-row>
            </div>
            <el-table
                style="margin-top: 20px"
                :data="userList"
                border
                @row-click="handleRowClick"
            >
                <el-table-column label="#" width="38">
                    <template #default="scope">
                        <p
                            style="
                                text-align: center;
                                font-weight: bold;
                                font-size: 11px;
                            "
                        >
                            {{ scope.$index + 1 }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="Tên  (Thua/Tổng)"
                    width="240"
                >
                    <template #default="scope">
                        <span
                            :style="{
                                opacity: scope.$index < 3 ? 1 : 0,
                            }"
                        >
                            <template v-if="scope.$index === 0"> 🏅 </template>
                            <template v-else-if="scope.$index === 1">
                                🥈
                            </template>
                            <template v-else> 🥉 </template>
                        </span>
                        {{ scope.row.name }}
                        <span v-if="scope.row.totalMatch > 0"
                            >(<span style="color: red; font-weight: bold">{{
                                scope.row.totalMatchLost
                            }}</span>
                            /
                            <span style="font-weight: bold">{{
                                scope.row.totalMatch
                            }}</span
                            >)</span
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="Tổng Tiền">
                    <template #default="scope">
                        <el-tag disable-transitions>{{
                            scope.row.totalPrice.toLocaleString("vi-VI") +
                            " VND"
                        }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 40px" v-show="isAllowModifier">
                <h4>Thêm User</h4>
                <el-input v-model="input" placeholder="Nhập tên" />
                <el-button
                    @click="addUser(input) && (input = '')"
                    style="margin-top: 10px"
                    type="primary"
                    >Thêm</el-button
                >
            </div>

            <el-dialog v-model="dialogVisible" :fullscreen="true">
                <div v-if="dialogVisible">
                    <Chart :chartData="chartData" />
                </div>

                <el-table
                    style="margin-top: 20px"
                    :data="[...userDetailDay].reverse()"
                    border
                >
                    <el-table-column prop="day" label="Ngày" width="150" />
                    <el-table-column prop="price" label="Tổng Tiền">
                        <template #default="scope">
                            <el-tag disable-transitions>{{
                                scope.row.price.toLocaleString("vi-VI") + " VND"
                            }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="Thua/Tổng">
                        <template #default="scope">
                            <p v-if="scope.row.countMatch > 0">
                                {{ scope.row.price / 10000 }} /
                                {{ scope.row.countMatch }}
                            </p>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useUsers } from "@/composables/useFirestore";
import Chart from "./Chart";

const input = ref("");
const {
    userList,
    usersToday,
    isLoading,
    totalPriceToday,
    onDayPriceChange,
    maxPriceToday,
    currentDay,
    isAllowModifier,
    priceAfterDay,
    totalPriceGlobal,
    removeUser,
    addUser,
    onPriceGlobalBlur,
} = useUsers();

const onFocus = (e) => {
    e.target.select();
};

//detail user
const dialogVisible = ref(false);

const chartData = reactive({
    labels: [],
    datasets: [
        {
            label: "Cubic interpolation (monotone)",
            data: [],
            borderColor: "orange",
            fill: false,
            cubicInterpolationMode: "monotone",
            tension: 0.4,
        },
    ],
});

const userDetailDay = ref([]);
const handleRowClick = (a) => {
    console.log(a);
    let days = Object.entries(a.days || {}).sort((x, y) => {
        return x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0;
    });

    if (days.length <= 0) {
        return ElMessage({
            type: "warning",
            message: `Không có dữ liệu hiển thị`,
        });
    }

    chartData.labels = days.map((item) => item[0]);
    chartData.datasets[0].data = days.map((item) => item[1]);
    chartData.datasets[0].label = a.name;

    userDetailDay.value = days.map((item) => {
        return {
            day: item[0],
            price: item[1] * 1000,
            countMatch: a?.countMatchs?.[item[0]] || 0,
        };
    });

    dialogVisible.value = true;
};
</script>
<style>
.counter-input input {
    text-align: center;
}
</style>
