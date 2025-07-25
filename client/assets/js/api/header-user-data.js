window.addEventListener('DOMContentLoaded', function () {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/userName', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const user = JSON.parse(xhr.responseText);
                const fullName = user.full_name;
                
                // Update name
                document.getElementById('headerFullName').textContent = fullName;
                
                // Create initials for avatar
                const initials = fullName.split(' ')
                    .map(name => name.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join('');
                document.getElementById('userAvatar').textContent = initials;
            }
            else {
                window.location.href = '/auth';
            }
        }
    };

    xhr.onerror = function () {
        console.log('Error fetching user data');
        window.location.href = '/auth';
    };

    xhr.send();
})