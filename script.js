/* script.js
   Small JavaScript for toggling the mobile menu and improving accessibility.
   The script is intentionally minimal and unobtrusive to ensure fast loading and no heavy dependencies.
   Every line or block is commented to explain its purpose, how it works, and why it's implemented this way.
   This makes it easy for a first-time reader to understand and modify.
*/

/* Wait for DOMContentLoaded event to ensure all HTML elements are loaded before querying them. This prevents errors if script is loaded early. */
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the hamburger button and mobile menu using their IDs for direct access.
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Defensive check: if either element is missing (e.g., due to HTML changes), do nothing to prevent JS errors and allow graceful degradation.
  if (!hamburgerBtn || !mobileMenu) return;

  /* Toggle function:
     - Toggles the 'open' class for CSS-based animation (CSS reacts to .open to transform the icon and show the menu).
     - Toggles the hidden attribute on the menu for semantic accessibility (hidden removes from layout, visual, and accessibility tree).
     - Updates aria-expanded on the button so screen readers (e.g., NVDA, VoiceOver) know the menu state and announce it correctly.
     This function is called on button click, ensuring mobile menu interactivity.
  */
  function toggleMenu() {
    const isOpen = !mobileMenu.hasAttribute("hidden"); // Check current state: true if menu is visible (no hidden attribute).

    // If menu is open, close it; else open it. This if-else ensures clear state management.
    if (isOpen) {
      // Close the menu:
      mobileMenu.setAttribute("hidden", ""); // Adds hidden attribute to hide visually and semantically.
      hamburgerBtn.classList.remove("open"); // Removes 'open' class to revert hamburger icon to three bars via CSS.
      hamburgerBtn.setAttribute("aria-expanded", "false"); // Updates ARIA for accessibility compliance (WCAG 4.1.2).
    } else {
      // Open the menu:
      mobileMenu.removeAttribute("hidden"); // Removes hidden to show the menu.
      hamburgerBtn.classList.add("open"); // Adds 'open' class to animate hamburger to an 'X' via CSS transforms.
      hamburgerBtn.setAttribute("aria-expanded", "true"); // Updates ARIA to indicate expanded state.
    }
  }

  // Attach click handler to the button. This listens for clicks and calls toggleMenu.
  hamburgerBtn.addEventListener("click", toggleMenu);

  /* Optional enhancement: close the menu if a user clicks a navigation link inside the mobile menu.
     This improves UX on small screens by auto-closing after selection, reducing taps needed.
     Event delegation: listens on the menu and checks if the target is an <a> tag.
  */
  mobileMenu.addEventListener("click", function (e) {
    // If the clicked element is a link (tagName === "A"), close the menu.
    if (e.target.tagName === "A") {
      // Close the menu using the same logic as toggle (but force close).
      mobileMenu.setAttribute("hidden", "");
      hamburgerBtn.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* Optional accessibility: close the menu when the user presses Escape key.
     This follows common web patterns (e.g., modals) and meets WCAG 2.1.2 (No Keyboard Trap) expectations for keyboard users.
  */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !mobileMenu.hasAttribute("hidden")) { // Only if menu is open.
      mobileMenu.setAttribute("hidden", "");
      hamburgerBtn.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.focus(); // Return focus to button for better keyboard navigation.
    }
  });
});
