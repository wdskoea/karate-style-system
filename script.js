// تاریخ و ساعت فارسی
function updatePersianDateTime() {
    const now = new Date();
    const pDate = new PersianDate(now).format('YYYY/MM/DD HH:mm:ss');
    document.getElementById('datetime').textContent = pDate;
}

setInterval(updatePersianDateTime, 1000);
updatePersianDateTime();

// سال جاری در فوتر
document.getElementById('currentYear').textContent = new PersianDate().year();

// نمایش بخش دان وقتی کمربند مشکی انتخاب شد
document.getElementById('belt').addEventListener('change', function() {
    const danSection = document.getElementById('danSection');
    danSection.style.display = this.value === 'black' ? 'block' : 'none';
});

// مدیریت نقش‌ها
document.querySelectorAll('input[name="roles"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const details = this.parentElement.querySelector('.role-details');
        details.style.display = this.checked ? 'block' : 'none';
    });
});

// نمایش جزئیات هیات رئیسه
document.getElementById('boardMember').addEventListener('change', function() {
    const citySelectGroup = document.getElementById('citySelectGroup');
    const provinceChecked = document.getElementById('provinceScope').checked;
    citySelectGroup.style.display = this.checked && !provinceChecked ? 'block' : 'none';
});

document.querySelectorAll('input[name="boardScope"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const citySelectGroup = document.getElementById('citySelectGroup');
        citySelectGroup.style.display = this.value === 'city' ? 'block' : 'none';
    });
});

// نمایش جزئیات کمیته فنی
document.getElementById('boardPosition').addEventListener('change', function() {
    const technicalDetails = document.getElementById('technicalCommitteeDetails');
    technicalDetails.style.display = this.value === 'technicalCommittee' ? 'block' : 'none';
});

// نمایش جزئیات داوران
document.getElementById('kataReferee').addEventListener('change', function() {
    document.getElementById('kataRefereeDetails').style.display = this.checked ? 'block' : 'none';
});

document.getElementById('kumiteReferee').addEventListener('change', function() {
    document.getElementById('kumiteRefereeDetails').style.display = this.checked ? 'block' : 'none';
});

// جستجوی عضو
document.getElementById('searchBtn').addEventListener('click', function() {
    const nationalId = document.getElementById('searchNationalId').value.trim();
    
    if (!nationalId || !/^\d{10}$/.test(nationalId)) {
        alert('لطفاً کد ملی معتبر وارد کنید');
        return;
    }
    
    // در اینجا باید به دیتابیس مراجعه شود
    // برای نمونه از localStorage استفاده می‌کنیم
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const member = members.find(m => m.nationalId === nationalId);
    
    if (member) {
        displayMemberInfo(member);
    } else {
        if (confirm('عضوی با این کد ملی یافت نشد. آیا می‌خواهید ثبت نام کنید؟')) {
            document.getElementById('searchNationalId').value = nationalId;
            document.getElementById('nationalId').value = nationalId;
            document.getElementById('memberForm').style.display = 'block';
            document.getElementById('searchResult').style.display = 'none';
        }
    }
});

// نمایش اطلاعات عضو
function displayMemberInfo(member) {
    const memberInfoDisplay = document.getElementById('memberInfoDisplay');
    memberInfoDisplay.innerHTML = `
        <div class="info-row">
            <span class="info-label">نام کامل:</span>
            <span>${member.firstName} ${member.lastName}</span>
        </div>
        <div class="info-row">
            <span class="info-label">کد ملی:</span>
            <span>${member.nationalId}</span>
        </div>
        <!-- سایر اطلاعات عضو -->
    `;
    
    document.getElementById('searchResult').style.display = 'block';
    document.getElementById('memberForm').style.display = 'none';
}

// ثبت فرم
document.getElementById('memberForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // جمع‌آوری داده‌های فرم
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        fatherName: document.getElementById('fatherName').value,
        nationalId: document.getElementById('nationalId').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        belt: document.getElementById('belt').value,
        dan: document.getElementById('dan').value,
        mobile: document.getElementById('mobile').value,
        phone: document.getElementById('phone').value,
        emergencyMobile: document.getElementById('emergencyMobile').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        medicalInfo: document.getElementById('medicalInfo').value,
        roles: [],
        registrationDate: new PersianDate().format('YYYY/MM/DD HH:mm:ss')
    };
    
    // جمع‌آوری نقش‌ها
    if (document.getElementById('boardMember').checked) {
        const boardMember = {
            type: 'boardMember',
            scope: document.querySelector('input[name="boardScope"]:checked')?.value,
            city: document.getElementById('city').value,
            position: document.getElementById('boardPosition').value,
            technicalPosition: document.getElementById('technicalPosition').value
        };
        formData.roles.push(boardMember);
    }
    
    if (document.getElementById('coach').checked) {
        formData.roles.push({
            type: 'coach',
            level: document.getElementById('coachLevel').value
        });
    }
    
    if (document.getElementById('referee').checked) {
        const referee = {
            type: 'referee',
            kata: document.getElementById('kataReferee').checked,
            kumite: document.getElementById('kumiteReferee').checked
        };
        
        if (referee.kata) {
            referee.kataDegree = document.getElementById('kataDegree').value;
            referee.kataLevel = document.getElementById('kataLevel').value;
        }
        
        if (referee.kumite) {
            referee.kumiteDegree = document.getElementById('kumiteDegree').value;
            referee.kumiteLevel = document.getElementById('kumiteLevel').value;
        }
        
        formData.roles.push(referee);
    }
    
    // نمایش پیش‌نمایش برای تایید
    showConfirmation(formData);
});

function showConfirmation(formData) {
    const preview = document.getElementById('memberInfoPreview');
    preview.innerHTML = `
        <h3>لطفاً اطلاعات زیر را بررسی کنید:</h3>
        <div class="info-row">
            <span class="info-label">نام کامل:</span>
            <span>${formData.firstName} ${formData.lastName}</span>
        </div>
        <div class="info-row">
            <span class="info-label">کد ملی:</span>
            <span>${formData.nationalId}</span>
        </div>
        <!-- نمایش سایر اطلاعات -->
    `;
    
    document.getElementById('memberForm').style.display = 'none';
    document.getElementById('confirmationSection').style.display = 'block';
    
    // ذخیره موقت داده‌ها
    sessionStorage.setItem('pendingMember', JSON.stringify(formData));
}

// تایید نهایی
document.getElementById('confirmBtn').addEventListener('click', function() {
    const formData = JSON.parse(sessionStorage.getItem('pendingMember'));
    
    // ذخیره در localStorage (در نسخه واقعی باید به سرور ارسال شود)
    const members = JSON.parse(localStorage.getItem('members')) || [];
    
    // بررسی وجود عضو با همین کد ملی
    const existingIndex = members.findIndex(m => m.nationalId === formData.nationalId);
    
    if (existingIndex >= 0) {
        members[existingIndex] = formData; // به‌روزرسانی
    } else {
        members.push(formData); // افزودن جدید
    }
    
    localStorage.setItem('members', JSON.stringify(members));
    sessionStorage.removeItem('pendingMember');
    
    alert('اطلاعات با موفقیت ثبت شد');
    resetForm();
});

// ویرایش اطلاعات
document.getElementById('editBtn').addEventListener('click', function() {
    document.getElementById('confirmationSection').style.display = 'none';
    document.getElementById('memberForm').style.display = 'block';
});

// بازنشانی فرم
function resetForm() {
    document.getElementById('memberForm').reset();
    document.getElementById('confirmationSection').style.display = 'none';
    document.getElementById('searchResult').style.display = 'none';
    document.getElementById('memberForm').style.display = 'none';
    document.getElementById('searchNationalId').value = '';
    document.querySelectorAll('.role-details').forEach(el => {
        el.style.display = 'none';
    });
}

// دکمه‌های انصراف و ثبت عضو جدید
document.getElementById('cancelBtn').addEventListener('click', resetForm);
document.getElementById('newMemberBtn').addEventListener('click', resetForm);
document.getElementById('editMemberBtn').addEventListener('click', function() {
    // در اینجا باید اطلاعات عضو را در فرم بارگذاری کنیم
    document.getElementById('searchResult').style.display = 'none';
    document.getElementById('memberForm').style.display = 'block';
});
