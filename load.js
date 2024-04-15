document.addEventListener("DOMContentLoaded", function() {
  if (!sessionStorage.getItem('firstLoad')) {
      // Set 'firstLoad' so it doesn't animate again
      sessionStorage.setItem('firstLoad', 'true');

      // Add animation class to the element
      document.getElementById('logo').classList.add('slide-bck-tl');
  }
});