/**

- Ứng dụng tính lương - Đã được tối ưu hóa
- Tác giả: Trần Đức Trung
  */

class SalaryCalculator {
constructor() {
this.defaultValues = {
pcDiLai: 500000,
pcChuyenCan: 200000,
pcThamNien: 400000
};

```
this.elements = {};
this.inputs = [];

this.init();
```

}

/**

- Khởi tạo ứng dụng
  */
  init() {
  this.cacheElements();
  this.setDefaultValues();
  this.bindEvents();
  this.calculate();
  }

/**

- Cache các element DOM để tránh query lặp lại
  */
  cacheElements() {
  // Cache tất cả input và select elements
  this.inputs = Array.from(document.querySelectorAll(“input, select”));

```
// Cache các element thường xuyên được sử dụng
const elementIds = [
  'luongCoBan', 'ngayCongChuan', 'pcThamNien', 'pcChucVu', 'pcDiLai',
  'ngayCong', 'tc150', 'tc200', 'tcDem30', 'ngayCong200', 'tc300', 'tc340',
  'tcDem70', 'phepNam', 'le', 'pcABC', 'pcChuyenCan', 'pcDienThoai',
  'pcTreEm', 'pcKhac',
  'tienNgayCong', 'tienTC150', 'tienTC200', 'tienDem30', 'tienCong200',
  'tienTC300', 'tienTC340', 'tienDem70', 'tienPhepNam', 'tienLe',
  'tienNgayLeTet', 'tongLuong', 'tienTruBHXH', 'tienTruCD', 'thucLinh',
  'soGioHanhChinh1', 'phuLuongHanhChinh', 'tienHanhChinh',
  'soGioTangCa1', 'phuLuongTangCa', 'tienTangCa',
  'soGioDem1', 'phuLuongDem', 'tienTroCapDem',
  'soGioHanhChinh2', 'phuLuongHanhChinh2', 'tienHanhChinh2',
  'soGioTangCa2', 'phuLuongTangCa2', 'tienTangCa2',
  'soGioDem2', 'phuLuongDem2', 'tienTroCapDem2'
];

elementIds.forEach(id => {
  this.elements[id] = document.getElementById(id);
});
```

}

/**

- Thiết lập giá trị mặc định
  */
  setDefaultValues() {
  Object.entries(this.defaultValues).forEach(([key, value]) => {
  if (this.elements[key]) {
  this.elements[key].value = value;
  }
  });
  }

/**

- Bind events cho các input
  */
  bindEvents() {
  this.inputs.forEach((input, index) => {
  // Xử lý phím Enter để chuyển focus
  input.addEventListener(“keydown”, (e) => {
  if (e.key === “Enter”) {
  e.preventDefault();
  this.focusNextInput(index);
  }
  });
  
  // Tính toán lại khi có thay đổi (với debounce)
  input.addEventListener(“input”, this.debounce(() => this.calculate(), 100));
  });
  }

/**

- Chuyển focus đến input tiếp theo
  */
  focusNextInput(currentIndex) {
  const nextInput = this.inputs[currentIndex + 1];
  if (nextInput) {
  nextInput.focus();
  }
  }

/**

- Debounce function để tránh tính toán quá nhiều lần
  */
  debounce(func, wait) {
  let timeout;
  return function executedFunction(…args) {
  const later = () => {
  clearTimeout(timeout);
  func.apply(this, args);
  };
  clearTimeout(timeout);
  timeout = setTimeout(later, wait);
  };
  }

/**

- Lấy giá trị số từ element (với validation)
  */
  getValue(elementId, defaultValue = 0) {
  const element = this.elements[elementId];
  if (!element) return defaultValue;

```
const value = parseFloat(element.value) || defaultValue;
return Math.max(0, value); // Đảm bảo không âm
```

}

/**

- Cập nhật hiển thị tiền tệ
  */
  updateCurrency(elementId, amount) {
  const element = this.elements[elementId];
  if (element) {
  element.textContent = Math.round(amount).toLocaleString(“vi-VN”);
  }
  }

/**

- Tính toán một khoản thu nhập cụ thể
  */
  calculateItem(inputId, outputId, calculator) {
  const value = this.getValue(inputId);
  const amount = calculator(value);
  this.updateCurrency(outputId, amount);
  return amount;
  }

/**

- Tính lương chính
  */
  calculate() {
  try {
  // Lấy dữ liệu đầu vào
  const baseSalary = this.getValue(‘luongCoBan’);
  const standardWorkDays = this.getValue(‘ngayCongChuan’, 26);
  const seniorityAllowance = this.getValue(‘pcThamNien’);
  const positionAllowance = this.getValue(‘pcChucVu’);
  const transportAllowance = this.getValue(‘pcDiLai’);
  
  // Tính lương cơ bản theo ngày và giờ
  const dailyWage = baseSalary / standardWorkDays;
  const overtimeWage = (baseSalary + seniorityAllowance + positionAllowance + transportAllowance) / standardWorkDays / 8;
  const nightAllowanceRate = overtimeWage;
  
  // Tính từng khoản thu nhập
  let totalIncome = 0;
  
  // Thu nhập từ công việc thường
  totalIncome += this.calculateItem(‘ngayCong’, ‘tienNgayCong’, days => dailyWage * days);
  totalIncome += this.calculateItem(‘tc150’, ‘tienTC150’, hours => overtimeWage * 1.5 * hours);
  totalIncome += this.calculateItem(‘tc200’, ‘tienTC200’, hours => overtimeWage * 2 * hours);
  totalIncome += this.calculateItem(‘tcDem30’, ‘tienDem30’, hours => nightAllowanceRate * 0.3 * hours);
  
  // Thu nhập ngày lễ/chủ nhật
  totalIncome += this.calculateItem(‘ngayCong200’, ‘tienCong200’, days => dailyWage * 2 * days);
  totalIncome += this.calculateItem(‘tc300’, ‘tienTC300’, hours => overtimeWage * 3 * hours);
  totalIncome += this.calculateItem(‘tc340’, ‘tienTC340’, hours => overtimeWage * 3.4 * hours);
  totalIncome += this.calculateItem(‘tcDem70’, ‘tienDem70’, hours => nightAllowanceRate * 0.7 * hours);
  
  // Nghỉ phép và lễ
  totalIncome += this.calculateItem(‘phepNam’, ‘tienPhepNam’, days => dailyWage * days);
  totalIncome += this.calculateItem(‘le’, ‘tienLe’, days => dailyWage * days);
  
  // Tính thu nhập từ bảng phụ
  const holidayIncome = this.calculateHolidayTable(dailyWage, overtimeWage, nightAllowanceRate);
  this.updateCurrency(‘tienNgayLeTet’, holidayIncome);
  totalIncome += holidayIncome;
  
  // Cộng các phụ cấp
  const allowances = [‘pcABC’, ‘pcChuyenCan’, ‘pcThamNien’, ‘pcChucVu’, ‘pcDiLai’, ‘pcDienThoai’, ‘pcTreEm’, ‘pcKhac’];
  const totalAllowances = allowances.reduce((sum, id) => sum + this.getValue(id), 0);
  totalIncome += totalAllowances;
  
  // Cập nhật tổng thu nhập
  this.updateCurrency(‘tongLuong’, totalIncome);
  
  // Tính khấu trừ
  const insuranceBase = baseSalary + seniorityAllowance + positionAllowance;
  const socialInsurance = Math.round(insuranceBase * 0.105);
  const unionFee = Math.round(insuranceBase * 0.01);
  
  this.updateCurrency(‘tienTruBHXH’, socialInsurance);
  this.updateCurrency(‘tienTruCD’, unionFee);
  
  // Tính thực lĩnh
  const netSalary = Math.round(totalIncome) - socialInsurance - unionFee;
  this.updateCurrency(‘thucLinh’, netSalary);

```
} catch (error) {
  console.error('Lỗi khi tính lương:', error);
  this.showError('Có lỗi xảy ra khi tính toán. Vui lòng kiểm tra lại dữ liệu nhập.');
}
```

}

/**

- Tính thu nhập từ bảng ngày lễ, tết
  */
  calculateHolidayTable(dailyWage, overtimeWage, nightAllowanceRate) {
  const calculations = [
  {
  hoursId: ‘soGioHanhChinh1’,
  rateId: ‘phuLuongHanhChinh’,
  outputId: ‘tienHanhChinh’,
  baseRate: dailyWage / 8
  },
  {
  hoursId: ‘soGioTangCa1’,
  rateId: ‘phuLuongTangCa’,
  outputId: ‘tienTangCa’,
  baseRate: overtimeWage
  },
  {
  hoursId: ‘soGioDem1’,
  rateId: ‘phuLuongDem’,
  outputId: ‘tienTroCapDem’,
  baseRate: nightAllowanceRate
  },
  {
  hoursId: ‘soGioHanhChinh2’,
  rateId: ‘phuLuongHanhChinh2’,
  outputId: ‘tienHanhChinh2’,
  baseRate: dailyWage / 8
  },
  {
  hoursId: ‘soGioTangCa2’,
  rateId: ‘phuLuongTangCa2’,
  outputId: ‘tienTangCa2’,
  baseRate: overtimeWage
  },
  {
  hoursId: ‘soGioDem2’,
  rateId: ‘phuLuongDem2’,
  outputId: ‘tienTroCapDem2’,
  baseRate: nightAllowanceRate
  }
  ];

```
return calculations.reduce((total, calc) => {
  const hours = this.getValue(calc.hoursId);
  const rate = this.getValue(calc.rateId);
  const amount = Math.round(hours * rate * calc.baseRate / 100);
  
  this.updateCurrency(calc.outputId, amount);
  return total + amount;
}, 0);
```

}

/**

- Hiển thị thông báo lỗi
  */
  showError(message) {
  // Tạo hoặc cập nhật thông báo lỗi
  let errorDiv = document.getElementById(‘error-message’);
  if (!errorDiv) {
  errorDiv = document.createElement(‘div’);
  errorDiv.id = ‘error-message’;
  errorDiv.style.cssText = `position: fixed; top: 20px; right: 20px; background: #dc3545; color: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); z-index: 1000; max-width: 300px;`;
  document.body.appendChild(errorDiv);
  }

```
errorDiv.textContent = message;
errorDiv.style.display = 'block';

// Tự động ẩn sau 5 giây
setTimeout(() => {
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}, 5000);
```

}

/**

- Export dữ liệu (có thể mở rộng cho tính năng in ấn/xuất file)
  */
  exportData() {
  const data = {
  basicSalary: this.getValue(‘luongCoBan’),
  standardDays: this.getValue(‘ngayCongChuan’),
  totalIncome: this.elements.tongLuong?.textContent || ‘0’,
  netSalary: this.elements.thucLinh?.textContent || ‘0’,
  exportDate: new Date().toISOString()
  };

```
return data;
```

}

/**

- Reset form về trạng thái ban đầu
  */
  reset() {
  this.inputs.forEach(input => {
  if (input.type === ‘number’ || input.type === ‘text’) {
  input.value = ‘’;
  } else if (input.tagName === ‘SELECT’) {
  input.selectedIndex = 0;
  }
  });

```
this.setDefaultValues();
this.calculate();
```

}
}

// Utility functions
const utils = {
/**

- Copy số tài khoản
  */
  copySTK() {
  const stk = document.getElementById(‘stk’)?.textContent;
  if (stk && navigator.clipboard) {
  navigator.clipboard.writeText(stk).then(() => {
  utils.showToast(‘Đã copy số tài khoản!’);
  }).catch(() => {
  utils.fallbackCopySTK(stk);
  });
  } else if (stk) {
  utils.fallbackCopySTK(stk);
  }
  },

/**

- Fallback copy method cho các trình duyệt cũ
  */
  fallbackCopySTK(text) {
  const textArea = document.createElement(‘textarea’);
  textArea.value = text;
  textArea.style.position = ‘fixed’;
  textArea.style.opacity = ‘0’;
  document.body.appendChild(textArea);
  textArea.select();

```
try {
  document.execCommand('copy');
  utils.showToast('Đã copy số tài khoản!');
} catch (err) {
  utils.showToast('Không thể copy. Vui lòng copy thủ công: ' + text);
}

document.body.removeChild(textArea);
```

},

/**

- Hiển thị toast notification
  */
  showToast(message, type = ‘success’) {
  const toast = document.createElement(‘div’);
  toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: ${type === 'success' ? '#28a745' : '#dc3545'}; color: white; padding: 12px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); z-index: 1001; transition: all 0.3s ease; opacity: 0; transform: translateY(20px);    `;

```
toast.textContent = message;
document.body.appendChild(toast);

// Animation
requestAnimationFrame(() => {
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
});

// Auto remove
setTimeout(() => {
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  setTimeout(() => {
    if (toast.parentNode) {
      document.body.removeChild(toast);
    }
  }, 300);
}, 3000);
```

}
};

// Khởi tạo ứng dụng khi DOM loaded
document.addEventListener(“DOMContentLoaded”, () => {
window.salaryCalculator = new SalaryCalculator();

// Expose utility functions globally
window.copySTK = utils.copySTK;
window.showToast = utils.showToast;
});

// Service Worker registration (nếu cần offline support)
if (‘serviceWorker’ in navigator) {
window.addEventListener(‘load’, () => {
navigator.serviceWorker.register(’/sw.js’)
.then(registration => {
console.log(’SW registered: ’, registration);
})
.catch(registrationError => {
console.log(’SW registration failed: ’, registrationError);
});
});
}
