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
// import "./import";

const calculatorPrice = (row) => {
    return (
        (row?.price || 0) +
        (Object.entries(row?.days || {}).reduce((prev, current) => {
            return prev + current[1];
        }, 0) || 0) *
            1000
    );
};

const getCurrentDate = (date) => {
    const today = date || new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    return formattedToday;
};

export const useUsers = (_) => {
    const users = ref([]);
    const usersToday = ref([]);
    const currentDay = getCurrentDate();
    const isLoading = ref(true);
    const isAllowModifier = ref(window.location.href.includes("bcl142861"));

    const fetchingData = async (showLoaing = false) => {
        let loading = null;
        if (showLoaing) {
            loading = ElLoading.service({ fullscreen: true });
            isLoading.value = true;
        }
        try {
            const result = [];

            const querySnapshot = await getDocs(collection(db, "users"));
            const querySnapshotDays = await getDocs(collection(db, "days"));

            querySnapshot.forEach((doc) => {
                result.push({
                    _id: doc.id,
                    dayPrice: 0,
                    ...doc.data(),
                });
            });

            querySnapshotDays.forEach((element) => {
                const doc = element.data();
                const user = result.find((item) => {
                    return item._id === doc.userId;
                });

                if (!user.days) {
                    user.days = [];
                }

                if (doc.day === currentDay) {
                    user.dayPrice = doc.price;
                }

                user.days[doc.day] = doc.price;
            });

            users.value = [...result];

            usersToday.value = result
                .filter((item) => item.isDeteleUser !== true && item.active)
                .sort((x, y) => {
                    return x.order < y.order ? -1 : x.order > y.order ? 1 : 0;
                });
        } catch (error) {
            console.log(error);
            users.value = [];
        } finally {
            loading?.close();
            isLoading.value = false;
        }
    };

    fetchingData(true);

    const userList = computed((_) => {
        return users.value
            .filter((item) => item.active)
            .sort((a, b) => {
                if (a.isDeteleUser) {
                    return 1;
                }
                if (calculatorPrice(a) > calculatorPrice(b)) {
                    return -1;
                } else if (calculatorPrice(a) < calculatorPrice(b)) {
                    return 1;
                }
                return 0;
            })
            .map((item) => {
                return {
                    ...item,
                    totalPrice: calculatorPrice(item),
                };
            });
    });

    const onDayPriceChange = debounce(async function (_id, price) {
        const check = await query(
            collection(db, "days"),
            where("userId", "==", _id),
            where("day", "==", currentDay)
        );

        const querySnapshot = await getDocs(check);

        if (querySnapshot.empty) {
            await addDoc(collection(db, "days"), {
                userId: _id,
                price,
                day: currentDay,
                order: new Date().getTime(),
            });
        } else {
            await updateDoc(doc(db, "days", querySnapshot.docs[0].id), {
                price,
                order: new Date().getTime(),
            });
        }

        fetchingData();
    }, 500);

    const totalPriceToday = computed((_) => {
        return usersToday.value.reduce((prev, curr) => {
            return prev + (curr.active ? curr?.dayPrice || 0 : 0);
        }, 0);
    });

    const maxPriceToday = computed((_) => {
        return usersToday.value.reduce((accumulator, currentValue) => {
            return Math.max(
                currentValue?.active
                    ? currentValue?.dayPrice
                    : Number.MIN_VALUE,
                accumulator
            );
        }, Number.MIN_VALUE);
    });

    const removeUser = async (item) => {
        const loading = ElLoading.service({ fullscreen: true });
        const check = await query(
            collection(db, "users"),
            where("isDeteleUser", "==", true)
        );

        const querySnapshot = await getDocs(check);

        if (!querySnapshot.empty) {
            await updateDoc(doc(db, "users", querySnapshot.docs[0].id), {
                price:
                    calculatorPrice(item) +
                    calculatorPrice(querySnapshot.docs[0].data()),
            });
            await updateDoc(doc(db, "users", item._id), {
                active: false,
            });
        }

        await fetchingData();

        loading.close();
    };

    const addUser = async (input) => {
        const loading = ElLoading.service({ fullscreen: true });
        try {
            if (input.trim() === "") return;
            await addDoc(collection(db, "users"), {
                active: true,
                name: input,
                price: 0,
                order: new Date().getTime(),
            });

            await fetchingData();
        } catch (error) {
        } finally {
            loading.close();
        }
    };

    return {
        isLoading,
        users,
        userList,
        usersToday,
        fetchingData,
        onDayPriceChange,
        totalPriceToday,
        maxPriceToday,
        removeUser,
        addUser,
        currentDay,
        isAllowModifier,
    };
};
