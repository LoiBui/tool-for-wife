import { computed } from "vue";
import { uniq } from "lodash";

export const useChart = (refData) => {
    const chartDataGlobalUser = computed((_) => {
        console.log(refData);
        let labels =
            (
                refData.value.map((item) =>
                    Object.entries(item?.days || {}).map((day) => day[0])
                ) || []
            )?.flat(1) || [];
        labels = uniq(labels).sort();

        console.log(refData.value);
        const datasets = [];
        for (const label of labels) {
            for (const user of refData.value) {
                if (!datasets[user?._id]) {
                    datasets[user._id] = {
                        label: user.name,
                        data: [],
                        borderColor: "orange",
                        fill: false,
                        cubicInterpolationMode: "monotone",
                        tension: 0.4,
                    };
                }

                const findDay = Object.entries(user?.days || {}).find(
                    (d) => d[0] === label
                );
                datasets[user._id].data.push(findDay?.[1] || 0);
            }
        }

        console.log(datasets);

        return {
            labels,
            datasets: Object.entries(datasets).map((item) => item[1]),
        };
    });

    return { chartDataGlobalUser };
};
