document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       UYTOP — INTERACTIVE JAVASCRIPT
       Har bir action foydalanuvchiga feedback beradi
    ===================================================== */


    /* =====================================================
       1. MOBILE MENU
    ===================================================== */

    const menuBtn = document.getElementById("menuBtn");
    const mainNav = document.getElementById("mainNav");

    if (menuBtn && mainNav) {

        menuBtn.addEventListener("click", () => {

            mainNav.classList.toggle("open");

            const isOpen =
                mainNav.classList.contains("open");

            menuBtn.textContent =
                isOpen ? "×" : "☰";

            menuBtn.setAttribute(
                "aria-expanded",
                isOpen
            );

            // Tugmaga kichik animation
            menuBtn.animate(
                [
                    {
                        transform: "scale(.8) rotate(-10deg)",
                        opacity: .5
                    },
                    {
                        transform: "scale(1) rotate(0)",
                        opacity: 1
                    }
                ],
                {
                    duration: 300,
                    easing: "cubic-bezier(.2,.8,.2,1)"
                }
            );

        });


        // Menu link bosilganda yopiladi
        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                menuBtn.textContent = "☰";

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }



    /* =====================================================
       2. FAVORITES ❤️
    ===================================================== */

    let favorites =
        JSON.parse(
            localStorage.getItem("uytopFavorites")
        ) || [];


    const favoriteCount =
        document.getElementById("favoriteCount");


    function updateFavoriteCount() {

        if (!favoriteCount) return;

        favoriteCount.textContent =
            favorites.length;

        // Counter animation
        favoriteCount.animate(
            [
                {
                    transform: "scale(.6)",
                    opacity: .4
                },
                {
                    transform: "scale(1.25)",
                    opacity: 1
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 400,
                easing: "ease-out"
            }
        );

    }


    function updateHeartButtons() {

        document
            .querySelectorAll(".heart-btn")
            .forEach(button => {

                const id =
                    button.dataset.id;

                if (favorites.includes(id)) {

                    button.classList.add("active");

                    button.textContent = "♥";

                } else {

                    button.classList.remove("active");

                    button.textContent = "♡";

                }

            });

    }


    function saveFavorites() {

        localStorage.setItem(
            "uytopFavorites",
            JSON.stringify(favorites)
        );

        updateFavoriteCount();

        updateHeartButtons();

    }


    document
        .querySelectorAll(".heart-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        button.dataset.id;


                    // Qo‘shish
                    if (!favorites.includes(id)) {

                        favorites.push(id);

                        button.animate(
                            [
                                {
                                    transform: "scale(1)"
                                },
                                {
                                    transform: "scale(1.5)"
                                },
                                {
                                    transform: "scale(.9)"
                                },
                                {
                                    transform: "scale(1)"
                                }
                            ],
                            {
                                duration: 450,
                                easing: "ease-out"
                            }
                        );

                        showToast(
                            "❤️ Uy tanlanganlarga qo‘shildi"
                        );

                    }

                    // Olib tashlash
                    else {

                        favorites =
                            favorites.filter(
                                item => item !== id
                            );

                        button.animate(
                            [
                                {
                                    transform: "scale(1)"
                                },
                                {
                                    transform: "scale(.7)"
                                },
                                {
                                    transform: "scale(1)"
                                }
                            ],
                            {
                                duration: 300
                            }
                        );

                        showToast(
                            "Uy tanlanganlardan olib tashlandi"
                        );

                    }

                    saveFavorites();

                }
            );

        });


    updateFavoriteCount();
    updateHeartButtons();



    /* =====================================================
       3. HOME SEARCH 🔎
    ===================================================== */

    const searchForm =
        document.getElementById("searchForm");

    const searchBtn =
        document.getElementById("searchBtn");

    const locationFilter =
        document.getElementById("locationFilter");

    const typeFilter =
        document.getElementById("typeFilter");

    const priceFilter =
        document.getElementById("priceFilter");

    const searchStatus =
        document.getElementById("searchStatus");


    function filterProperties() {

        const cards =
            document.querySelectorAll(
                ".property-card"
            );

        if (!cards.length) return;


        const location =
            locationFilter?.value || "all";

        const type =
            typeFilter?.value || "all";

        const maxPrice =
            priceFilter?.value || "all";


        let visible = 0;


        cards.forEach(card => {

            const cardLocation =
                card.dataset.location;

            const cardType =
                card.dataset.type;

            const cardPrice =
                Number(card.dataset.price);


            const locationMatch =
                location === "all" ||
                cardLocation === location;


            const typeMatch =
                type === "all" ||
                cardType === type;


            const priceMatch =
                maxPrice === "all" ||
                cardPrice <= Number(maxPrice);


            const show =
                locationMatch &&
                typeMatch &&
                priceMatch;


            if (show) {

                card.style.display = "";

                visible++;


                // Chiroyli kirib kelish
                card.animate(
                    [
                        {
                            opacity: 0,
                            transform:
                                "translateY(25px) scale(.97)"
                        },
                        {
                            opacity: 1,
                            transform:
                                "translateY(0) scale(1)"
                        }
                    ],
                    {
                        duration: 500,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)"
                    }
                );

            } else {

                card.style.display = "none";

            }

        });


        const noResults =
            document.getElementById("noResults");


        if (noResults) {

            noResults.style.display =
                visible === 0
                    ? "block"
                    : "none";

        }


        if (searchStatus) {

            searchStatus.textContent =
                visible === 0
                    ? "Mos uy topilmadi."
                    : `${visible} ta uy topildi.`;

            searchStatus.animate(
                [
                    {
                        opacity: 0,
                        transform: "translateY(-5px)"
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)"
                    }
                ],
                {
                    duration: 350
                }
            );

        }


        // Natijalarga olib borish
        const propertySection =
            document.querySelector(
                ".properties-section"
            );


        if (propertySection) {

            setTimeout(() => {

                propertySection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 150);

        }

    }


    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                // Search tugmasi animation
                if (searchBtn) {

                    searchBtn.animate(
                        [
                            {
                                transform: "scale(1)"
                            },
                            {
                                transform: "scale(.92)"
                            },
                            {
                                transform: "scale(1)"
                            }
                        ],
                        {
                            duration: 250
                        }
                    );

                }

                filterProperties();

            }
        );

    } else if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            filterProperties
        );

    }



    /* =====================================================
       4. LIVE FILTER
       Select o‘zgarganda darhol natija
    ===================================================== */

    [
        locationFilter,
        typeFilter,
        priceFilter
    ]
        .filter(Boolean)
        .forEach(filter => {

            filter.addEventListener(
                "change",
                filterProperties
            );

        });



    /* =====================================================
       5. APARTMENT FILTER
    ===================================================== */

    const districtFilter =
        document.getElementById(
            "districtFilter"
        );

    const roomsFilter =
        document.getElementById(
            "roomsFilter"
        );

    const sortFilter =
        document.getElementById(
            "sortFilter"
        );

    const apartmentGrid =
        document.getElementById(
            "apartmentGrid"
        );


    function filterApartments() {

        if (!apartmentGrid) return;


        const cards =
            [
                ...apartmentGrid
                    .querySelectorAll(
                        ".property-card"
                    )
            ];


        const district =
            districtFilter?.value || "all";

        const rooms =
            roomsFilter?.value || "all";


        let visible = 0;


        cards.forEach(card => {

            const matchDistrict =
                district === "all" ||
                card.dataset.district === district;


            const matchRooms =
                rooms === "all" ||
                card.dataset.rooms === rooms;


            const show =
                matchDistrict &&
                matchRooms;


            if (show) {

                card.style.display = "";

                visible++;

                card.animate(
                    [
                        {
                            opacity: 0,
                            transform:
                                "translateY(15px)"
                        },
                        {
                            opacity: 1,
                            transform:
                                "translateY(0)"
                        }
                    ],
                    {
                        duration: 400
                    }
                );

            } else {

                card.style.display = "none";

            }

        });


        sortApartments();

        updateApartmentCount();

    }



    /* =====================================================
       6. SORT APARTMENTS
    ===================================================== */

    function sortApartments() {

        if (!apartmentGrid || !sortFilter)
            return;


        const cards =
            [
                ...apartmentGrid
                    .querySelectorAll(
                        ".property-card"
                    )
            ];


        const sort =
            sortFilter.value;


        cards.sort((a, b) => {

            const priceA =
                Number(a.dataset.price);

            const priceB =
                Number(b.dataset.price);


            if (sort === "cheap") {

                return priceA - priceB;

            }


            if (sort === "expensive") {

                return priceB - priceA;

            }


            return 0;

        });


        cards.forEach((card, index) => {

            apartmentGrid.appendChild(card);

            card.animate(
                [
                    {
                        opacity: .5,
                        transform:
                            "translateY(10px)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0)"
                    }
                ],
                {
                    duration: 300,
                    delay: index * 35
                }
            );

        });

    }



    /* =====================================================
       7. RESULT COUNT
    ===================================================== */

    function updateApartmentCount() {

        if (!apartmentGrid) return;


        const cards =
            [
                ...apartmentGrid
                    .querySelectorAll(
                        ".property-card"
                    )
            ];


        const visible =
            cards.filter(
                card =>
                    card.style.display !== "none"
            ).length;


        const resultCount =
            document.getElementById(
                "resultCount"
            );


        if (resultCount) {

            resultCount.textContent =
                `${visible} ta uy`;

        }


        const noResults =
            document.getElementById(
                "noResults"
            );


        if (noResults) {

            noResults.style.display =
                visible === 0
                    ? "block"
                    : "none";

        }

    }


    if (districtFilter) {

        districtFilter.addEventListener(
            "change",
            filterApartments
        );

    }


    if (roomsFilter) {

        roomsFilter.addEventListener(
            "change",
            filterApartments
        );

    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            () => {

                sortApartments();

                updateApartmentCount();

                showToast(
                    "Saralash yangilandi"
                );

            }
        );

    }



    /* =====================================================
       8. PROPERTY DATA
    ===================================================== */

    const houses = {

        house1: {
            title:
                "Zamonaviy 3 xonali kvartira",
            location:
                "Chilonzor, Toshkent",
            price:
                "$85 000",
            image:
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "3 xona",
            area:
                "78 m²",
            year:
                "2022",
            condition:
                "Yaxshi",
            owner:
                "Azizbek Karimov"
        },


        house2: {
            title:
                "Keng va shinam hovli",
            location:
                "Yunusobod, Toshkent",
            price:
                "$120 000",
            image:
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "5 xona",
            area:
                "240 m²",
            year:
                "2019",
            condition:
                "Yaxshi",
            owner:
                "Jasur Aliyev"
        },


        house3: {
            title:
                "Yangi ta'mirdagi kvartira",
            location:
                "Sergeli, Toshkent",
            price:
                "$62 000",
            image:
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "2 xona",
            area:
                "54 m²",
            year:
                "2023",
            condition:
                "Yangi",
            owner:
                "Bekzod Rasulov"
        },


        apt1: {
            title:
                "Zamonaviy 3 xonali kvartira",
            location:
                "Chilonzor, Toshkent",
            price:
                "$85 000",
            image:
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "3 xona",
            area:
                "78 m²",
            year:
                "2022",
            condition:
                "Yaxshi",
            owner:
                "Azizbek Karimov"
        },


        apt2: {
            title:
                "Premium 4 xonali kvartira",
            location:
                "Yunusobod, Toshkent",
            price:
                "$135 000",
            image:
                "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "4 xona",
            area:
                "112 m²",
            year:
                "2021",
            condition:
                "A'lo",
            owner:
                "Sardor Karimov"
        },


        apt3: {
            title:
                "Yangi ta'mirdagi kvartira",
            location:
                "Sergeli, Toshkent",
            price:
                "$62 000",
            image:
                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "2 xona",
            area:
                "54 m²",
            year:
                "2023",
            condition:
                "Yangi",
            owner:
                "Bekzod Rasulov"
        },


        apt4: {
            title:
                "Oilaviy 3 xonali kvartira",
            location:
                "Olmazor, Toshkent",
            price:
                "$78 000",
            image:
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "3 xona",
            area:
                "71 m²",
            year:
                "2020",
            condition:
                "Yaxshi",
            owner:
                "Shoxrux Abdullayev"
        },


        apt5: {
            title:
                "Yorug' 2 xonali kvartira",
            location:
                "Chilonzor, Toshkent",
            price:
                "$69 000",
            image:
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "2 xona",
            area:
                "59 m²",
            year:
                "2021",
            condition:
                "Yaxshi",
            owner:
                "Muhammad Ali"
        },


        apt6: {
            title:
                "Yangi binodagi 3 xonali uy",
            location:
                "Yunusobod, Toshkent",
            price:
                "$99 000",
            image:
                "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1200&q=90",
            rooms:
                "3 xona",
            area:
                "82 m²",
            year:
                "2024",
            condition:
                "Yangi",
            owner:
                "Diyorbek Hasanov"
        }

    };



    /* =====================================================
       9. PROPERTY MODAL
    ===================================================== */

    const modal =
        document.getElementById(
            "houseModal"
        );

    const modalBody =
        document.getElementById(
            "modalBody"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalOverlay =
        document.querySelector(
            ".modal-overlay"
        );


    function openModal(id) {

        if (!modal || !modalBody)
            return;


        const house =
            houses[id];


        if (!house) {

            showToast(
                "Uy ma'lumotlari topilmadi"
            );

            return;

        }


        modalBody.innerHTML = `

            <img
                class="modal-image"
                src="${house.image}"
                alt="${house.title}"
            >

            <div class="modal-body">

                <div class="section-label">
                    TASDIQLANGAN UY
                </div>

                <h2 id="modalTitle">
                    ${house.title}
                </h2>

                <div class="property-location">
                    📍 ${house.location}
                </div>

                <div class="modal-price">
                    ${house.price}
                </div>

                <div class="modal-grid">

                    <div class="modal-info">
                        <small>Xonalar</small>
                        <strong>
                            ${house.rooms}
                        </strong>
                    </div>

                    <div class="modal-info">
                        <small>Maydon</small>
                        <strong>
                            ${house.area}
                        </strong>
                    </div>

                    <div class="modal-info">
                        <small>Qurilgan yil</small>
                        <strong>
                            ${house.year}
                        </strong>
                    </div>

                    <div class="modal-info">
                        <small>Holati</small>
                        <strong>
                            ${house.condition}
                        </strong>
                    </div>

                    <div class="modal-info">
                        <small>Mulk egasi</small>
                        <strong>
                            ${house.owner}
                        </strong>
                    </div>

                    <div class="modal-info">
                        <small>Hujjat holati</small>

                        <strong style="color:#00e5a0">
                            ✓ Tasdiqlangan
                        </strong>
                    </div>

                </div>

                <div style="margin-top:25px">

                    <a
                        href="aloqa.html"
                        class="btn btn-primary"
                    >
                        Egasi bilan bog'lanish →
                    </a>

                </div>

            </div>
        `;


        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );


        // Modal kirish animation
        const modalContent =
            modal.querySelector(
                ".modal-content"
            );


        if (modalContent) {

            modalContent.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(40px) scale(.94)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }
                ],
                {
                    duration: 450,
                    easing:
                        "cubic-bezier(.16,1,.3,1)"
                }
            );

        }


        if (modalClose) {

            modalClose.focus();

        }

    }



    document
        .querySelectorAll(".details-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openModal(
                        button.dataset.house
                    );

                }
            );

        });



    /* =====================================================
       10. CLOSE MODAL
    ===================================================== */

    function closeModal() {

        if (!modal) return;


        const modalContent =
            modal.querySelector(
                ".modal-content"
            );


        if (modalContent) {

            modalContent.animate(
                [
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    },
                    {
                        opacity: 0,
                        transform:
                            "translateY(25px) scale(.96)"
                    }
                ],
                {
                    duration: 220,
                    easing: "ease-in"
                }
            );

        }


        setTimeout(() => {

            modal.classList.remove(
                "active"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "modal-open"
            );

        }, 180);

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal?.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }

        }
    );



    /* =====================================================
       11. TOAST SYSTEM
    ===================================================== */

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    let toastTimer;


    function showToast(message) {

        if (!toast) return;


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        toast.classList.add("show");


        toast.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(20px) scale(.9)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0) scale(1)"
                }
            ],
            {
                duration: 350,
                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );


        clearTimeout(toastTimer);


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2500);

    }



    /* =====================================================
       12. SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".property-card, .step, .info-card, .contact-box, .problem-card, .house-type, .solution-item"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.style.opacity =
                                    "1";

                                entry.target.style.transform =
                                    "translateY(0)";

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .12
                }
            );


        revealElements.forEach(
            element => {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(30px)";

                element.style.transition =
                    "opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1)";

                observer.observe(
                    element
                );

            }
        );

    }



    /* =====================================================
       13. ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "index.html";


    document
        .querySelectorAll(".nav a")
        .forEach(link => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (href === currentPage) {

                link.classList.add(
                    "active"
                );

            }

        });



    /* =====================================================
       14. BUTTON CLICK EFFECT
    ===================================================== */

    document
        .querySelectorAll(
            "button, .btn, .property-button, .call-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    button.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(.96)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 220
                        }
                    );

                }
            );

        });



    /* =====================================================
       15. IMAGE LOADING EFFECT
    ===================================================== */

    document
        .querySelectorAll("img")
        .forEach(image => {

            if (image.complete) {

                image.classList.add(
                    "loaded"
                );

            } else {

                image.addEventListener(
                    "load",
                    () => {

                        image.classList.add(
                            "loaded"
                        );

                    }
                );

            }

        });



    /* =====================================================
       16. CARD MOUSE TILT
    ===================================================== */

    document
        .querySelectorAll(
            ".property-card, .house-type"
        )
        .forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    if (
                        window.innerWidth < 900
                    ) return;


                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        (y - centerY) /
                        25;

                    const rotateY =
                        (centerX - x) /
                        25;


                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-8px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });



    /* =====================================================
       17. ESC KEY FOR MOBILE MENU
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                mainNav?.classList.contains(
                    "open"
                )
            ) {

                mainNav.classList.remove(
                    "open"
                );

                if (menuBtn) {

                    menuBtn.textContent =
                        "☰";

                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );



    /* =====================================================
       18. PAGE LOADED
    ===================================================== */

    window.setTimeout(() => {

        document.body.classList.add(
            "page-loaded"
        );

    }, 100);



    console.log(
        "🏠 UYTOP — Sayt muvaffaqiyatli ishga tushdi!"
    );

});