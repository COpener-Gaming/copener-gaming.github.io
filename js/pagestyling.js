// Add this JavaScript to toggle the active class on setup click
document.addEventListener('DOMContentLoaded', function () {
  const setups = document.querySelectorAll('.setup');

  setups.forEach(setup => {
    setup.addEventListener('click', function () {
      // Toggle active class on the clicked setup
      this.classList.toggle('active');

      // Close other setups' dropdowns
      setups.forEach(otherSetup => {
        if (otherSetup !== this && otherSetup.classList.contains('active')) {
          otherSetup.classList.remove('active');
        }
      });
    });
  });
});
