// ========== GLOBAL VARIABLES ==========
let currentUser = null;
let isLoggedIn = false;
let transferData = {};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
});

function setupEventListeners() {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        showLoggedInUI();
    }
}

// ========== AUTHENTICATION ==========
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Simulate API call
    currentUser = {
        id: 1,
        name: 'Branko Milos',
        username: username,
        email: 'branko.milos@email.com',
        phone: '+385 1 234 5678',
        accountType: 'Premium',
        lastLogin: new Date().toLocaleString()
    };

    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Login successful!', 'success');

    setTimeout(() => {
        showLoggedInUI();
        showSection('dashboard');
    }, 1000);
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    currentUser = {
        id: 1,
        name: name,
        username: email.split('@')[0],
        email: email,
        phone: phone,
        accountType: 'Standard'
    };

    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Account created successfully!', 'success');

    setTimeout(() => {
        showLoggedInUI();
        showSection('dashboard');
    }, 1000);
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;

    showNotification('Password reset link sent to ' + email, 'success');
    toggleForgotPassword();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('currentUser');
        showNotification('Logged out successfully', 'success');

        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// ========== UI TRANSITIONS ==========
function showLoggedInUI() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    document.getElementById('navbar').style.display = 'block';

    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
    }
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.main-container');
    sections.forEach(section => section.style.display = 'none');

    // Show selected section
    const section = document.getElementById(sectionName + 'Section');
    if (section) {
        section.style.display = 'block';
    }

    // Update navbar active link
    updateNavbarActive(sectionName);
}

function updateNavbarActive(sectionName) {
    const links = document.querySelectorAll('.navbar-menu a:not(.logout-btn)');
    links.forEach(link => link.classList.remove('active'));

    const sections = {
        'dashboard': 0,
        'accounts': 1,
        'transfers': 2,
        'cards': 3,
        'settings': 4
    };

    if (sections[sectionName] !== undefined) {
        links[sections[sectionName]].classList.add('active');
    }
}

function toggleSignup() {
    document.getElementById('loginSection').style.display = 
        document.getElementById('loginSection').style.display === 'none' ? 'flex' : 'none';
    document.getElementById('signupSection').style.display = 
        document.getElementById('signupSection').style.display === 'none' ? 'flex' : 'none';
}

function toggleForgotPassword() {
    document.getElementById('loginSection').style.display = 
        document.getElementById('loginSection').style.display === 'none' ? 'flex' : 'none';
    document.getElementById('forgotPasswordSection').style.display = 
        document.getElementById('forgotPasswordSection').style.display === 'none' ? 'flex' : 'none';
}

// ========== MOBILE MENU ==========
function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// ========== TRANSFERS ==========
function handleTransfer(event) {
    event.preventDefault();

    const fromAccount = document.getElementById('fromAccount').value;
    const recipientAccount = document.getElementById('recipientAccount').value;
    const recipientName = document.getElementById('recipientName').value;
    const amount = document.getElementById('transferAmount').value;
    const description = document.getElementById('transferDescription').value;

    if (!fromAccount || !recipientAccount || !recipientName || !amount || !description) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (amount <= 0) {
        showNotification('Amount must be greater than 0', 'error');
        return;
    }

    transferData = {
        fromAccount: fromAccount,
        toAccount: recipientAccount,
        recipientName: recipientName,
        amount: amount,
        description: description
    };

    // Show confirmation modal
    document.getElementById('confirmFromAccount').textContent = 'Checking Account';
    document.getElementById('confirmToAccount').textContent = recipientAccount;
    document.getElementById('confirmRecipientName').textContent = recipientName;
    document.getElementById('confirmAmount').textContent = '€ ' + parseFloat(amount).toFixed(2);
    document.getElementById('confirmDescription').textContent = description;

    openModal('transferConfirmModal');
}

function confirmTransfer() {
    closeModal('transferConfirmModal');
    showNotification('Transfer successful! Transaction ID: TXN' + Math.floor(Math.random() * 1000000), 'success');

    // Reset form
    document.getElementById('transferForm').reset();
    setTimeout(() => {
        showSection('dashboard');
    }, 2000);
}

function updateTransferFields() {
    const transferType = document.getElementById('transferType').value;
    const recipientBankField = document.getElementById('recipientBankField');

    if (transferType === 'international') {
        recipientBankField.style.display = 'block';
    } else {
        recipientBankField.style.display = 'none';
    }
}

function selectRecipient(name, account) {
    document.getElementById('recipientName').value = name;
    document.getElementById('recipientAccount').value = account;
}

// ========== ACCOUNTS ==========
function openAccountModal() {
    showNotification('Account opening feature coming soon', 'info');
}

function viewAccountDetails(accountType) {
    openModal('accountDetailsModal');
}

function viewAccountTransactions(accountType) {
    showSection('accounts');
    showNotification('Viewing transactions for ' + accountType + ' account', 'info');
}

// ========== CARDS ==========
function openCardModal() {
    showNotification('Card request feature coming soon', 'info');
}

function toggleCard() {
    showNotification('Card locked/unlocked successfully', 'success');
}

function viewCardDetails() {
    showNotification('Card Details: Visa Debit Card\nExpiry: 07/28\nStatus: Active', 'info');
}

// ========== SETTINGS ==========
function handleProfileUpdate(event) {
    event.preventDefault();

    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const phone = document.getElementById('settingsPhone').value;

    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Profile updated successfully', 'success');
}

function openPasswordModal() {
    openModal('passwordModal');
}

function handlePasswordChange(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    showNotification('Password changed successfully', 'success');
    closeModal('passwordModal');
    document.getElementById('passwordForm').reset();
}

function viewLoginHistory() {
    showNotification('Login History:\n- Today 10:30 AM\n- Yesterday 3:45 PM\n- July 3rd 9:15 AM', 'info');
}

function savePreferences() {
    const language = document.getElementById('preferredLanguage').value;
    const currency = document.getElementById('preferredCurrency').value;

    localStorage.setItem('userLanguage', language);
    localStorage.setItem('userCurrency', currency);

    showNotification('Preferences saved successfully', 'success');
}

function payBill() {
    showNotification('Bill payment feature coming soon', 'info');
}

// ========== MODAL FUNCTIONS ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ========== NOTIFICATION ==========
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show ' + type;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ========== UTILITY FUNCTIONS ==========
function formatCurrency(amount) {
    return '€ ' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ========== ADDITIONAL FEATURES ==========
function addEventListenersToModals() {
    // Close modal when clicking on close button
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Initialize modal listeners
document.addEventListener('DOMContentLoaded', addEventListenersToModals);

// ========== EXPORT STATEMENT ==========
function exportStatement() {
    showNotification('Statement exported to PDF', 'success');
}

// ========== SEARCH FUNCTIONALITY ==========
function searchTransactions(query) {
    const rows = document.querySelectorAll('.transactions-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
}

// ========== DATE AND TIME ==========
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
}

// Update last login time
function initializeDashboard() {
    const lastLogin = document.getElementById('lastLogin');
    if (lastLogin && currentUser) {
        lastLogin.textContent = 'Last login: Today at ' + new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Call this when showing dashboard
const originalShowSection = showSection;
showSection = function(sectionName) {
    originalShowSection(sectionName);
    if (sectionName === 'dashboard') {
        initializeDashboard();
    }
}

// ========== ADVANCED SECURITY ==========
function enableTwoFactorAuth() {
    showNotification('Two-Factor Authentication enabled successfully', 'success');
}

function disableTwoFactorAuth() {
    showNotification('Two-Factor Authentication disabled', 'success');
}

// ========== QUICK STATS UPDATE ==========
function updateStatistics() {
    // This would normally fetch from an API
    const stats = {
        totalBalance: 26585.00,
        monthlySpending: 3250.00,
        income: 5000.00,
        savings: 12500.00
    };
    return stats;
}

// ========== RESPONSIVE ADJUSTMENTS ==========
function handleResponsive() {
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.navbar-menu');
        if (navbar) {
            navbar.style.display = 'none';
        }
    }
}

window.addEventListener('resize', handleResponsive);

// ========== SESSION TIMEOUT ==========
let sessionTimeout;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        if (isLoggedIn) {
            showNotification('Session expired. Please login again.', 'warning');
            logout();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

document.addEventListener('mousemove', resetSessionTimeout);
document.addEventListener('keypress', resetSessionTimeout);
document.addEventListener('click', resetSessionTimeout);

// ========== DATA ENCRYPTION PLACEHOLDER ==========
function encryptSensitiveData(data) {
    // In a real application, use proper encryption
    return btoa(JSON.stringify(data));
}

function decryptSensitiveData(encryptedData) {
    try {
        return JSON.parse(atob(encryptedData));
    } catch (e) {
        console.error('Decryption failed');
        return null;
    }
}

// ========== ACTIVITY LOG ==========
function logActivity(action, details) {
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    activityLog.push({
        timestamp: new Date().toISOString(),
        action: action,
        details: details
    });
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

// ========== BACKUP AND RECOVERY ==========
function backupUserData() {
    const userData = {
        user: currentUser,
        settings: {
            language: localStorage.getItem('userLanguage'),
            currency: localStorage.getItem('userCurrency')
        },
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_backup_' + new Date().getTime() + '.json';
    link.click();

    showNotification('Data backed up successfully', 'success');
}

// ========== LOG ANALYTICS ==========
function logPageView(pageName) {
    logActivity('page_view', { page: pageName });
}

function logTransactionEvent(type, details) {
    logActivity('transaction', { type: type, details: details });
}
