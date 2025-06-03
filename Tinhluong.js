document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const DEFAULT_VALUES = {
    pcDiLai: 500000,
    pcChuyenCan: 200000,
    pcThamNien: 400000
  };

  // DOM Elements
  const ELEMENTS = {
    pcDiLai: document.getElementById("pcDiLai"),
    pcChuyenCan: document.getElementById("pcChuyenCan"),
    pcThamNien: document.getElementById("pcThamNien"),
    luongCoBan: document.getElementById("luongCoBan"),
    ngayCongChuan: document.getElementById("ngayCongChuan"),
    tongLuong: document.getElementById("tongLuong"),
    thucLinh: document.getElementById("thucLinh")
  };

  // Initialize default values
  ELEMENTS.pcDiLai.value = DEFAULT_VALUES.pcDiLai;
  ELEMENTS.pcChuyenCan.value = DEFAULT_VALUES.pcChuyenCan;
  ELEMENTS.pcThamNien.value = DEFAULT_VALUES.pcThamNien;

  // Event delegation for inputs
  document.addEventListener("input", function(e) {
    if (e.target.matches("input, select")) {
      tinhLuong();
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && e.target.matches("input, select")) {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll("input, select"));
      const currentIndex = inputs.indexOf(e.target);
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  });

  // Main calculation function
  function tinhLuong() {
    const luongCoBan = +ELEMENTS.luongCoBan.value || 0;
    const ngayCongChuan = +ELEMENTS.ngayCongChuan.value || 1;
    
    const phuCapValues = getPhuCapValues();
    const { luongNgayCong, luongTangCa, troCapDem } = calculateBaseRates(luongCoBan, ngayCongChuan, phuCapValues);
    
    const tienCong = calculateTienCong(luongNgayCong, luongTangCa, troCapDem);
    const tienBangPhu = calcBangPhu(luongNgayCong, luongTangCa, troCapDem);
    const phuCapTong = calculateTotalPhuCap(phuCapValues);
    
    const tongThuNhap = tienCong.total + tienBangPhu + phuCapTong;
    updateTotalDisplay(tongThuNhap, luongCoBan, phuCapValues);
  }

  // Helper functions
  function getPhuCapValues() {
    return {
      pcThamNien: +document.getElementById("pcThamNien").value || 0,
      pcChucVu: +document.getElementById("pcChucVu").value || 0,
      pcDiLai: +document.getElementById("pcDiLai").value || 0,
      pcABC: +document.getElementById("pcABC").value || 0,
      pcChuyenCan: +document.getElementById("pcChuyenCan").value || 0,
      pcDienThoai: +document.getElementById("pcDienThoai").value || 0,
      pcTreEm: +document.getElementById("pcTreEm").value || 0,
      pcKhac: +document.getElementById("pcKhac").value || 0
    };
  }

  function calculateBaseRates(luongCoBan, ngayCongChuan, phuCapValues) {
    const luongNgayCong = luongCoBan / ngayCongChuan;
    const luongTangCa = (luongCoBan + phuCapValues.pcThamNien + phuCapValues.pcChucVu + phuCapValues.pcDiLai) / ngayCongChuan / 8;
    const troCapDem = luongTangCa;
    
    return { luongNgayCong, luongTangCa, troCapDem };
  }

  function calculateTienCong(luongNgayCong, luongTangCa, troCapDem) {
    const calculations = [
      { idSo: "ngayCong", idTien: "tienNgayCong", calc: so => luongNgayCong * so },
      { idSo: "tc150", idTien: "tienTC150", calc: so => luongTangCa * 1.5 * so },
      { idSo: "tc200", idTien: "tienTC200", calc: so => luongTangCa * 2 * so },
      { idSo: "tcDem30", idTien: "tienDem30", calc: so => troCapDem * 0.3 * so },
      { idSo: "ngayCong200", idTien: "tienCong200", calc: so => luongNgayCong * 2 * so },
      { idSo: "tc300", idTien: "tienTC300", calc: so => luongTangCa * 3 * so },
      { idSo: "tc340", idTien: "tienTC340", calc: so => luongTangCa * 3.4 * so },
      { idSo: "tcDem70", idTien: "tienDem70", calc: so => troCapDem * 0.7 * so },
      { idSo: "phepNam", idTien: "tienPhepNam", calc: so => luongNgayCong * so },
      { idSo: "le", idTien: "tienLe", calc: so => luongNgayCong * so }
    ];

    let total = 0;
    calculations.forEach(({idSo, idTien, calc}) => {
      const val = +document.getElementById(idSo).value || 0;
      const tien = Math.round(calc(val));
      document.getElementById(idTien).textContent = tien.toLocaleString("vi-VN");
      total += tien;
    });

    return { total };
  }

  function calculateTotalPhuCap(phuCapValues) {
    return Object.values(phuCapValues).reduce((sum, value) => sum + value, 0);
  }

  function updateTotalDisplay(tongThuNhap, luongCoBan, phuCapValues) {
    ELEMENTS.tongLuong.textContent = Math.round(tongThuNhap).toLocaleString("vi-VN");
    
    const luongDongBH = luongCoBan + phuCapValues.pcThamNien + phuCapValues.pcChucVu;
    const tienTruBHXH = Math.round(luongDongBH * 0.105);
    const tienTruCD = Math.round(luongDongBH * 0.01);
    
    document.getElementById("tienTruBHXH").textContent = tienTruBHXH.toLocaleString("vi-VN");
    document.getElementById("tienTruCD").textContent = tienTruCD.toLocaleString("vi-VN");
    
    const thucLinh = Math.round(tongThuNhap) - tienTruBHXH - tienTruCD;
    ELEMENTS.thucLinh.textContent = thucLinh.toLocaleString("vi-VN");
  }

  function calcBangPhu(luongNgayCong, luongTangCa, troCapDem) {
    const phuLuongConfigs = [
      { soGioId: "soGioHanhChinh1", heSoId: "phuLuongHanhChinh", rowTienId: "tienHanhChinh", loaiLuong: "hanhChinh" },
      { soGioId: "soGioTangCa1", heSoId: "phuLuongTangCa", rowTienId: "tienTangCa", loaiLuong: "tangCa" },
      { soGioId: "soGioDem1", heSoId: "phuLuongDem", rowTienId: "tienTroCapDem", loaiLuong: "dem" },
      { soGioId: "soGioHanhChinh2", heSoId: "phuLuongHanhChinh2", rowTienId: "tienHanhChinh2", loaiLuong: "hanhChinh" },
      { soGioId: "soGioTangCa2", heSoId: "phuLuongTangCa2", rowTienId: "tienTangCa2", loaiLuong: "tangCa" },
      { soGioId: "soGioDem2", heSoId: "phuLuongDem2", rowTienId: "tienTroCapDem2", loaiLuong: "dem" }
    ];

    let tongPhu = 0;
    phuLuongConfigs.forEach(config => {
      const gio = +document.getElementById(config.soGioId).value || 0;
      const heSo = +document.getElementById(config.heSoId).value || 0;
      
      let donGia = 0;
      if (config.loaiLuong === "hanhChinh" || config.loaiLuong === "dem") {
        donGia = luongNgayCong / 800;
      } else if (config.loaiLuong === "tangCa") {
        donGia = luongTangCa / 100;
      }
      
      const tien = Math.round(gio * heSo * donGia);
      document.getElementById(config.rowTienId).textContent = tien.toLocaleString("vi-VN");
      tongPhu += tien;
    });

    document.getElementById("tienNgayLeTet").textContent = tongPhu.toLocaleString("vi-VN");
    return tongPhu;
  }
});
