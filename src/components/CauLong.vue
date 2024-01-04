<template>
  <div style="padding: 10px 40px">
    <div style="font-size: 12px; display: flex; font-weight: bold; gap: 20px">
      <p>Ngày: {{ currentDay }}</p>
      <p>
        Hôm nay:
        {{ ((totalPriceToday || 0) * 1000).toLocaleString("vi-VI") }} VND
      </p>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col
          :span="12"
          v-for="item in localData.filter(
            (item) => item.active && item.showInput !== false
          )"
          :key="item.key"
        >
          <div style="display: flex; margin-top: 8px">
            <p style="margin-bottom: 6px; font-size: 12px">{{ item.name }}</p>
            <el-popconfirm
              width="220"
              confirm-button-text="OK"
              cancel-button-text="No, Thanks"
              icon-color="#626AEF"
              title="Xóa User?, số tiền của user sẽ thêm vào user bị xóa"
              @confirm="removeUser(item)"
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
            :style="{
              border:
                maxPrice() === item.days[currentDay] &&
                item.days[currentDay] != 0
                  ? '1px solid red'
                  : 'unset',
              'border-radius':
                maxPrice() === item.days[currentDay] ? '4px' : 'unset'
            }"
          />
        </el-col>
      </el-row>
    </div>
    <el-table
      style="margin-top: 20px"
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
        icon-color="#626AEF"
        title="Are you sure to delete this?"
        @confirm="clearStorage"
      >
        <template #reference>
          <el-button style="margin-top: 10px" type="primary">Clear</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div style="margin-top: 100px">
      <p>Restore</p>
      <el-input
        v-model="textarea"
        :rows="4"
        type="textarea"
        placeholder="Please input"
      />
      <el-button @click="restore" style="margin-top: 10px" type="primary"
        >Restore</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

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

const totalPriceToday = computed((_) => {
  return localData.reduce((prev, curr) => {
    return prev + (curr.active ? curr?.days?.[currentDay] || 0 : 0);
  }, 0);
});

const maxPrice = (_) => {
  return localData.reduce((accumulator, currentValue) => {
    return Math.max(
      currentValue?.active
        ? currentValue?.days?.[currentDay]
        : Number.MIN_VALUE,
      accumulator
    );
  }, Number.MIN_VALUE);
};

watch(localData, (newValue) => {
  localStorage.setItem("users", JSON.stringify(newValue));
});

//add user
function slugify(string) {
  const a =
    "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
  const b =
    "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");
  return string
    .toString()
    .toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a")
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e")
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, "i")
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o")
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u")
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y")
    .replace(/đ/gi, "d")
    .replace(/\s+/g, "-")
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
const input = ref("");

const addUser = (_) => {
  if (input.value.trim() === "") return;
  localData.splice(localData.length - 1, 0, {
    name: input.value,
    price: 0,
    key: slugify(input.value),
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

const removeUser = (row) => {
  const findInd = localData.findIndex((it) => it.key === row.key);

  localData[findInd].active = false;

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

//restore
const textarea = ref("");
const restore = (_) => {
  try {
    if (textarea.value?.trim() === "") return;
    const val = JSON.parse(textarea.value);
    localStorage.setItem("users", JSON.stringify(val));

    textarea.value = "";
  } catch (error) {}
};
</script>
