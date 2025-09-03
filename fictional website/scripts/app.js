document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const container = $('#container');
  const authModal = $('#authModal');
  const loginButtons = $('.a');
  const userInfoDiv = $('.user-info');
  const welcomeUser = $('#welcomeUser');
  const logoutBtn = $('#logoutBtn');
  const loginForm = $('.sign-in form');
  const signupForm = $('.sign-up form');

  // Profile modal elements
  const profileBtn = $('#profileBtn');
  const profileModal = $('#profileModal');
  const closeProfile = $('.close-profile');
  const profileForm = $('#profileForm');
  const confirmPasswordInput = $('#confirmPassword');
  const editableFields = $('#editableFields');

  $$('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = btn.getAttribute('data-target');
    $$('.page').forEach(page => page.classList.remove('active'));
    const targetSection = document.getElementById(target);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo(0, 0);
    }
  });
});

  // Toggle Sign In / Sign Up
  $('#register')?.addEventListener('click', () => container?.classList.add("active"));
  $('#login')?.addEventListener('click', () => container?.classList.remove("active"));

  // Show Auth Modal
  $('.Login')?.addEventListener('click', () => {
    authModal?.classList.add('show');
    container?.classList.remove("active");
  });

  $('.SignUp')?.addEventListener('click', () => {
    authModal?.classList.add('show');
    container?.classList.add("active");
  });

  // Close modal on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal?.classList.remove('show');
  });

  // Signup
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = signupForm.querySelectorAll('input');
    const [username, email, fullName, education, password] = [...inputs].map(i => i.value.trim());

    if ([username, email, fullName, education, password].includes("")) {
      alert("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    const userData = { username, email, fullName, education, password };
    localStorage.setItem("userData", JSON.stringify(userData));
    alert("Account created successfully!");
    signupForm.reset();
    authModal?.classList.remove('show');
  });

  // Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('input[placeholder="Username"]').value.trim();
    const password = loginForm.querySelector('input[placeholder="Password"]').value.trim();

    try {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (storedUser?.username === username && storedUser?.password === password) {
        alert("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        updateUI(storedUser);
        authModal?.classList.remove('show');
        loginForm.reset();
      } else {
        alert("Invalid credentials.");
      }
    } catch {
      alert("Login failed. Please try again.");
    }
  });

  // Logout
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    loginButtons.style.display = "flex";
    userInfoDiv.style.display = "none";
    welcomeUser.textContent = "";
  });

  // Auto-login check
  try {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (currentUser) updateUI(currentUser);
  } catch {}

  function updateUI(user) {
    welcomeUser.textContent = `Welcome, ${user.username}`;
    loginButtons.style.display = "none";
    userInfoDiv.style.display = "flex";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  }

  // Scroll to courses
  $('.courses')?.addEventListener('click', () => {
    $('#courses')?.scrollIntoView({ behavior: 'smooth' });
  });

  $('.aboutus')?.addEventListener('click', () => {
    $('#about')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Profile modal
  profileBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    profileModal?.classList.add('show');
    editableFields.style.display = 'none';
    confirmPasswordInput.value = '';
  });

  closeProfile?.addEventListener('click', () => {
    profileModal?.classList.remove('show');
  });

  confirmPasswordInput?.addEventListener('input', () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const enteredPassword = confirmPasswordInput.value.trim();

      if (storedUser && enteredPassword === storedUser.password) {
        editableFields.style.display = 'block';
        $('#editUsername').value = storedUser.username;
        $('#editEmail').value = storedUser.email;
        $('#editFullName').value = storedUser.fullName;
        $('#editEducation').value = storedUser.education;
        $('#editPassword').value = storedUser.password;
      } else {
        editableFields.style.display = 'none';
      }
    } catch {}
  });

  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const enteredPassword = confirmPasswordInput.value.trim();

      if (enteredPassword !== storedUser.password) {
        alert("Incorrect password. Cannot save changes.");
        return;
      }

      const updatedUser = {
        username: $('#editUsername').value.trim(),
        email: $('#editEmail').value.trim(),
        fullName: $('#editFullName').value.trim(),
        education: $('#editEducation').value.trim(),
        password: $('#editPassword').value.trim()
      };

      localStorage.setItem("userData", JSON.stringify(updatedUser));
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      welcomeUser.textContent = `Welcome, ${updatedUser.username}`;
      profileModal?.classList.remove('show');
      alert("Profile updated!");
    } catch {
      alert("Update failed. Please try again.");
    }
  });

  // Toggle info blocks
  $$('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
      const targetClass = button.getAttribute('data-target');
      const content = button.closest('.info-card').querySelector(`.${targetClass}`);
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      $$('.toggle-btn').forEach(btn => {
        const card = btn.closest('.info-card');
        const target = btn.getAttribute('data-target');
        const block = card.querySelector(`.${target}`);
        block.style.maxHeight = '0px';
        block.style.opacity = '0';
        block.style.marginTop = '0';
        btn.textContent = 'More Info';
      });

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        content.style.marginTop = '15px';
        button.textContent = 'Hide Info';
      }
    });
  });

  // College popup
  window.openCollegeWindow = function(college) {
    const urls = {
      computer: 'computer.html',
      business: 'business.html',
      engineering: 'engineering.html',
      education: 'education.html'
    };

    const url = urls[college];
    if (url) {
      window.open(url, '_blank', 'width=600,height=600,left=200,top=100,resizable=yes');
    }
  };  
  // Save state
localStorage.setItem('username', 'marcus');

// Retrieve state on another page
const user = localStorage.getItem('username');
if (user) {
  document.querySelector('#welcome').textContent = `Welcome back, ${user}`;
}
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.6 });

sections.forEach(section => observer.observe(section));

$$('.nav-btn').forEach(link => {
  link.classList.toggle('active', link.getAttribute('data-target') === target);
});

});
