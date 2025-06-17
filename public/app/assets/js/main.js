document.addEventListener('DOMContentLoaded', () => {
    toggleDisplay('.modal-profile-menu', '#my_profile_photo');
    toggleDisplay('.modal-header-lang', '.additional-nav .icon-lang');
    hideOnOutsideClick('.modal-profile-menu', '#my_profile_photo');
    hideOnOutsideClick('.modal-header-lang', '.additional-nav .icon-lang');
});

//header .profile-section
//.modal-profile-menu
