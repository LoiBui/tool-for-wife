import { computed, ref } from "vue";
import {
    collection,
    getDocs,
    updateDoc,
    addDoc,
    query,
    where,
    doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { debounce } from "lodash";
import { ElLoading } from "element-plus";

const data = [
    {
        name: "Nguyễn Đình Tuấn Anh",
        key: "nguyen-dinh-tuan-anh",
        price: 865000,
        days: {
            "05/01/2024": 20,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Bùi Công Lợi",
        key: "bui-cong-loi",
        price: 740000,
        days: {
            "03/01/2024": 20,
            "05/01/2024": 0,
            "06/01/2024": 20,
            "12/01/2024": 20,
            "13/01/2024": 40,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Nguyễn Nhật Anh",
        key: "nguyen-nhat-anh",
        price: 670000,
        days: {
            "03/01/2024": 30,
            "05/01/2024": 50,
            "06/01/2024": 30,
            "12/01/2024": 10,
            "13/01/2024": 20,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Đặng Đình Đăng",
        key: "dang-dinh-dang",
        price: 715000,
        days: {
            "03/01/2024": 20,
            "06/01/2024": 20,
            "12/01/2024": 20,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Đặng Đình Diện",
        key: "dang-dinh-dien",
        price: 645000,
        days: {
            "03/01/2024": 20,
            "05/01/2024": 20,
            "06/01/2024": 10,
            "12/01/2024": 20,
            "13/01/2024": 30,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Nguyễn Văn Quang",
        key: "nguyen-van-quang",
        price: 580000,
        days: {
            "06/01/2024": 20,
            "12/01/2024": 40,
            "13/01/2024": 30,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Ly",
        price: 0,
        key: "ly",
        days: {
            "05/01/2024": 10,
            "06/01/2024": 20,
            "12/01/2024": 20,
        },
        active: true,
    },
    {
        name: "Nguyễn Văn Chính",
        key: "nguyen-van-chinh",
        price: 360000,
        days: {
            "03/01/2024": 40,
            "05/01/2024": 0,
            "06/01/2024": 20,
            "12/01/2024": 10,
            "13/01/2024": 20,
        },
        active: true,
        showInput: true,
    },
    {
        name: "Bùi Minh Nguyệt",
        price: 0,
        key: '{"key":"Bùi Minh Nguyệt"}',
        days: {
            "03/01/2024": 10,
            "05/01/2024": 10,
        },
        active: true,
    },
    {
        name: "User Bị Xóa",
        key: "bi-xoa",
        price: 110000,
        days: {
            "03/01/2024": 0,
            "04/01/2024": 0,
            "05/01/2024": 0,
            "06/01/2024": 0,
            "12/01/2024": 0,
            "13/01/2024": 0,
        },
        active: true,
        showInput: false,
    },
];

(async (_) => {
    for (const user of data) {
        const out = await addDoc(collection(db, "users"), {
            active: user.active,
            name: user.name,
            price: user.price,
            order: new Date().getTime(),
            ...(user.key === "bi-xoa" ? { isDeteleUser: true } : {}),
        });

        for (const day of Object.entries(user.days)) {
            await addDoc(collection(db, "days"), {
                userId: out.id,
                day: day[0],
                price: day[1],
                order: new Date().getTime(),
            });
        }
    }
})();
