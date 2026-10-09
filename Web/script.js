/* =========================================
   XỬ LÝ FAQ (CÂU HỎI THƯỜNG GẶP)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Đóng tất cả các câu hỏi khác
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle câu hỏi hiện tại
            if (isActive) {
                faqItem.classList.remove('active');
                // Nếu đóng hết thì bỏ blur toàn trang
                if (document.querySelectorAll('.faq-item.active').length === 0) {
                    document.body.classList.remove('faq-focus');
                }
            } else {
                faqItem.classList.add('active');
                // Bật blur toàn trang
                document.body.classList.add('faq-focus');
            }
        });
    });

    // Khi click ra ngoài FAQ, đóng hết và bỏ blur
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.faq-item')) {
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            document.body.classList.remove('faq-focus');
        }
    });
});

/* =========================================
   XỬ LÝ MODAL YÊU CẦU ĐÁNH GIÁ (2 BƯỚC)
   ========================================= */

// Hàm mở modal
function openSurvey() {
    document.getElementById('surveyModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep1();
}

// Hàm đóng modal
// Hàm đóng modal (có hiệu ứng đẹp)
function closeSurvey() {
    const modal = document.getElementById('surveyModal');
    
    // Thêm class closing để kích hoạt hiệu ứng đóng
    modal.classList.add('closing');
    
    // Sau 400ms (bằng thời gian animation), mới thực sự ẩn modal
    setTimeout(() => {
        modal.classList.remove('active');
        modal.classList.remove('closing');
        
        // Reset form và trạng thái
        document.getElementById('surveyForm').reset();
        document.querySelectorAll('.device-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.device-btn').classList.add('active');
        toggleInputs(false);
        
        // Ẩn tooltip
        const tooltip = document.getElementById('mainboardTooltip');
        const icon = document.getElementById('tooltipToggle');
        if (tooltip) tooltip.classList.remove('active');
        if (icon) icon.classList.remove('active');
        
        // Reset mainboard group
        const mainboardGroup = document.getElementById('mainboardGroup');
        mainboardGroup.classList.remove('hidden');
        
        // Cho phép cuộn trang trở lại
        document.body.style.overflow = 'auto';
    }, 400);
}

// Hàm chuyển sang Bước 1
// Hàm chuyển sang Bước 1 (có hiệu ứng)
function goToStep1() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    
    step1.style.display = 'block';
    step1.classList.add('slide-in-left');
    step2.classList.add('slide-out-right');
    
    setTimeout(() => {
        step2.style.display = 'none';
        step2.classList.remove('slide-out-right');
        step1.classList.remove('slide-in-left');
    }, 400);
    
    document.getElementById('stepLabel').textContent = 'BƯỚC 1 TRONG 2';
    document.getElementById('progressFill').style.width = '50%';
}

// Hàm chuyển sang Bước 2 (có hiệu ứng)
function goToStep2(event) {
    if (event) event.preventDefault();

    const unknown = document.getElementById('unknownSpecs').checked;
    const name = document.getElementById('customerName').value.trim();

    // Chỉ bắt buộc nhập tên nếu KHÔNG tích "Không biết cài đặt"
    if (!unknown && !name) {
        // Hiệu ứng lỗi cho input
        const nameInput = document.getElementById('customerName');
        nameInput.parentElement.classList.add('error');
        setTimeout(() => {
            nameInput.parentElement.classList.remove('error');
        }, 500);
        return;
    }

    const message = generateMessage();
    
    const preview = document.getElementById('messagePreview');
    preview.value = message;
    
    document.getElementById('charCount').textContent = `${message.length}/380`;

    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    
    step1.classList.add('slide-out-left');
    
    setTimeout(() => {
        step1.style.display = 'none';
        step1.classList.remove('slide-out-left');
        
        step2.style.display = 'block';
        step2.classList.add('slide-in-right');
        
        setTimeout(() => {
            step2.classList.remove('slide-in-right');
        }, 500);
    }, 400);
    
    document.getElementById('stepLabel').textContent = 'BƯỚC 2 TRONG 2';
    document.getElementById('progressFill').style.width = '100%';
}

// Hàm tạo nội dung tin nhắn
function generateMessage() {
    const deviceType = document.querySelector('.device-btn.active').getAttribute('data-value');
    const name = document.getElementById('customerName').value.trim();
    const unknown = document.getElementById('unknownSpecs').checked;

    // Nếu chọn "Không biết cài đặt"
    if (unknown) {
        let message = `Hello! I came via the TYON Optimizer website. Name: ${name}\n\n`;
        message += `Configuration: I don't know the details; I need help identifying them.\n`;
        message += `Device: ${deviceType}.\n`;
        message += `\nRequest: Review by the team.`;
        return message;
    }

    // Nếu điền đầy đủ
    const mainboard = document.getElementById('mainboard').value.trim() || '[data missing]';
    const cpu = document.getElementById('cpu').value.trim() || '—';
    const gpu = document.getElementById('gpu').value.trim() || '—';
    const ram = document.getElementById('ram').value.trim() || '—';

    let message = `Hello! I came via the TYON Optimizer website. Name: ${name}\n\n`;
    message += `Configuration details:\n`;
    message += `Device: ${deviceType}\n`;
    
    // Chỉ hiển thị Mainboard nếu là Máy tính để bàn
    if (deviceType === 'Máy tính để bàn') {
        message += `Motherboard: ${mainboard}\n`;
    }
    message += `Processor: ${cpu}\n`;
    message += `Graphics card: ${gpu}\n`;
    message += `Memory: ${ram}\n`;
    message += `\nNote: Review by the team.`;

    return message;
}

// Hàm gửi qua WhatsApp
function sendToWhatsApp() {
    const message = document.getElementById('messagePreview').value;
    const encodedMessage = encodeURIComponent(message);
    const phone = "84978568965"; 
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    closeSurvey();
}

// Hàm chọn loại máy
// Hàm chọn loại máy (có hiệu ứng mượt)
function selectDevice(btn) {
    document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const deviceType = btn.getAttribute('data-value');
    const mainboardGroup = document.getElementById('mainboardGroup');
    
    // Kiểm tra cả 'Laptop' và 'Số tay'
    if (deviceType === 'Laptop' || deviceType === 'Số tay') {
        // Ẩn mượt mà: thu nhỏ + mờ dần
        mainboardGroup.classList.add('hidden');
        
        // Xóa giá trị sau khi đã ẩn xong (500ms)
        setTimeout(() => {
            document.getElementById('mainboard').value = '';
        }, 500);
    } else {
        // Hiện mượt mà: to dần + rõ dần
        mainboardGroup.classList.remove('hidden');
    }
}

// Hàm xử lý khi tích "Tôi không biết cài đặt"
function toggleUnknown() {
    const isChecked = document.getElementById('unknownSpecs').checked;
    toggleInputs(isChecked);
}

function toggleInputs(disabled) {
    const inputs = ['mainboard', 'cpu', 'gpu', 'ram'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.disabled = disabled;
        
        if (disabled) {
            // Giữ nguyên giá trị, chỉ vô hiệu hóa
            input.placeholder = "Không cần điền";
        } else {
            // Khôi phục placeholder gốc
            if(id === 'mainboard') input.placeholder = "Ví dụ: B450M / H510";
            if(id === 'cpu') input.placeholder = "Ví dụ: Ryzen 5 5600";
            if(id === 'gpu') input.placeholder = "Ví dụ: RTX 3060 12GB";
            if(id === 'ram') input.placeholder = "Ví dụ: 8";
        }
    });
}

// Hàm toggle tooltip bo mạch chủ
function toggleTooltip() {
    const tooltip = document.getElementById('mainboardTooltip');
    const icon = document.getElementById('tooltipToggle');
    
    if (tooltip) tooltip.classList.toggle('active');
    if (icon) icon.classList.toggle('active');
}

/* =========================================
   GÁN SỰ KIỆN MỞ MODAL CHO NÚT "YÊU CẦU ĐÁNH GIÁ"
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const allButtons = document.querySelectorAll('.btn-primary, .btn-outline');
    
    allButtons.forEach(button => {
        if (button.textContent.toUpperCase().includes('YÊU CẦU ĐÁNH GIÁ')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openSurvey();
            });
        }
    });
});

/* =========================================
   ĐÓNG MODAL KHI CLICK RA NGOÀI
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('surveyModal');
    
    // Click vào vùng overlay (bên ngoài modal-content) sẽ đóng modal
    modal.addEventListener('click', function(e) {
        // Chỉ đóng khi click vào chính overlay, không phải con của nó
        if (e.target === modal) {
            closeSurvey();
        }
    });

    // Nhấn phím ESC để đóng modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeSurvey();
        }
    });
});

/* =========================================
   XỬ LÝ NÚT BACK TRÊN MOBILE VÀ PC
   - Nhấn Back lần 1: Đóng popup
   - Nhấn Back lần 2: Thoát trình duyệt
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('surveyModal');
    
    if (!modal) return;
    
    let isModalOpen = false;
    
    window.addEventListener('popstate', function(event) {
        if (isModalOpen && modal.classList.contains('active')) {
            closeSurvey();
            isModalOpen = false;
            history.pushState({ modalOpen: false }, '', window.location.href);
        }
    });
    
    const originalOpenSurvey = window.openSurvey;
    window.openSurvey = function() {
        if (originalOpenSurvey) {
            originalOpenSurvey();
        } else {
            document.getElementById('surveyModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            goToStep1();
        }
        
        history.pushState({ modalOpen: true }, '', window.location.href);
        isModalOpen = true;
    };
    
    const originalCloseSurvey = window.closeSurvey;
    window.closeSurvey = function() {
        if (originalCloseSurvey) {
            originalCloseSurvey();
        }
        
        isModalOpen = false;
        
        if (history.state && history.state.modalOpen) {
            history.back();
        }
    };
});