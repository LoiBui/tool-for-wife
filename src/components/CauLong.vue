<template>
  <div style="padding: 40px">
    <div>
      <el-row :gutter="20">
        <el-col
          style="margin-top: 10px"
          :span="12"
          v-for="(item, index) in localData.filter(
            (item) => item.active && item.showInput !== false
          )"
          :key="item.key"
        >
          <div style="display: flex">
            <p style="margin-bottom: 6px; font-size: 12px">{{ item.name }}</p>
            <el-popconfirm
              width="220"
              confirm-button-text="OK"
              cancel-button-text="No, Thanks"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="Xóa User?, số tiền của user sẽ thêm vào user bị xóa"
              @confirm="removeUser(item, index)"
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
          <el-input-number
            v-model="item.days[currentDay]"
            :min="0"
            :step="10"
          />
        </el-col>
      </el-row>
    </div>
    <el-table
      style="margin-top: 40px"
      :data="localData.filter((item) => item.active)"
      border
    >
      <el-table-column prop="name" label="Tên" width="220" />
      <el-table-column prop="price" label="Tổng Tiền">
        <template #default="scope">
          <el-tag disable-transitions>{{ calculatorPrice(scope.row) }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 40px">
      <h4>Thêm User</h4>
      <el-input v-model="input" placeholder="Nhập tên" />
      <el-button @click="addUser" style="margin-top: 10px" type="primary"
        >Thêm</el-button
      >
    </div>

    <div style="margin-top: 100px">
      <p>Backup</p>
      <p style="white-space: nowrap; overflow-x: auto; font-size: 12px">
        {{ JSON.stringify(localData) }}
      </p>
      <el-button @click="copyBackup" style="margin-top: 10px" type="primary"
        >Copy</el-button
      >

      <el-popconfirm
        width="220"
        confirm-button-text="OK"
        cancel-button-text="No, Thanks"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="Are you sure to delete this?"
        @confirm="clearStorage"
      >
        <template #reference>
          <el-button style="margin-top: 10px" type="primary">Clear</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";

const calculatorPrice = (row) => {
  return (
    (
      (row?.price || 0) +
      (Object.entries(row.days).reduce((prev, current) => {
        return prev + current[1];
      }, 0) || 0) *
        1000
    ).toLocaleString("vi-VI") + " VND"
  );
};

const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;
  return formattedToday;
};

const users = [
  {
    name: "Bùi Công Lợi",
    key: "bui-cong-loi",
    price: 740000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Nguyễn Nhật Anh",
    key: "nguyen-nhat-anh",
    price: 670000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Đặng Đình Đăng",
    key: "dang-dinh-dang",
    price: 715000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Nguyễn Đình Tuấn Anh",
    key: "nguyen-dinh-tuan-anh",
    price: 865000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Nguyễn Văn Quang",
    key: "nguyen-van-quang",
    price: 580000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Nguyễn Văn Chính",
    key: "nguyen-van-chinh",
    price: 360000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Đặng Đình Diện",
    key: "dang-dinh-dien",
    price: 645000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "Nguyễn Văn Nghĩa",
    key: "nguyen-van-nghia",
    price: 110000,
    days: {},
    active: true,
    showInput: true
  },
  {
    name: "User Bị Xóa",
    key: "bi-xoa",
    price: 0,
    days: {},
    active: true,
    showInput: false
  }
];

const initLocalData = JSON.parse(localStorage.getItem("users")) || users;

const currentDay = getCurrentDate();
for (const item of initLocalData) {
  const find = Object.entries(item.days).find((item) => item[0] === currentDay);
  if (!find) {
    item.days[currentDay] = 0;
  }
}

const localData = reactive(initLocalData.filter((item) => item.active));

watch(localData, (newValue) => {
  localStorage.setItem("users", JSON.stringify(newValue));
});

//add user
const input = ref("");

const addUser = (_) => {
  if (input.value.trim() === "") return;
  localData.push({
    name: input.value,
    price: 0,
    key: JSON.stringify({ key: input.value }),
    days: {
      [currentDay]: 0
    },
    active: true
  });
  input.value = "";
};

const copyClipboard = (value) => {
  const input = document.createElement("input");
  input.value = value;
  input.style.opacity = 0;

  document.body.append(input);

  input.select();
  input.setSelectionRange(0, 99999);

  try {
    document.execCommand("copy");
  } catch (error) {
    console.log("document.execCommand:: ", error);
  }
  try {
    navigator.clipboard.writeText(input.value);
  } catch (error) {
    console.log("navigator.clipboard:: ", error);
  }

  input.remove();
};

const copyBackup = (_) => {
  copyClipboard(JSON.stringify(localData));
};

const clearStorage = (_) => {
  localStorage.removeItem("users");
};

const removeUser = (row, index) => {
  localData[index].active = false;

  const find = localData.find((item) => item.key === "bi-xoa");

  if (find) {
    find.price +=
      (row?.price || 0) +
      (Object.entries(row.days).reduce((prev, current) => {
        return prev + current[1];
      }, 0) || 0) *
        1000;
  }
};
</script>
