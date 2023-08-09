export const ADMIN = 1;
export const EMPLOYEE = 2;
export const MAMANGER = 3;
export const ACCOUNTANT = 4;

export const ROLES = [
  {
    roleKey: ADMIN,
    roleName: "Admin",
  },
  {
    roleKey: EMPLOYEE,
    roleName: "Nhân viên",
  },
  {
    roleKey: MAMANGER,
    roleName: "Quản lý",
  },
  {
    roleKey: ACCOUNTANT,
    roleName: "Kế toán",
  },
];

export const POSSTATUS = [
  {
    value: 1,
    label: "Đang hoạt động",
  },
  {
    value: 2,
    label: "Tạm dừng",
  },
  {
    value: 3,
    label: "Đóng",
  },
];

export const BILLPOSSTATUS = [
  {
    value: 1,
    label: "Tiền chưa về",
  },
  {
    value: 2,
    label: "Tiền đã về",
  },
  {
    value: 3,
    label: "Sai Bill",
  },
  {
    value: 4,
    label: "Huỷ Bill",
  },
];

export const WORKINGSTATUSOFSTOREMAKEPOS = [
  {
    value: 1,
    label: "Đã đóng GPKD",
  },
  {
    value: 2,
    label: "Chưa đóng GPKD",
  },
];

export const STATUSOFCARD = [
  {
    value: 1,
    label: "Đang lưu thẻ",
  },
  {
    value: 2,
    label: "Đã trả thẻ",
  },
];

export const GENDERCHOICES = [
  {
    value: 1,
    label: "Nam",
  },
  {
    value: 2,
    label: "Nữ",
  },
  {
    value: 3,
    label: "Khác",
  },
];

export const TRANSACTIONTYPE = [
  {
    value: 1,
    label: "Rút tiền",
  },
  {
    value: 2,
    label: "Đáo thẻ",
  },
];

export const TOLLSTATUS = [
  {
    value: 1,
    label: "Đã thu",
  },
  {
    value: 2,
    label: "Chưa thu",
  },
];

export const COLORROWBYBILLPOSSATUS = {
  1: "table-warning",
  2: "table-success",
  3: "table-danger",
  4: "table-danger",
};

export const INPUTIMAGETYPEACCEPT = ".jpg, .png, .jpeg";
export const INPUTPDFFILETYPEACCEPT = "application/pdf";
