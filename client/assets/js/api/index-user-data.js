window.addEventListener('DOMContentLoaded', function () {
  // Initially hide user profile and dashboard link
  const userProfile = document.querySelector('.user-profile');
  const dashboardLink = document.getElementById('dashboardLink');
  
  if (userProfile) {
      userProfile.style.display = 'none';
  }
  if (dashboardLink) {
      dashboardLink.style.display = 'none';
  }

  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/userName', true);

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              const user = JSON.parse(xhr.responseText);
              const fullName = user.full_name;

              document.getElementById('headerFullName').textContent = fullName;

              // Create initials for avatar
              const initials = fullName.split(' ')
                  .map(name => name.charAt(0).toUpperCase())
                  .slice(0, 2)
                  .join('');
              document.getElementById('userAvatar').textContent = initials;

              // Show user profile and dashboard button
              if (userProfile) {
                  userProfile.style.display = 'flex';
                  
                  // Add click handler to redirect to appropriate profile page
                  userProfile.onclick = function() {
                      if (user.user_type === 'student') {
                          window.location.href = '/student-profile';
                      } else if (user.user_type === 'company') {
                          window.location.href = '/company-profile';
                      }
                  };
              }

              // Show and setup dashboard link
              if (dashboardLink) {
                  dashboardLink.style.display = 'inline';
                  dashboardLink.onclick = function() {
                      if (user.user_type === 'student') {
                          window.location.href = '/student-dashboard';
                      } else if (user.user_type === 'company') {
                          window.location.href = '/company-dashboard';
                      }
                  };
              }

              // Change Login to Logout
              const authButton = document.getElementById('authButton');
              if (authButton) {
                  authButton.textContent = 'Logout';
                  authButton.onclick = () => window.location.href = '/api/logout';
              }

              // Setup Browse internships button
              const browseBtn = document.getElementById('browse-btn');
              if (browseBtn) {
                  browseBtn.onclick = function() {
                      if (user.user_type === 'student') {
                          window.location.href = '/search-internship';
                      } else if (user.user_type === 'company') {
                          window.location.href = '/manage-internships';
                      }
                  };
              }
          } else {
              // User not logged in - keep profile and dashboard hidden
              if (userProfile) {
                  userProfile.style.display = 'none';
              }
              if (dashboardLink) {
                  dashboardLink.style.display = 'none';
              }

              // Setup Browse internships button for unauthenticated users
              const browseBtn = document.getElementById('browse-btn');
              if (browseBtn) {
                  browseBtn.onclick = function() {
                      window.location.href = '/auth';
                  };
              }
          }
      }
  };

  xhr.onerror = function () {
      // Error - keep profile and dashboard hidden
      if (userProfile) {
          userProfile.style.display = 'none';
      }
      if (dashboardLink) {
          dashboardLink.style.display = 'none';
      }

      // Setup Browse internships button for unauthenticated users (error case)
      const browseBtn = document.getElementById('browse-btn');
      if (browseBtn) {
          browseBtn.onclick = function() {
              window.location.href = '/auth';
          };
      }
  };

  xhr.send();
});