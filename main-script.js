// Firebase Authentication imports
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }
    
    lastScroll = currentScroll;
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Form submission - NO WHATSAPP REDIRECT
const appointmentForm = document.getElementById('appointmentForm');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('=== FORM SUBMITTED - NEW VERSION ===');
        
        // Get form values
        const name = document.getElementById('enquiryName').value.trim();
        const email = document.getElementById('enquiryEmail').value.trim();
        const phone = document.getElementById('enquiryPhone').value.trim();
        const message = document.getElementById('enquiryMessage').value.trim() || 'No message provided';
        
        // Simple validation
        if (name && email && phone) {
            try {
                // Save to Firebase
                await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDb, 'enquiries'), {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    timestamp: window.firebaseServerTimestamp(),
                    date: new Date().toLocaleString()
                });
                
                console.log('Enquiry saved to Firebase successfully');
                console.log('NO WHATSAPP REDIRECT - CORRECT VERSION LOADED');
                
                // Reset form
                appointmentForm.reset();
                
                // Show success message - NO WHATSAPP
                alert('Thank you! Your enquiry has been submitted successfully. We will contact you soon.');
                
                // Refresh badge counts if user is signed in
                const auth = window.firebaseAuth;
                if (auth && auth.currentUser) {
                    loadUserCounts(auth.currentUser.email);
                }
                
            } catch (error) {
                console.error('Error saving enquiry:', error);
                alert('Sorry, there was an error submitting your enquiry. Please try again.');
            }
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Don't prevent default if it's just "#"
        if (targetId === '#' || targetId === '#!') {
            e.preventDefault();
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Service cards animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .features-section, .specialty-section, .tech-card, .expertise-item');
animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Statistics counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = entry.target.querySelector('.stat-number');
            const endValue = parseInt(target.textContent);
            target.textContent = '0+';
            animateValue(target, 0, endValue, 2000);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    statsObserver.observe(item);
});

// Button ripple effect
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Console message
console.log('%c👋 Welcome to Nikhil Chaudhari!', 'color: #0066cc; font-size: 20px; font-weight: bold;');
console.log('%cOur website is designed to provide you with the best experience.', 'color: #666; font-size: 14px;');

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Active navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    lazyLoadImages();
});

// Wait for Firebase to be initialized
let auth, provider;
setTimeout(() => {
    if (window.firebaseApp) {
        auth = getAuth(window.firebaseApp);
        provider = new GoogleAuthProvider();
        
        // Attach click handler to auth modal button
        const authModalBtn = document.getElementById('authModalBtn');
        if (authModalBtn) {
            authModalBtn.addEventListener('click', openAuthModal);
            console.log('Auth modal button listener attached');
        }
        
        // Check if user is already signed in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userInfo = {
                    name: user.displayName,
                    email: user.email,
                    picture: user.photoURL
                };
                updateUserUI(userInfo);
                checkAdminAccess(user.email);
            }
        });
    }
}, 500);

// Handle Google Sign-In
async function handleGoogleSignIn() {
    console.log('Sign-in button clicked');
    
    if (!auth || !provider) {
        alert('Authentication is still initializing. Please try again.');
        return;
    }
    
    try {
        console.log('Opening sign-in popup...');
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const userInfo = {
            name: user.displayName,
            email: user.email,
            picture: user.photoURL
        };
        
        // Update UI to show user info
        updateUserUI(userInfo);
        
        // Check if user is admin
        checkAdminAccess(user.email);
        
        // Close the auth modal
        if (window.closeAuthModal) {
            window.closeAuthModal();
        }
        
        console.log('User signed in:', user.email);
        alert('Welcome, ' + user.displayName + '!');
    } catch (error) {
        console.error('Sign-in error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            console.log('User closed the popup');
        } else {
            alert('Failed to sign in: ' + error.message);
        }
    }
}

// Expose to window for inline onclick handlers
window.performGoogleSignIn = handleGoogleSignIn;

function updateUserUI(userInfo) {
    console.log('🎨 updateUserUI called with:', userInfo);
    const googleLoginDiv = document.querySelector('.google-login');
    console.log('📍 googleLoginDiv found:', !!googleLoginDiv);
    
    // Hide the auth button
    const authButton = document.getElementById('authModalBtn');
    if (authButton) {
        authButton.style.display = 'none';
    }
    
    // Remove existing user info if any
    const existingUserInfo = document.querySelector('.user-info');
    if (existingUserInfo) {
        existingUserInfo.remove();
    }
    
    // Check for custom profile image in localStorage (user-specific)
    const customImageKey = `customProfileImage_${userInfo.email}`;
    const customImage = localStorage.getItem(customImageKey);
    const profilePicture = customImage || userInfo.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userInfo.name || userInfo.email);
    
    // Create user info display with dropdown
    const userDisplay = document.createElement('div');
    userDisplay.className = 'user-info';
    userDisplay.innerHTML = `
        <div class="user-profile" onclick="toggleUserDropdown(event)">
            <img src="${profilePicture}" alt="${userInfo.name}" class="user-avatar">
            <span class="user-email-trigger">${userInfo.email}</span>
            <i class="fas fa-chevron-down" style="margin-left: 8px; font-size: 0.8rem;"></i>
            
            <div class="user-dropdown" id="userDropdown" onclick="event.stopPropagation()">
                <div class="dropdown-header">
                    <img src="${profilePicture}" alt="${userInfo.name}" class="dropdown-avatar">
                    <span class="dropdown-name">${userInfo.name || 'User'}</span>
                    <span class="dropdown-email">${userInfo.email}</span>
                </div>
                
                <div class="dropdown-menu">
                    <button class="dropdown-item" onclick="viewProfile()">
                        <i class="fas fa-user-circle"></i>
                        <span>My Account</span>
                    </button>
                    
                    <button class="dropdown-item" onclick="viewAllAppointments()">
                        <i class="fas fa-calendar-check"></i>
                        <span>My Appointments</span>
                        <span class="dropdown-badge" id="appointmentCount">0</span>
                    </button>
                    
                    <button class="dropdown-item" onclick="viewAllEnquiries()">
                        <i class="fas fa-envelope"></i>
                        <span>My Enquiries</span>
                        <span class="dropdown-badge" id="enquiryCount">0</span>
                    </button>
                    
                    <div class="dropdown-divider"></div>
                    
                    <button class="dropdown-item signout-btn" onclick="handleSignOut()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    googleLoginDiv.appendChild(userDisplay);
    
    // Load user's appointment and enquiry counts
    console.log('📞 Calling loadUserCounts with email:', userInfo.email);
    loadUserCounts(userInfo.email);
    
    // Auto-fill enquiry form email if available
    const enquiryEmailField = document.getElementById('enquiryEmail');
    if (enquiryEmailField && userInfo.email) {
        enquiryEmailField.value = userInfo.email;
        enquiryEmailField.setAttribute('readonly', 'true');
        enquiryEmailField.style.backgroundColor = '#f0f0f0';
    }
}

// Toggle dropdown visibility
window.toggleUserDropdown = function(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// Refresh counts when page loads (in case user just submitted appointment/enquiry)
window.addEventListener('load', function() {
    setTimeout(() => {
        const auth = window.firebaseAuth;
        if (auth && auth.currentUser) {
            loadUserCounts(auth.currentUser.email);
            
            // Auto-fill enquiry form email if user is signed in
            const enquiryEmailField = document.getElementById('enquiryEmail');
            if (enquiryEmailField && auth.currentUser.email) {
                enquiryEmailField.value = auth.currentUser.email;
                enquiryEmailField.setAttribute('readonly', 'true');
                enquiryEmailField.style.backgroundColor = '#f0f0f0';
            }
        }
    }, 1000);
});

// Load user counts
async function loadUserCounts(email) {
    console.log('🔍 loadUserCounts called with email:', email);
    try {
        const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        // Count appointments
        const appointmentsQuery = query(
            collection(window.firebaseDb, 'appointments'),
            where('email', '==', email)
        );
        console.log('📋 Querying appointments for email:', email);
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentCount = appointmentsSnapshot.size;
        console.log('✅ Found appointments:', appointmentCount);
        
        // Debug: Log all appointments to see what emails they have
        appointmentsSnapshot.forEach(doc => {
            console.log('Appointment email:', doc.data().email);
        });
        
        // Count enquiries
        const enquiriesQuery = query(
            collection(window.firebaseDb, 'enquiries'),
            where('email', '==', email)
        );
        console.log('📧 Querying enquiries for email:', email);
        const enquiriesSnapshot = await getDocs(enquiriesQuery);
        const enquiryCount = enquiriesSnapshot.size;
        console.log('✅ Found enquiries:', enquiryCount);
        
        // Debug: Log all enquiries to see what emails they have
        enquiriesSnapshot.forEach(doc => {
            console.log('Enquiry email:', doc.data().email);
        });
        
        // Update badges
        const appointmentBadge = document.getElementById('appointmentCount');
        const enquiryBadge = document.getElementById('enquiryCount');
        
        console.log('🏷️ Updating badges - Appointments:', appointmentCount, 'Enquiries:', enquiryCount);
        
        if (appointmentBadge) appointmentBadge.textContent = appointmentCount;
        if (enquiryBadge) enquiryBadge.textContent = enquiryCount;
        
    } catch (error) {
        console.error('Error loading user counts:', error);
    }
}

// View Profile
window.viewProfile = async function() {
    console.log('👤 viewProfile called');
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('Please sign in to view your profile.');
        return;
    }
    const user = auth.currentUser;
    console.log('🔍 Logged in user email:', user.email);
    
    // Refresh counts when opening profile
    loadUserCounts(user.email);
    
    try {
        const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        // Get all appointments
        console.log('📋 Querying appointments for:', user.email);
        const appointmentsQuery = query(
            collection(window.firebaseDb, 'appointments'),
            where('email', '==', user.email)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointments = [];
        appointmentsSnapshot.forEach(doc => {
            appointments.push({ id: doc.id, ...doc.data() });
            console.log('Found appointment with email:', doc.data().email);
        });
        console.log('✅ Total appointments found:', appointments.length);
        
        // Get all enquiries
        console.log('📧 Querying enquiries for:', user.email);
        const enquiriesQuery = query(
            collection(window.firebaseDb, 'enquiries'),
            where('email', '==', user.email)
        );
        const enquiriesSnapshot = await getDocs(enquiriesQuery);
        const enquiries = [];
        enquiriesSnapshot.forEach(doc => {
            enquiries.push({ id: doc.id, ...doc.data() });
            console.log('Found enquiry with email:', doc.data().email);
        });
        console.log('✅ Total enquiries found:', enquiries.length);
        
        // Show profile modal
        showProfileModal(user, appointments, enquiries);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile data. Please try again.');
    }
};

// View Last Appointment
window.viewLastAppointment = async function() {
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('Please sign in to view your appointments.');
        return;
    }
    const user = auth.currentUser;
    
    try {
        const { collection, query, where, getDocs, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const appointmentsQuery = query(
            collection(window.firebaseDb, 'appointments'),
            where('email', '==', user.email),
            limit(1)
        );
        
        const snapshot = await getDocs(appointmentsQuery);
        
        if (snapshot.empty) {
            alert('You haven\'t booked any appointments yet.\n\nWould you like to book one now?');
            if (confirm('Go to appointment booking page?')) {
                window.location.href = 'appointment.html';
            }
            return;
        }
        
        const appointment = snapshot.docs[0].data();
        showAppointmentModal(appointment);
        
    } catch (error) {
        console.error('Error loading appointment:', error);
        alert('Error loading appointment. Please try again.');
    }
};

// View Last Enquiry
window.viewLastEnquiry = async function() {
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('Please sign in to view your enquiries.');
        return;
    }
    const user = auth.currentUser;
    
    try {
        const { collection, query, where, getDocs, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const enquiriesQuery = query(
            collection(window.firebaseDb, 'enquiries'),
            where('email', '==', user.email),
            limit(1)
        );
        
        const snapshot = await getDocs(enquiriesQuery);
        
        if (snapshot.empty) {
            alert('You haven\'t submitted any enquiries yet.\n\nWould you like to send one now?');
            window.location.href = 'index.html#contact';
            return;
        }
        
        const enquiry = snapshot.docs[0].data();
        showEnquiryModal(enquiry);
        
    } catch (error) {
        console.error('Error loading enquiry:', error);
        alert('Error loading enquiry. Please try again.');
    }
};

// View All Appointments
window.viewAllAppointments = async function() {
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('Please sign in to view your appointments.');
        return;
    }
    const user = auth.currentUser;
    
    // Refresh counts
    loadUserCounts(user.email);
    
    try {
        const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const appointmentsQuery = query(
            collection(window.firebaseDb, 'appointments'),
            where('email', '==', user.email)
        );
        
        const snapshot = await getDocs(appointmentsQuery);
        
        if (snapshot.empty) {
            alert('You haven\'t booked any appointments yet.\n\nWould you like to book one now?');
            if (confirm('Go to appointment booking page?')) {
                window.location.href = 'appointment.html';
            }
            return;
        }
        
        const appointments = [];
        snapshot.forEach(doc => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        
        showAllAppointmentsModal(appointments);
        
    } catch (error) {
        console.error('Error loading appointments:', error);
        alert('Error loading appointments. Please try again.');
    }
};

// View All Enquiries
window.viewAllEnquiries = async function() {
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('Please sign in to view your enquiries.');
        return;
    }
    const user = auth.currentUser;
    
    // Refresh counts
    loadUserCounts(user.email);
    
    try {
        const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const enquiriesQuery = query(
            collection(window.firebaseDb, 'enquiries'),
            where('email', '==', user.email)
        );
        
        const snapshot = await getDocs(enquiriesQuery);
        
        if (snapshot.empty) {
            alert('You haven\'t submitted any enquiries yet.\n\nWould you like to send one now?');
            window.location.href = 'index.html#contact';
            return;
        }
        
        const enquiries = [];
        snapshot.forEach(doc => {
            enquiries.push({ id: doc.id, ...doc.data() });
        });
        
        showAllEnquiriesModal(enquiries);
        
    } catch (error) {
        console.error('Error loading enquiries:', error);
        alert('Error loading enquiries. Please try again.');
    }
};

// Show Profile Modal
function showProfileModal(user, appointments, enquiries) {
    // Get user-specific custom image
    const customImageKey = `customProfileImage_${user.email}`;
    const customImage = localStorage.getItem(customImageKey);
    const profileImage = customImage || user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || user.email);
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(this)">
            <div class="modal-content profile-modal" onclick="event.stopPropagation()">
                <span class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</span>
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                    <i class="fas fa-user-circle"></i> My Account
                </h2>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="position: relative; display: inline-block;">
                        <img id="profileImagePreview" src="${profileImage}" 
                             style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid var(--primary-color); margin-bottom: 15px; object-fit: cover;">
                        <label for="profileImageInput" style="position: absolute; bottom: 15px; right: -5px; background: var(--primary-color); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                            <i class="fas fa-camera"></i>
                        </label>
                        <input type="file" id="profileImageInput" accept="image/*" style="display: none;" onchange="handleProfileImageUpload(event)">
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <input type="text" id="displayNameInput" value="${user.displayName || 'User'}" 
                               style="font-size: 1.3rem; font-weight: 600; text-align: center; border: 2px solid transparent; padding: 8px 15px; border-radius: 8px; width: 100%; max-width: 300px; transition: all 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-color)'" 
                               onblur="this.style.borderColor='transparent'">
                    </div>
                    <p style="color: var(--text-light); margin-top: 10px;">${user.email}</p>
                </div>
                
                <div style="background: var(--light-color); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px; color: var(--dark-color);">
                        <i class="fas fa-chart-line"></i> Your Activity
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${appointments.length}</div>
                            <div style="color: var(--text-light); font-size: 0.9rem;">Total Appointments</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: #f5576c;">${enquiries.length}</div>
                            <div style="color: var(--text-light); font-size: 0.9rem;">Total Enquiries</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="updateUserProfile();" 
                            style="padding: 12px 24px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button onclick="removeProfilePicture();" 
                            style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
                        <i class="fas fa-trash"></i> Remove Profile Picture
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Handle profile image upload
window.handleProfileImageUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('profileImagePreview');
            if (preview) {
                preview.src = e.target.result;
                // Store with user-specific key
                const auth = window.firebaseAuth;
                if (auth && auth.currentUser) {
                    const customImageKey = `customProfileImage_${auth.currentUser.email}`;
                    localStorage.setItem(customImageKey, e.target.result);
                }
            }
        };
        reader.readAsDataURL(file);
    }
};

// Update user profile
window.updateUserProfile = async function() {
    const nameInput = document.getElementById('displayNameInput');
    const newName = nameInput?.value.trim();
    
    if (!newName) {
        alert('Please enter a valid name.');
        return;
    }
    
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('You must be logged in to update your profile.');
        return;
    }
    
    const user = auth.currentUser;
    
    try {
        const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Get custom image from localStorage (user-specific)
        const customImageKey = `customProfileImage_${user.email}`;
        const customImage = localStorage.getItem(customImageKey);
        
        // Use default avatar for Firebase (base64 is too long for Firebase photoURL)
        const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(newName) + '&background=0D8ABC&color=fff&size=200';
        
        await updateProfile(user, {
            displayName: newName,
            photoURL: defaultAvatar
        });
        
        // Update UI with custom image if available (from localStorage)
        const userInfo = {
            name: newName,
            email: user.email,
            picture: customImage || defaultAvatar
        };
        updateUserUI(userInfo);
        
        alert('✅ Profile updated successfully!');
        
        // Close the modal after successful update
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('❌ Failed to update profile: ' + error.message);
    }
};

// Remove profile picture
window.removeProfilePicture = async function() {
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
        alert('You must be logged in to remove your profile picture.');
        return;
    }
    
    const user = auth.currentUser;
    
    if (!confirm('Are you sure you want to remove your profile picture?')) {
        return;
    }
    
    try {
        const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Remove custom image from localStorage (user-specific)
        const customImageKey = `customProfileImage_${user.email}`;
        localStorage.removeItem(customImageKey);
        
        // Set default avatar
        const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'User') + '&background=0D8ABC&color=fff&size=200';
        
        await updateProfile(user, {
            photoURL: defaultAvatar
        });
        
        // Update preview image in the modal
        const preview = document.getElementById('profileImagePreview');
        if (preview) {
            preview.src = defaultAvatar;
        }
        
        // Update UI
        const userInfo = {
            name: user.displayName,
            email: user.email,
            picture: defaultAvatar
        };
        updateUserUI(userInfo);
        
        alert('✅ Profile picture removed successfully!');
        
    } catch (error) {
        console.error('Error removing profile picture:', error);
        alert('❌ Failed to remove profile picture: ' + error.message);
    }
};

// Show Appointment Modal
function showAppointmentModal(appointment) {
    const slots = appointment.timeSlots || [];
    const slotsHTML = slots.map(slot => `
        <div style="background: var(--light-color); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
            <strong>Preference ${slot.preference}:</strong><br>
            📅 ${slot.dateTime || slot.date + ' ' + slot.time}
        </div>
    `).join('');
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(this)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <span class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</span>
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                    <i class="fas fa-calendar-check"></i> Last Appointment
                </h2>
                
                <div style="margin-bottom: 20px;">
                    <p><strong>Name:</strong> ${appointment.name || appointment.firstName + ' ' + appointment.lastName}</p>
                    <p><strong>Phone:</strong> ${appointment.phone}</p>
                    <p><strong>Email:</strong> ${appointment.email}</p>
                    <p><strong>Age:</strong> ${appointment.age} | <strong>Gender:</strong> ${appointment.gender}</p>
                    <p><strong>Status:</strong> <span style="background: #fff3cd; padding: 4px 12px; border-radius: 12px; color: #856404;">${appointment.status || 'Pending'}</span></p>
                    <p><strong>Submitted:</strong> ${appointment.submittedAt}</p>
                </div>
                
                <h4 style="margin: 15px 0;">Time Slot Preferences:</h4>
                ${slotsHTML}
                
                ${appointment.message && appointment.message !== 'No additional message' ? `
                    <div style="margin-top: 15px;">
                        <h4>Message:</h4>
                        <p style="background: var(--light-color); padding: 12px; border-radius: 8px;">${appointment.message}</p>
                    </div>
                ` : ''}
                
                <button onclick="window.location.href='appointment.html'" 
                        style="width: 100%; padding: 12px; margin-top: 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-plus"></i> Book Another Appointment
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Show Enquiry Modal
function showEnquiryModal(enquiry) {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(this)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <span class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</span>
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                    <i class="fas fa-envelope"></i> Last Enquiry
                </h2>
                
                <div style="margin-bottom: 20px;">
                    <p><strong>Name:</strong> ${enquiry.name}</p>
                    <p><strong>Phone:</strong> ${enquiry.phone}</p>
                    <p><strong>Email:</strong> ${enquiry.email}</p>
                    <p><strong>Submitted:</strong> ${enquiry.date || 'N/A'}</p>
                </div>
                
                <h4 style="margin: 15px 0;">Message:</h4>
                <div style="background: var(--light-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    ${enquiry.message || 'No message provided'}
                </div>
                
                <button onclick="window.location.href='index.html#contact'" 
                        style="width: 100%; padding: 12px; background: var(--secondary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-plus"></i> Send Another Enquiry
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close Modal
window.closeModal = function(modalElement) {
    if (modalElement) {
        modalElement.remove();
    }
}

window.handleSignOut = async function() {
    const auth = window.firebaseAuth;
    if (!auth) {
        console.error('Auth not initialized');
        return;
    }
    
    try {
        // Get current user email before signing out
        const currentUserEmail = auth.currentUser?.email;
        
        // Remove only current user's custom profile image from localStorage
        if (currentUserEmail) {
            const customImageKey = `customProfileImage_${currentUserEmail}`;
            localStorage.removeItem(customImageKey);
        }
        
        await signOut(auth);
        
        // Remove user info display
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.remove();
        }
        
        // Hide admin enquiries button
        const adminBtn = document.getElementById('adminEnquiriesBtn');
        if (adminBtn) {
            adminBtn.style.display = 'none';
        }
        
        // Show the auth button again
        const authButton = document.getElementById('authModalBtn');
        if (authButton) {
            authButton.style.display = 'flex';
        }
        
        alert('You have been signed out successfully.');
    } catch (error) {
        console.error('Sign-out error:', error);
        alert('Failed to sign out. Please try again.');
    }
}

// Firebase auth state listener handles auto sign-in

// Admin email configuration
const ADMIN_EMAILS = [
    'instamine9@gmail.com',
    'admin@example.com'
];

// Check if user has admin access
function checkAdminAccess(email) {
    console.log('Checking admin access for email:', email);
    console.log('Admin emails list:', ADMIN_EMAILS);
    console.log('Is admin?', ADMIN_EMAILS.includes(email));
    
    if (ADMIN_EMAILS.includes(email)) {
        const adminBtn = document.getElementById('adminEnquiriesBtn');
        console.log('Admin button element:', adminBtn);
        
        if (adminBtn) {
            adminBtn.style.display = 'block';
            console.log('Admin button displayed');
        }
    }
}

// Authentication Modal Functions
window.openAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'block';
    }
};

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
};

// Close button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.auth-close');
    if (closeBtn) {
        closeBtn.onclick = closeAuthModal;
    }
});

// Switch between Sign In and Sign Up tabs
window.switchAuthTab = function(tab) {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    if (tab === 'signin') {
        signinForm.style.display = 'flex';
        signupForm.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        signinForm.style.display = 'none';
        signupForm.style.display = 'flex';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
};

// Microsoft Sign In
window.handleMicrosoftSignIn = function() {
    alert('Microsoft authentication will be available soon!\n\nPlease use Google or Email/Password for now.');
};

// Facebook Sign In
window.handleFacebookSignIn = async function() {
    console.log('🔵 Facebook Sign-In clicked!');
    
    const facebookProvider = window.firebaseFacebookProvider;
    const auth = window.firebaseAuth;
    
    if (!auth || !facebookProvider) {
        alert('Facebook authentication is still loading. Please try again.');
        return;
    }
    
    try {
        console.log('🔵 Opening Facebook popup...');
        const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        
        console.log('✅ Signed in with Facebook:', user.email);
        
        // Close modal
        if (window.closeAuthModal) {
            window.closeAuthModal();
        }
        
        alert('Welcome, ' + user.displayName + '! ✨');
        window.location.reload();
    } catch (error) {
        console.error('❌ Facebook sign-in error:', error);
        if (error.code !== 'auth/popup-closed-by-user') {
            alert('Facebook sign-in failed: ' + error.message);
        }
    }
};

// Email/Password Sign In
document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            
            try {
                const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                const result = await signInWithEmailAndPassword(auth, email, password);
                
                const userInfo = {
                    name: result.user.displayName || email.split('@')[0],
                    email: result.user.email,
                    picture: result.user.photoURL || 'https://ui-avatars.com/api/?name=' + email
                };
                
                updateUserUI(userInfo);
                checkAdminAccess(result.user.email);
                if (window.closeAuthModal) window.closeAuthModal();
                alert('Welcome back!');
            } catch (error) {
                console.error('Sign in error:', error);
                alert('Sign in failed: ' + error.message);
            }
        });
    }
    
    // Email/Password Sign Up
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }
            
            try {
                const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                const result = await createUserWithEmailAndPassword(auth, email, password);
                
                // Update profile with name
                await updateProfile(result.user, { displayName: name });
                
                const userInfo = {
                    name: name,
                    email: result.user.email,
                    picture: 'https://ui-avatars.com/api/?name=' + name
                };
                
                updateUserUI(userInfo);
                checkAdminAccess(result.user.email);
                if (window.closeAuthModal) window.closeAuthModal();
                alert('Account created successfully! Welcome, ' + name + '!');
            } catch (error) {
                console.error('Sign up error:', error);
                alert('Sign up failed: ' + error.message);
            }
        });
    }
});

// Check authentication before redirecting to appointment page
window.checkAuthAndRedirect = function() {
    console.log('Checking authentication before appointment booking...');
    
    // Use window.firebaseAuth which is globally available
    const auth = window.firebaseAuth;
    
    if (!auth) {
        console.error('Auth not initialized yet');
        alert('Please wait, authentication is loading...');
        setTimeout(() => window.checkAuthAndRedirect(), 500);
        return;
    }
    
    // Get current user - Firebase maintains this state
    const user = auth.currentUser;
    
    console.log('Current user:', user);
    
    if (user && user.email) {
        // User is signed in, redirect to appointment page
        console.log('✅ User is signed in:', user.email);
        window.location.href = 'appointment.html';
    } else {
        // User is not signed in, open auth modal
        console.log('❌ User not signed in, opening authentication modal...');
        alert('Please sign in to book an appointment.');
        if (window.openAuthModal) {
            window.openAuthModal();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Show All Appointments Modal
function showAllAppointmentsModal(appointments) {
    const appointmentsHTML = appointments.map((appointment, index) => {
        const slots = appointment.timeSlots || [];
        const slotsHTML = slots.map(slot => `
            <div style="background: #f8f9fa; padding: 8px; border-radius: 6px; margin: 5px 0; font-size: 0.85rem;">
                <strong>Pref ${slot.preference}:</strong> ${slot.dateTime || slot.date + ' ' + slot.time}
            </div>
        `).join('');
        
        return `
            <div style="background: white; border: 2px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="color: var(--primary-color); margin: 0;">Appointment #${index + 1}</h4>
                    <span style="background: #fff3cd; padding: 4px 12px; border-radius: 12px; color: #856404; font-size: 0.85rem; font-weight: 600;">
                        ${appointment.status || 'Pending'}
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                    <div><strong>Name:</strong> ${appointment.name || appointment.firstName + ' ' + appointment.lastName}</div>
                    <div><strong>Phone:</strong> ${appointment.phone}</div>
                    <div><strong>Age:</strong> ${appointment.age} | <strong>Gender:</strong> ${appointment.gender}</div>
                    <div><strong>Submitted:</strong> ${appointment.submittedAt}</div>
                </div>
                
                <div style="margin-top: 10px;">
                    <strong>Time Slots:</strong>
                    ${slotsHTML}
                </div>
                
                ${appointment.message && appointment.message !== 'No additional message' ? `
                    <div style="margin-top: 10px;">
                        <strong>Message:</strong>
                        <p style="background: var(--light-color); padding: 10px; border-radius: 6px; margin-top: 5px; font-size: 0.9rem;">${appointment.message}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(this)">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 800px;">
                <span class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</span>
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                    <i class="fas fa-calendar-check"></i> My Appointments (${appointments.length})
                </h2>
                
                <div style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">
                    ${appointmentsHTML}
                </div>
                
                <button onclick="window.location.href='appointment.html'" 
                        style="width: 100%; padding: 12px; margin-top: 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-plus"></i> Book Another Appointment
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Show All Enquiries Modal
function showAllEnquiriesModal(enquiries) {
    const enquiriesHTML = enquiries.map((enquiry, index) => {
        return `
            <div style="background: white; border: 2px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #f5576c; margin: 0 0 10px 0;">Enquiry #${index + 1}</h4>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                    <div><strong>Name:</strong> ${enquiry.name}</div>
                    <div><strong>Phone:</strong> ${enquiry.phone}</div>
                    <div><strong>Email:</strong> ${enquiry.email}</div>
                    <div><strong>Submitted:</strong> ${enquiry.date || 'N/A'}</div>
                </div>
                
                <div style="margin-top: 10px;">
                    <strong>Message:</strong>
                    <p style="background: var(--light-color); padding: 12px; border-radius: 8px; margin-top: 5px;">
                        ${enquiry.message || 'No message provided'}
                    </p>
                </div>
            </div>
        `;
    }).join('');
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(this)">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 800px;">
                <span class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</span>
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                    <i class="fas fa-envelope"></i> My Enquiries (${enquiries.length})
                </h2>
                
                <div style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">
                    ${enquiriesHTML}
                </div>
                
                <button onclick="window.location.href='index.html#contact'" 
                        style="width: 100%; padding: 12px; margin-top: 20px; background: var(--secondary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-plus"></i> Send Another Enquiry
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
