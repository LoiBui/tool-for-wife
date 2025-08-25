var XLSX = require("xlsx");
const excel = require("exceljs");
const FileSaver = require("file-saver");

const rowValue = [
    {
        key: "Tên chiến dịch",
        keyOther: [
            "Tên nhóm quảng cáo".toLocaleLowerCase().replaceAll(" ", ""),
            "Tên nhóm".toLocaleLowerCase().replaceAll(" ", ""),
        ],
    },
    {
        key: "Số tiền đã chi tiêu (VND)",
        isPrice: true,
    },
    {
        key: "Kết quả",
    },
    {
        key: "Chi phí trên mỗi kết quả",
        keyOther: [
            "Chi phí trên mỗi kết quả".toLocaleLowerCase().replaceAll(" ", ""),
        ],
    },
    {
        key: "CPM (Chi phí trên mỗi 1.000 lần hiển thị) (VND)",
        isPrice: true,
        keyOther: [
            "CPM (Chi phí trên mỗi 1.000 lượt hiển thị) (VND)"
                .toLocaleLowerCase()
                .replaceAll(" ", ""),
        ],
    },
    {
        key: "CPC (Tất cả) (VND)",
        isPrice: true,
        keyOther: ["CPC (all) (VND)".toLocaleLowerCase().replaceAll(" ", "")],
    },
    {
        key: "CTR (Tất cả)",
        isRound: true,
        keyOther: ["CTR (all)".toLocaleLowerCase().replaceAll(" ", "")],
    },
    {
        key: "ThruPlay",
    },
    {
        key: "Lượt phát 25% thời lượng video",
    },
    {
        key: "Lượt phát 95% thời lượng video",
    },
];
export const exportResultFileExcel = (file, optionKey = []) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = () => {
        const buffer = reader.result;

        const workbook = XLSX.read(buffer, {
            type: "binary",
            cellDates: true,
            cellNF: false,
            cellText: false,
        });

        let checkHeaderRow = true;
        let headerRow = [];
        workbook.SheetNames.forEach(function (sheetName) {
            // Here is your object
            //   var XL_row_object =
            const combineData = XLSX.utils
                .sheet_to_row_object_array(workbook.Sheets[sheetName], {
                    blankRows: false,
                    defval: "",
                })
                ?.filter((row) => {
                    const find = Object.entries(row).find((item) => {
                        if (item[0].includes("Số tiền đã chi tiêu")) {
                            return true;
                        }
                        return false;
                    });
                    return Number(find?.[1]) > 0;
                })
                .map((row) => {
                    const excelRow = Object.entries(row);

                    const out = [];
                    rowValue.forEach((element) => {
                        const find = excelRow.find(
                            (item) =>
                                item[0]
                                    .toLocaleLowerCase()
                                    .replaceAll(" ", "") ===
                                    element.key
                                        .toLocaleLowerCase()
                                        .replaceAll(" ", "") ||
                                element?.keyOther?.includes(
                                    item[0]
                                        .toLocaleLowerCase()
                                        .replaceAll(" ", "")
                                )
                        );

                        const obj = {
                            key: element.key,
                        };

                        const formatValue = (el, value) => {
                            if (el?.isPrice) {
                                return Math.ceil(Number(value[1]));
                            } else if (el?.isRound) {
                                return Math.round(Number(value[1]) * 100) / 100;
                            } else {
                                return value[1];
                            }
                        };

                        if (optionKey.includes(element?.modelCheck)) {
                            obj.value = find
                                ? formatValue(element, find)
                                : element.default || "";
                            out.push(obj);
                            if (checkHeaderRow) {
                                headerRow.push([obj.key]);
                            }
                        } else if (find) {
                            obj.value = formatValue(element, find);
                            out.push(obj);
                            if (checkHeaderRow) {
                                headerRow.push([obj.key]);
                            }
                        } else {
                            obj.value = "";
                            out.push(obj);
                        }
                    });
                    checkHeaderRow = false;
                    return out;
                });
            writeFile(combineData, headerRow);
        });
    };
};

export const writeFile = (data, headerRow) => {
    const rowData = headerRow;

    const workbook = new excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1", {
        pageSetup: {
            fitToWidth: 1,
        },
    });
    data.forEach((row) => {
        row.forEach((element, index) => {
            rowData[index]?.push(element.value);
        });
    });
    sheet.addRows(rowData);

    let columnIndex = 1;
    sheet.getColumn(1).font = {
        bold: true,
    };
    sheet.getColumn(1).width = 45;
    for (columnIndex; columnIndex <= sheet.columnCount; columnIndex++) {
        if (columnIndex === 1) continue;
        sheet.getColumn(columnIndex).width = 28;
        sheet.getColumn(columnIndex).alignment = {
            wrapText: true,
        };
    }

    workbook.xlsx.writeBuffer().then(function (data) {
        var blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(blob, "ouput.xlsx");
    });
};
