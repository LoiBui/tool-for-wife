import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

(async (_) => {
    const data = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "days")),
        getDocs(collection(db, "price-clb")),
    ]);

    console.log(
        JSON.stringify(data.map((item) => item.docs.map((it) => it.data())))
    );
})();
