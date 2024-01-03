<template>
  <div style="padding: 40px">
    <el-upload
      class="upload-demo"
      drag
      :on-change="handleChange"
      :action="null"
      :show-file-list="false"
      :auto-upload="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
    <div v-if="fileName" style="margin: 10px 0">
      Current File: {{ fileName }}
    </div>

    <div style="margin: 20px 0">
      <h3>Option</h3>
      <div
        style="
          border: 1px solid var(--el-border-color);
          border-radius: 8px;
          padding: 10px 15px;
        "
      >
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >Check all</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            size="large"
            v-for="city in cities"
            :key="city.key"
            :label="city.key"
            >{{ city.label }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>

    <el-button @click="handleExport" icon="Upload" type="primary"
      >Xuất File</el-button
    >
  </div>
</template>

<script setup>
import { ref } from "vue";
import { exportResultFileExcel } from "./support/BusinessExcel";
import { ElMessage } from "element-plus";

const checkAll = ref(true);
const isIndeterminate = ref(false);

const cities = [
  {
    key: "stl",
    label: "Thêm số tiền - like"
  },
  {
    key: "ctr",
    label: "Thêm CTR duy nhất (Tất cả)"
  },
  {
    key: "ltt",
    label: "Thêm Like/TT"
  }
];

const checkedCities = ref(cities.map((item) => item.key));

const handleCheckAllChange = (val) => {
  checkedCities.value = val ? cities.map((item) => item.key) : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
};

const fileName = ref("");
const fileUpload = ref(null);

const handleChange = (file) => {
  fileName.value = file.name;
  fileUpload.value = file.raw;
};

const handleExport = () => {
  if (!fileUpload.value) {
    return ElMessage({
      type: "error",
      message: `Vui lòng Upload file báo cáo`
    });
  }

  exportResultFileExcel(fileUpload.value, checkedCities.value);
};
</script>
