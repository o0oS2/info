document.addEventListener("DOMContentLoaded", function () {
  // Giá trị mặc định cho một số phụ cấp
  const defaultValues = {
    pcDiLai: 500000,
    pcChuyenCan: 200000,
    pcThamNien: 400000
  };

  // Khởi tạo giá trị mặc định
  document.getElementById("pcDiLai").value = defaultValues.pcDiLai;
  document.getElementById("pcChuyenCan").value = defaultValues.pcChuyenCan;
  document.getElementById("pcThamNien").value = defaultValues.pcThamNien;

  // Tạo mảng tất cả input và select để xử lý focus Enter và cập nhật
  const inputs = Array.from(document.querySelectorAll("input, select"));
  inputs.forEach((input, index) => {
    // Chuyển focus khi nhấn Enter
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const next = inputs[index + 1];
        if (next) next.focus();
      }
    });
    // Tính lương ngay khi thay đổi
    input.addEventListener("input", tinhLuong);
  });

  function tinhLuong() {
    // Lấy dữ liệu đầu vào
    const luongCoBan = +document.getElementById("luongCoBan").value || 0;
    const ngayCongChuan = +document.getElementById("ngayCongChuan").value || 26; // Mặc định 26 ngày
    const phuCapThamNien = +document.getElementById("pcThamNien").value || 0;
    const phuCapChucVu = +document.getElementById("pcChucVu").value || 0;
    const hoTroDiLai = +document.getElementById("pcDiLai").value || 0;
    const ngayCong = +document.getElementById("ngayCong").value || 0;
    const phepNam = +document.getElementById("phepNam").value || 0;

    // Kiểm tra phụ cấp chuyên cần
    const ngayNghi = ngayCongChuan - (ngayCong + phepNam); // Số ngày nghỉ không phép
    const pcChuyenCan = ngayNghi > 1 ? 0 : +document.getElementById("pcChuyenCan").value || 0;

    // Lương cơ bản phân theo ngày và giờ
    const luongNgayCong = luongCoBan / ngayCongChuan;
    const luongMotGio = luongNgayCong / 8; // 1 ngày = 8 giờ
    const luongTangCa = (luongCoBan + phuCapThamNien + phuCapChucVu + hoTroDiLai) / ngayCongChuan / 8;
    const troCapDem = luongMotGio; // Trợ cấp đêm tính dựa trên lương giờ cơ bản

    // Hàm tính và cập nhật tiền từng loại
    function updateTien(idSo, idTien, calc) {
      const val = +document.getElementById(idSo).value || 0;
      const tien = Math.round(calc(val));
      battery://document.getElementById(idTien).textContent = tien.toLocaleString("vi-VN");
      return tien;
    }

    // Tính lần lượt các khoản
    let tong = 0;
    tong += updateTien("ngayCong", "tienNgayCong", so => luongNgayCong * so);
    tong += updateTien("tc150", "tienTC150", so => luongTangCa * 1.5 * so);
    tong += updateTien("tc200", "tienTC200", so => luongTangCa * 2 * so);
    tong += updateTien("tcDem30", "tienDem30", so => troCapDem * 0.3 * so);
    tong += updateTien("ngayCong200", "tienCong200", so => luongNgayCong * 2 * so);
    tong += updateTien("tc300", "tienTC300", so => luongTangCa * 3 * so);
    tong += updateTien("tc340", "tienTC340", so => luongTangCa * 3.4 * so);
    tong += updateTien("tcDem70", "tienDem70", so => troCapDem * 0.7 * so);
    tong += updateTien("phepNam", "tienPhepNam", so => luongNgayCong * so);
    tong += updateTien("le", "tienLe", so => luongNgayCong * so);

    // Tính tổng từ bảng phụ (giờ công hành chính, tăng ca, đêm)
    const tienNgayLeTet = calcBangPhu(luongMotGio, luongTangCa);
    document.getElementById("tienNgayLeTet").textContent = tienNgayLeTet.toLocaleString("vi-VN");
    tong += tienNgayLeTet;

    // Cộng thêm các phụ cấp khác
    const phuCaps = [
      "pcABC", "pcChuyenCan", "pcThamNien",
      "pcChucVu", "pcDiLai", "pcDienThoai",
      "pcTreEm", "pcKhac"
    ];
    phuCaps.forEach(id => {
      const value = id === "pcChuyenCan" ? pcChuyenCan : +document.getElementById(id).value || 0;
      tong += value;
    });

    // Cập nhật tổng thu nhập
    document.getElementById("tongLuong").textContent = Math.round(tong).toLocaleString("vi-VN");

    // Khấu trừ BHXH (10.5%) và Công đoàn (1%) tính trên lương đóng BH
    const luongDongBH = luongCoBan + phuCapThamNien + phuCapChucVu;
    const tienTruBHXH = Math.round(luongDongBH * 0.105);
    const tienTruCD = Math.round(luongDongBH * 0.01);
    document.getElementById("tienTruBHXH").textContent = tienTruBHXH.toLocaleString("vi-VN");
    document.getElementById("tienTruCD").textContent = tienTruCD.toLocaleString("vi-VN");

    // Tính thực lĩnh
    const thucLinh = Math.round(tong) - tienTruBHXH - tienTruCD;
    document.getElementById("thucLinh").textContent = thucLinh.toLocaleString("vi-VN");
  }

  // Hàm tính tổng của Bảng Phụ (giờ công hành chính, tăng ca, đêm)
  function calcBangස

System: * Today's date and time is 07:06 PM +07 on Thursday, June 05, 2025.
