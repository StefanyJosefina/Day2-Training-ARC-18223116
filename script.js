document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const nav = document.querySelector("nav")
  
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        nav.style.display = nav.style.display === "block" ? "none" : "block"
      })
    }
  
    // Fetch products from API
    const productGrid = document.getElementById("product-grid")
    const loadingSpinner = document.querySelector(".loading")
    const sortSelect = document.getElementById("sort")
  
    let products = []
  
    async function fetchProducts() {
      try {
        const response = await fetch("https://dummyjson.com/products?limit=10")
        const data = await response.json()
        products = data.products
  
        // Hide loading spinner
        loadingSpinner.style.display = "none"
  
        // Sort and display products
        sortAndDisplayProducts()
      } catch (error) {
        console.error("Error fetching products:", error)
        loadingSpinner.style.display = "none"
        productGrid.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>'
      }
    }
  
    function sortAndDisplayProducts() {
      const sortBy = sortSelect.value
  
      // Sort products
      const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "price") {
          return a.price - b.price
        } else {
          return b.rating - a.rating
        }
      })
  
      // Display products
      displayProducts(sortedProducts)
    }
  
    function displayProducts(productsToDisplay) {
      productGrid.innerHTML = ""
  
      productsToDisplay.forEach((product) => {
        const productCard = document.createElement("div")
        productCard.className = "product-card"
  
        // Create star rating HTML
        let starsHTML = ""
        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(product.rating)) {
            starsHTML += '<i class="fas fa-star"></i>'
          } else if (i === Math.ceil(product.rating) && !Number.isInteger(product.rating)) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>'
          } else {
            starsHTML += '<i class="far fa-star"></i>'
          }
        }
  
        // Truncate description
        const shortDescription =
          product.description.length > 100 ? product.description.substring(0, 100) + "..." : product.description
  
        productCard.innerHTML = `
                  <div class="product-image">
                      <img src="${product.thumbnail}" alt="${product.title}">
                  </div>
                  <div class="product-content">
                      <h3 class="product-title">${product.title}</h3>
                      <p class="product-description" data-full-description="${product.description}">${shortDescription}</p>
                      ${product.description.length > 100 ? '<button class="read-more">Read more</button>' : ""}
                      <div class="product-meta">
                          <div class="product-price">$${product.price}</div>
                          <div class="product-rating">
                              ${starsHTML}
                              <span>${product.rating}</span>
                          </div>
                      </div>
                      <button class="add-to-cart">Add to Cart</button>
                  </div>
              `
  
        productGrid.appendChild(productCard)
      })
  
      // Add event listeners to "Read more" buttons
      document.querySelectorAll(".read-more").forEach((button) => {
        button.addEventListener("click", function () {
          const descriptionElement = this.previousElementSibling
          const fullDescription = descriptionElement.getAttribute("data-full-description")
  
          if (this.textContent === "Read more") {
            descriptionElement.textContent = fullDescription
            this.textContent = "Read less"
          } else {
            descriptionElement.textContent = fullDescription.substring(0, 100) + "..."
            this.textContent = "Read more"
          }
        })
      })
  
      // Add event listeners to "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
          const productTitle = this.closest(".product-card").querySelector(".product-title").textContent
          alert(`${productTitle} added to cart!`)
        })
      })
    }
  
    // Sort change event
    if (sortSelect) {
      sortSelect.addEventListener("change", sortAndDisplayProducts)
    }
  
    // Fetch products if we're on the home page
    if (productGrid) {
      fetchProducts()
    }
  
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        })
      })
    })
  
    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault()
        const name = this.querySelector("#name").value
        const email = this.querySelector("#email").value
        const message = this.querySelector("#message").value
  
        // Here you would typically send this data to a server
        // For now, we'll just log it and show an alert
        console.log("Form submitted:", { name, email, message })
        alert("Thank you for your message! We will get back to you soon.")
  
        // Reset the form
        this.reset()
      })
    }
  
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll("nav ul li a")
  
    window.addEventListener("scroll", () => {
      let current = ""
      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id")
        }
      })
  
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href").substring(1) === current) {
          link.classList.add("active")
        }
      })
    })
  })  