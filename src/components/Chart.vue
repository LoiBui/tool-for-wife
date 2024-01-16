<template>
    <Line :data="chartData" :options="options" v-if="type === 'line'" />
    <Bubble v-else />
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line, Bubble } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
    props: { chartData: {}, type: { default: "line" } },
    components: {
        Line,
        Bubble,
    },
    setup() {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        return {
            options,
        };
    },
};
</script>
